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
  if (!footer.includes('href="/blog/"')) footer = footer.replace('<div class="footer-links">','<div class="footer-links"><a href="/blog/">Blog</a><a href="/solutions/">Solutions guides</a>');
  const body = data.sections.map(s=>`<section class="information-section"><h2>${escape(s.heading)}</h2>${s.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}${s.bullets.length?`<ul>${s.bullets.map(p=>`<li>${escape(p)}</li>`).join('')}</ul>`:''}</section>`).join('\n');
  const structured = {'@context':'https://schema.org','@type':topic.type === 'blog' ? 'BlogPosting' : 'WebPage',headline:data.title,description:data.description,url,datePublished:date,dateModified:date, ...(topic.type==='blog'?{author:{'@type':'Organization',name:'Cholbei',url:'https://cholbei.com/'},publisher:{'@type':'Organization',name:'Cholbei',url:'https://cholbei.com/'}}:{})};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(data.title)} | Cholbei</title><meta name="description" content="${escape(data.description)}"><link rel="canonical" href="${url}"><meta property="og:type" content="${topic.type==='blog'?'article':'website'}"><meta property="og:title" content="${escape(data.title)}"><meta property="og:description" content="${escape(data.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="https://cholbei.com/assets/img/social-media/cholbei-cover-wide-1640x624.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/img/favicon.svg"><link rel="stylesheet" href="/assets/css/style.css"><link rel="stylesheet" href="/assets/css/information.css"><script src="/assets/js/main.js" defer></script><script src="/assets/js/analytics.js" defer></script><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script></head><body><a class="skip-link" href="#main">Skip to content</a>${header}<main id="main"><section class="information-hero"><div class="container"><p class="kicker">Cholbei ${topic.type==='blog'?'Journal':'Solutions'}</p><h1>${escape(data.title)}</h1><p>${escape(data.intro)}</p><p><time datetime="${date}">${date}</time></p></div></section><div class="container information-layout"><aside class="information-sidebar"><a class="text-link" href="/blog/">Read our blog</a><br><a class="text-link" href="/solutions/">Explore solutions</a></aside><article class="information-content">${body}<section class="information-section"><h2>Discuss your website</h2><p>Tell Cholbei about your goals, required features and timeline.</p><a class="button button-primary" href="/contact-us/">Contact Cholbei</a></section>${published.length?`<nav aria-label="Related reading">${published.slice(-3).map(p=>`<p><a class="text-link" href="/${p.route}">${escape(p.title)}</a></p>`).join('')}</nav>`:''}</article></div></main>${footer}</body></html>\n`;
}
export function renderIndex(kind, items, home) {
  const title=kind==='blog'?'Cholbei Blog':'Website Solutions';
  const canonical=`https://cholbei.com/${kind}/`;
  const header=home.match(/<header class="site-header"[\s\S]*?<\/header>/)[0];
  const footer=home.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)[0];
  const normalize=h=>h.replace(/href="(?!https?:|mailto:|tel:|\/)([^"]*)"/g,(_,href)=>`href="/${href==='./'?'':href}"`);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Cholbei</title><meta name="description" content="Practical guidance for planning, building and owning your business website. Explore the latest articles and solutions from Cholbei."><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="/assets/css/style.css"><link rel="stylesheet" href="/assets/css/information.css"><script src="/assets/js/main.js" defer></script><script src="/assets/js/analytics.js" defer></script></head><body>${normalize(header)}<main id="main"><section class="information-hero"><div class="container"><h1>${title}</h1><p>Practical guidance for websites and systems you own.</p></div></section><div class="container" style="padding-block:60px">${items.length?items.map(p=>`<article class="information-section"><h2><a href="/${p.route}">${escape(p.title)}</a></h2><p>${escape(p.description)}</p></article>`).join(''):'<p>New guides will appear here as they are published.</p>'}</div></main>${normalize(footer)}</body></html>\n`;
}
