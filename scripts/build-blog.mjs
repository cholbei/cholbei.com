import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import posts from '../content/blog.mjs';
import { root, readJson, render, renderIndex, validateContent } from '../automation/content.mjs';
const write=(file,value)=>{const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,value);};
const ledgerFile=path.join(root,'automation/published.json');
const ledger=fs.existsSync(ledgerFile)?readJson(ledgerFile):[];
for(const post of posts){
  validateContent(post);
  if(!ledger.some(p=>p.slug===post.slug))ledger.push({slug:post.slug,type:'blog',route:`blog/${post.slug}/`,title:post.title,description:post.description,publishedAt:post.date+'T00:00:00+06:00',source:'editorial'});
}
write('automation/published.json',JSON.stringify(ledger,null,2)+'\n');
const result=spawnSync(process.execPath,['scripts/build-information-pages.mjs'],{cwd:root,stdio:'inherit'});
if(result.status!==0)throw Error('Information-page generation failed');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const post of posts)write(`blog/${post.slug}/index.html`,render(post,post,post.date,home,ledger.filter(p=>p.slug!==post.slug)));
write('blog/index.html',renderIndex('blog',ledger.filter(p=>p.type==='blog'),home));
let sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
for(const route of ['blog/',...posts.map(p=>`blog/${p.slug}/`)]){
  const marker=`<loc>https://cholbei.com/${route}</loc>`;
  if(!sitemap.includes(marker))sitemap=sitemap.replace('</urlset>',`  <url>${marker}<lastmod>2026-09-12</lastmod></url>\n</urlset>`);
}
write('sitemap.xml',sitemap);
console.log('Built blog listing and two linked editorial articles.');
