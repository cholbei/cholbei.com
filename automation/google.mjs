import fs from 'node:fs';
import path from 'node:path';
import { createSign } from 'node:crypto';
import { root, readJson } from './content.mjs';
export function stateDirectory() {
  if (!process.env.LOCALAPPDATA) throw Error('LOCALAPPDATA is required for private automation state');
  const dir = path.join(process.env.LOCALAPPDATA,'CholbeiAutomation');
  if (path.relative(root, dir).startsWith('..') === false) throw Error('Private state must be outside the website');
  fs.mkdirSync(dir,{recursive:true}); return dir;
}
async function googleToken(settings) {
  if (!settings.serviceAccountFile) throw Error('Google service-account file is not configured');
  const file = path.resolve(settings.serviceAccountFile);
  if (!path.relative(root,file).startsWith('..')) throw Error('Google credentials must be outside the website');
  const key = readJson(file);
  const now=Math.floor(Date.now()/1000);
  const encode=x=>Buffer.from(JSON.stringify(x)).toString('base64url');
  const content=encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:key.client_email,scope:'https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
  const signature=createSign('RSA-SHA256').update(content).sign(key.private_key,'base64url');
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:content+'.'+signature}),signal:AbortSignal.timeout(20000)});
  if (!r.ok) throw Error('Google authentication failed (HTTP '+r.status+'). Check key and API access.');
  return (await r.json()).access_token;
}
async function request(url, token, body, method='POST') {
  const r=await fetch(url,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(25000)});
  if(!r.ok) throw Error('Google API request failed (HTTP '+r.status+'). Check enabled APIs and property permissions.');
  return r.status===204?{}:r.text().then(s=>s?JSON.parse(s):{});
}
export async function reports(config, settings) {
  const property=settings.ga4PropertyId || config.ga4PropertyId;
  if (!/^\d+$/.test(property || '')) throw Error('Configure numeric GA4 Property ID; Stream ID is not the Property ID');
  const token=await googleToken(settings);
  const day=offset=>new Date(Date.now()-offset*86400000).toISOString().slice(0,10);
  const site=encodeURIComponent(settings.searchConsoleProperty || config.searchConsoleProperty);
  const [search, analytics]=await Promise.all([
    request(`https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,token,{startDate:day(31),endDate:day(3),dimensions:['page'],rowLimit:100}),
    request(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,token,{dateRanges:[{startDate:'28daysAgo',endDate:'yesterday'}],dimensions:[{name:'pagePath'}],metrics:[{name:'activeUsers'},{name:'screenPageViews'},{name:'eventCount'}],limit:100})
  ]);
  return {generatedAt:new Date().toISOString(),search,analytics};
}
export async function submitSitemap(config, settings) {
  const token=await googleToken(settings);
  const site=encodeURIComponent(settings.searchConsoleProperty || config.searchConsoleProperty);
  return request(`https://www.googleapis.com/webmasters/v3/sites/${site}/sitemaps/${encodeURIComponent(config.siteUrl+'/sitemap.xml')}`,token,null,'PUT');
}
export async function inspectPage(config,settings,url) {
  return request('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',await googleToken(settings),{inspectionUrl:url,siteUrl:settings.searchConsoleProperty||config.searchConsoleProperty});
}
export async function checkGtm(config) {
  const r=await fetch('https://www.googletagmanager.com/gtm.js?id='+config.gtmContainerId,{signal:AbortSignal.timeout(20000)});
  if(!r.ok || !(await r.text()).includes(config.measurementId)) throw Error('Published GTM container does not expose the expected GA4 tag');
  return {container:config.gtmContainerId,measurementId:config.measurementId,publicTagVerified:true};
}
