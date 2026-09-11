import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root } from '../automation/content.mjs';
const routes=['blog/','blog/website-project-brief/','blog/website-handover-checklist/'];
const titles=new Set();
let links=0;
for(const route of routes){
  const file=path.join(root,route,'index.html');
  const html=fs.readFileSync(file,'utf8');
  const title=html.match(/<title>(.*?)<\/title>/)[1];
  assert.ok(!titles.has(title),'Duplicate title');titles.add(title);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert.ok(html.includes(`rel="canonical" href="https://cholbei.com/${route}"`));
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  assert.ok(!/noindex|nofollow/.test(html));
  for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
    const schema=JSON.parse(match[1]);
    if(route!=='blog/')assert.ok(schema.some(s=>s['@type']==='BlogPosting'));
  }
  for(const match of html.matchAll(/(?:href|src)="([^" ]+)"/g)){
    const value=match[1];if(/^(?:https?:|mailto:|tel:)/.test(value))continue;
    const [relative,fragment]=value.split('#');
    let target=relative?path.resolve(path.dirname(file),relative):file;
    assert.ok(fs.existsSync(target),`${route}: missing ${value}`);
    if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
    assert.ok(fs.existsSync(target),`${route}: missing index for ${value}`);
    if(fragment)assert.ok(fs.readFileSync(target,'utf8').includes(`id="${fragment}"`),`${route}: missing anchor ${value}`);
    links++;
  }
  assert.ok(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes(`<loc>https://cholbei.com/${route}</loc>`));
  if(route!=='blog/'){
    const other=routes.find(r=>r!=='blog/'&&r!==route);
    assert.ok(html.includes(`href="../../${other}"`),'Missing reciprocal article link');
  }
}
console.log(`Blog SEO, structured data, reciprocal links and ${links} local links/assets passed.`);
