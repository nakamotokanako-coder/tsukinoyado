// Presentation-only decoration. Existing text, controls, IDs and calculation hooks are retained.
const families = {
  self: {label:'自分を知る', en:'YOUR INNER UNIVERSE', art:'pushpa', links:[['/chart/','魂の星図'],['/horoscope/','ホロスコープ'],['/sadesati/','サディサティ']]},
  connection: {label:'ご縁を知る', en:'THE STARS BETWEEN US', art:'hira', links:[['/aisho/','二人の相性'],['/group/','グループ相性'],['/articles/compatibility/','相性の読み方']]},
  days: {label:'日々を読む', en:'IN RHYTHM WITH THE MOON', art:'moti', links:[['/today/','今日の運勢'],['/fortune/','今月の運勢'],['/calendar/','吉日カレンダー'],['/muhurta/','吉日選び']]},
  library: {label:'星の図書室', en:'THE CELESTIAL LIBRARY', art:'panna', links:[['/nakshatra/','27星宿'],['/seirei/','宝石の精霊'],['/yoga/','ヨーガ事典'],['/wheel/','星宿の円盤'],['/famous/','有名人の星宿']]},
  reading: {label:'星を学ぶ', en:'LETTERS FROM THE STARS', art:'panna', links:[['/jyotish/','はじめての方へ'],['/articles/','読みもの'],['/nakshatra/','27星宿'],['/yoga/','ヨーガ事典']]},
  service: {label:'あなただけの星の物語', en:'A READING JUST FOR YOU', art:'hira', links:[['/kantei/','個人鑑定のご案内'],['/shop/','鑑定書のご購入'],['/contact/','お問い合わせ']]},
  information: {label:'ナヴァラトナについて', en:'ABOUT NAVARATNA', art:null, links:[['/about/','運営者情報'],['/contact/','お問い合わせ'],['/privacy/','プライバシー'],['/tokushoho/','特定商取引法']]}
};
const groups = {chart:'self',horoscope:'self',sadesati:'self',aisho:'connection',group:'connection',today:'days',fortune:'days',calendar:'days',muhurta:'days',nakshatra:'library',seirei:'library',yoga:'library',wheel:'library',famous:'library',jyotish:'reading',articles:'reading',kantei:'service',shop:'service'};
const arts = {sadesati:'nila',seirei:'moti',yoga:'pushpa_k',fortune:'pushpa',famous:'mani',group:'panna',horoscope:'panna'};
const nextLinks = {
  self:[['/aisho/','大切な人との相性を知る','ご縁を読む'],['/today/','今日の月を味方に','今日の運勢'],['/articles/','星図の言葉を学ぶ','星の読みもの']],
  connection:[['/chart/','まずは、自分の星から','魂の星図'],['/calendar/','二人の大切な日を探す','吉日カレンダー'],['/articles/compatibility/','36点の意味を知る','相性の読み方']],
  days:[['/chart/','あなたの本質を読み解く','魂の星図'],['/wheel/','月の巡りを目でたどる','星宿の円盤'],['/articles/panchang/','インドの暦を知る','暦の読みもの']],
  library:[['/#quick','あなたを守る精霊は？','無料の精霊診断'],['/chart/','自分の星を、もっと深く','魂の星図'],['/articles/','星の言葉に親しむ','読みもの']],
  reading:[['/#quick','学んだ星を、自分の星へ','無料の精霊診断'],['/chart/','あなただけの星図をひらく','魂の星図'],['/today/','暮らしに、星のヒントを','今日の運勢']],
  service:[['/chart/','まずは無料で試してみる','魂の星図'],['/seirei/','9つの精霊の物語','宝石の精霊'],['/contact/','ご不明なことはこちらへ','お問い合わせ']],
  information:[['/','月と星の世界へ','トップページ'],['/jyotish/','インド占星術を知る','はじめての方へ'],['/chart/','あなたの星図をひらく','魂の星図']]
};

function initialHero(body) {
  const found=/<div class="(hero(?: [^"]*)?|phd|chero|nkhero|yzhero|sp-hero|ak-hero)">/.exec(body);
  if(!found) throw new Error('Interior page is missing its initial hero');
  const openEnd=found.index+found[0].length;
  const tags=/<div\b[^>]*>|<\/div>/g; tags.lastIndex=openEnd;
  let depth=1, match;
  while((match=tags.exec(body))){depth+=match[0].startsWith('</')?-1:1;if(depth===0)return {start:found.index,openEnd,end:tags.lastIndex,closeStart:match.index,classes:found[1]};}
  throw new Error('Unbalanced hero markup');
}

export function interior(p,body) {
  if(p==='/')return {body,classes:'home',before:'',after:''};
  const key=p.split('/')[1],family=groups[key]||'information',meta=families[family],art=arts[key]||meta.art;
  const hero=initialHero(body),simple=/^(hero|phd)( |$)/.test(hero.classes);
  let content=body.slice(hero.openEnd,hero.closeStart),extra='';
  if(hero.classes==='ak-hero') {
    content=content.replace(/<nav class="(?:ak-jump|rd-toc)"[\s\S]*?<\/nav>/,nav=>{extra=nav;return '';});
  }
  if(simple) {
    if(!content.includes('class="eyebrow"'))content=`<span class="eyebrow">${meta.en}</span>`+content;
    content=`<div class="page-hero-copy">${content}</div><div class="page-emblem${art?'':' emblem-moon'}" aria-hidden="true"><span class="emblem-orbit"></span><span class="emblem-star">✧</span>${art?`<img src="/assets/seirei/${art}.webp" alt="" width="280" height="280">`:'<span class="emblem-crescent"></span>'}<span class="emblem-caption">NAVARATNA · 月の宿</span></div>`;
  }
  body=body.slice(0,hero.start)+`<div class="${hero.classes} page-hero${simple?' page-hero-simple':''}">`+content+'</div>'+extra+body.slice(hero.end);
  const sectionNav=`<nav class="section-nav" aria-label="${meta.label}のメニュー"><span class="section-nav-label">${meta.label}</span><div>${meta.links.map(([href,label])=>`<a href="${href}"${p===href?' aria-current="page"':p.startsWith(href)?' data-current-section="true"':''}>${label}</a>`).join('')}</div></nav>`;
  const related=`<aside class="continue-journey" aria-label="関連するページ"><div class="continue-heading"><span class="eyebrow">YOUR NEXT CHAPTER</span><h2>星の旅を、もう少し。</h2></div><div>${nextLinks[family].filter(([href])=>href!==p).map(([href,desc,label])=>`<a href="${href}"><small>${desc}</small><span>${label}<i aria-hidden="true">↗</i></span></a>`).join('')}</div></aside>`;
  return {body,classes:`inner-page family-${family} page-${key}${p.split('/').filter(Boolean).length>1?' detail-page':''}`,before:sectionNav,after:related};
}
