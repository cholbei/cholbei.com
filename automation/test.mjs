import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root, config, readJson, validateContent, destination, render } from './content.mjs';
const paragraph='Start by writing down the purpose of the website and the people it should help. Describe what those people need to find and the action they should be able to take. Gather the business information and existing content before agreeing the final project scope. Keep decisions in a shared project brief so everyone can review the same requirements.';
const data={title:'A practical website planning checklist',description:'Prepare your business website project with a clear brief, useful content, agreed milestones and a practical ownership and handover plan.',intro:paragraph,sections:Array.from({length:5},(_,i)=>({heading:'Planning stage '+(i+1),paragraphs:[paragraph,paragraph],bullets:[]}))};
assert.equal(validateContent(data),data);
assert.throws(()=>validateContent({...data,title:'<script>bad</script>'}));
assert.throws(()=>destination({type:'blog',slug:'../escape'}));
assert.throws(()=>destination({type:'service-area',slug:'dhaka'}));
const cfg=config();
assert.equal(new Set(cfg.topics.map(t=>destination(t))).size,cfg.topics.length);
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const html=render(data,{type:'blog',slug:'sample'},'2026-09-10',home);
assert.match(html,/rel="canonical" href="https:\/\/cholbei.com\/blog\/sample\/"/);
assert.equal((html.match(/<h1>/g)||[]).length,1);
assert.equal((html.match(/src="\/assets\/js\/analytics.js"/g)||[]).length,1);
assert.ok(!html.includes('href="../'));
const ledger=path.join(root,'automation/published.json');
if(fs.existsSync(ledger)) for(const page of readJson(ledger)){
 const content=fs.readFileSync(path.join(root,page.route,'index.html'),'utf8');
 assert.ok(content.includes(`rel="canonical" href="${cfg.siteUrl}/${page.route}"`));
 assert.ok(fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').includes(`<loc>${cfg.siteUrl}/${page.route}</loc>`));
 assert.equal((content.match(/<h1>/g)||[]).length,1);
 assert.ok(!/name="robots" content="noindex/.test(content));
}
console.log('Content validation, route containment, template SEO and published-page checks passed.');
