import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = fileURLToPath(new URL('../', import.meta.url));
export const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
export const config = () => readJson(path.join(root, 'automation/config.json'));
export const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validateContent(data) {
  if (!data || typeof data !== 'object') throw Error('Missing content');
  const text = (s, min, max) => {
    if (typeof s !== 'string' || s.length < min || s.length > max || /[<>]|https?:\/\/|\b(?:TODO|TBD|lorem ipsum)\b/i.test(s)) throw Error('Invalid or unfinished content text');
  };
  text(data.title, 15, 100); text(data.description, 70, 180); text(data.intro, 80, 900);
  if (!Array.isArray(data.sections) || data.sections.length < 4 || data.sections.length > 9) throw Error('Expected 4-9 sections');
  const headings = new Set();
  for (const section of data.sections) {
    text(section.heading, 5, 100);
    if (headings.has(section.heading.toLowerCase())) throw Error('Duplicate heading');
    headings.add(section.heading.toLowerCase());
    if (!Array.isArray(section.paragraphs) || section.paragraphs.length < 1 || section.paragraphs.length > 5 || !Array.isArray(section.bullets) || section.bullets.length > 12) throw Error('Invalid section');
    for (const link of section.links || []) {
      if (!/^\/(?!\/)[a-z0-9/#-]*$/.test(link.href)) throw Error('Only internal editorial links are allowed');
      text(link.label, 5, 120);
    }
    section.paragraphs.forEach(p => text(p, 40, 1500)); section.bullets.forEach(p => text(p, 8, 400));
  }
  const words = [data.intro,...data.sections.flatMap(s=>[...s.paragraphs,...s.bullets])].join(' ').split(/\s+/).length;
  if (words < 550 || words > 1800) throw Error('Content must contain 550-1800 words');
  return data;
}
export function destination(topic) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.slug)) throw Error('Invalid slug');
  if (!['blog','landing','service-area'].includes(topic.type)) throw Error('Invalid content type');
  if (topic.type === 'service-area' && !topic.verifiedArea) throw Error('Service-area topics require verifiedArea facts');
  return `${topic.type === 'landing' ? 'solutions' : topic.type}/${topic.slug}/`;
}
export function render(data, topic, date, home, published = []) {
  validateContent(data);
  const route = destination(topic), url = `https://cholbei.com/${route}`;
  const normalize = html => html.replace(/href="(?!https?:|mailto:|tel:|\/)([^"]*)"/g, (_,href)=>`href="/${href === './' ? '' : href}"`);
  let header = normalize(home.match(/<header class="site-header"[\s\S]*?<\/header>/)[0]);
  let footer = normalize(home.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)[0]);
  if (!footer.includes('href="/blog/"')) footer = footer.replace('<div class="footer-links">','<div class="footer-links"><a href="/blog/">Blog</a>');
  const body = data.sections.map((s,i)=>`<section class="information-section" id="section-${i+1}"><h2>${escape(s.heading)}</h2>${s.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}${s.bullets.length?`<ul>${s.bullets.map(p=>`<li>${escape(p)}</li>`).join('')}</ul>`:''}${(s.links || []).map(link=>`<p class="editorial-link"><a href="${escape(link.href)}">${escape(link.label)}</a></p>`).join('')}</section>`).join('\n');
  const breadcrumb = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://cholbei.com/'},{'@type':'ListItem',position:2,name:topic.type==='blog'?'Blog':'Solutions',item:'https://cholbei.com/'+(topic.type==='blog'?'blog/':'#solutions')},{'@type':'ListItem',position:3,name:data.title,item:url}]};
  const structured = {'@context':'https://schema.org','@type':topic.type === 'blog' ? 'BlogPosting' : 'WebPage',headline:data.title,description:data.description,url,mainEntityOfPage:url,image:'https://cholbei.com/assets/img/social-media/cholbei-cover-wide-1640x624.png',datePublished:date,dateModified:date, ...(topic.type==='blog'?{author:{'@type':'Organization',name:'Cholbei',url:'https://cholbei.com/about-us/'},publisher:{'@type':'Organization',name:'Cholbei',url:'https://cholbei.com/'}}:{})};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(data.title)} | Cholbei</title><meta name="description" content="${escape(data.description)}"><link rel="canonical" href="${url}"><meta property="og:type" content="${topic.type==='blog'?'article':'website'}"><meta property="og:title" content="${escape(data.title)}"><meta property="og:description" content="${escape(data.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://cholbei.com/assets/img/social-media/cholbei-cover-wide-1640x624.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/img/favicon.svg"><link rel="stylesheet" href="/assets/css/style.css"><link rel="stylesheet" href="/assets/css/information.css"><link rel="stylesheet" href="/assets/css/blog.css"><script src="/assets/js/main.js" defer></script><script src="/assets/js/analytics.js" defer></script><script type="application/ld+json">${JSON.stringify([structured,breadcrumb]).replaceAll('<','\\u003c')}</script></head><body class="blog-article"><a class="skip-link" href="#main">Skip to content</a>${header}<main id="main"><section class="information-hero"><div class="container"><nav class="blog-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="${topic.type==='blog'?'/blog/':'/#solutions'}">${topic.type==='blog'?'Blog':'Solutions'}</a><span>/</span><span aria-current="page">${escape(data.title)}</span></nav><p class="kicker">Cholbei ${topic.type==='blog'?'Journal':'Solutions'}</p><h1>${escape(data.title)}</h1><p>${escape(data.intro)}</p><p class="article-meta">By <a href="/about-us/">Cholbei</a> ? <time datetime="${date}">${new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</time></p></div></section><div class="container information-layout"><aside class="information-sidebar"><nav aria-label="On this page"><span class="kicker">On this page</span>${data.sections.map((s,i)=>`<a href="#section-${i+1}">${escape(s.heading)}</a>`).join('')}</nav><a class="text-link" href="/#packages">Explore website packages</a></aside><article class="information-content">${body}<section class="information-section"><h2>Discuss your website</h2><p>Tell Cholbei about your goals, required features and timeline.</p><a class="button button-primary" href="/contact-us/">Contact Cholbei</a></section>${published.length?`<nav aria-label="Related reading">${published.filter(p=>p.route!==route).slice(-3).map(p=>`<p><a class="text-link" href="/${p.route}">${escape(p.title)}</a></p>`).join('')}</nav>`:''}</article></div></main>${footer}</body></html>\n`.replace(/(href|src)="\/(?!\/)/g, '$1="'+ '../'.repeat(route.split('/').filter(Boolean).length));
}
export function renderIndex(kind, items, home) {
  const title=kind==='blog'?'Website planning & ownership guides':'Website Solutions';
  const canonical='https://cholbei.com/'+kind+'/';
  const description='Practical guides to planning a business website, writing a project brief and taking ownership of your code, accounts and website handover.';
  const normalize=h=>h.replace(/href="(?!https?:|mailto:|tel:|\/)([^"]*)"/g,(_,href)=>`href="/${href==='./'?'':href}"`);
  const header=normalize(home.match(/<header class="site-header"[\s\S]*?<\/header>/)[0]);
  const footer=normalize(home.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)[0]);
  const list={'@context':'https://schema.org','@type':'CollectionPage',name:title,url:canonical,description,mainEntity:{'@type':'ItemList',itemListElement:items.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.title,url:'https://cholbei.com/'+p.route}))}};
  const cards=[...items].reverse().map((p,i)=>`<article class="blog-card"><div class="blog-card-top"><span class="kicker">${p.type==='blog'?'Business website guide':'Solutions guide'}</span><span class="blog-number">0${i+1}</span></div><h2><a href="/${p.route}">${escape(p.title)}</a></h2><p>${escape(p.description)}</p><div class="blog-card-bottom"><span>Cholbei ? <time datetime="${p.publishedAt.slice(0,10)}">${new Date(p.publishedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Dhaka'})}</time></span><a class="text-link" href="/${p.route}" aria-label="Read: ${escape(p.title)}">Read guide <span aria-hidden="true">&#8599;</span></a></div></article>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Cholbei</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://cholbei.com/assets/img/social-media/cholbei-cover-wide-1640x624.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/css/style.css"><link rel="stylesheet" href="/assets/css/information.css"><link rel="stylesheet" href="/assets/css/blog.css"><script src="/assets/js/main.js" defer></script><script src="/assets/js/analytics.js" defer></script><script type="application/ld+json">${JSON.stringify(list).replaceAll('<','\\u003c')}</script></head><body class="blog-index"><a class="skip-link" href="#main">Skip to content</a>${header}<main id="main"><section class="information-hero"><div class="container"><p class="kicker">The Cholbei journal</p><h1>Plan better.<br><em>Own what you build.</em></h1><p>Practical guides for business owners, from the first website brief to the final handover. Make informed decisions about your pages, your project and your ownership.</p></div></section><section class="blog-list container" aria-labelledby="latest-heading"><div class="blog-list-heading"><h2 id="latest-heading">Latest guides</h2><p>Clear steps for your next website.</p></div><div class="blog-grid">${cards || '<p>New guides will appear here as they are published.</p>'}</div><aside class="blog-next"><div><p class="kicker">From reading to planning</p><h2>Ready to talk about your website?</h2><p>Explore our <a href="/#packages">website setup packs</a>, or tell us what your business needs.</p></div><a class="button button-primary" href="/contact-us/">Discuss your project &#8599;</a></aside></section></main>${footer}</body></html>\n`.replace(/(href|src)="\/(?!\/)/g,'$1="../');
}
