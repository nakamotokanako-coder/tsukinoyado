import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import {createRequire} from 'node:module'; const C=JSON.parse(fs.readFileSync('site.config.json','utf8'));
const OUT='dist'; fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT+'/assets',{recursive:true});
const rd=f=>fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):[];
const NAKD=rd('content/nak_data.json'); const TXT=[...rd('content/nak_text_a.json'),...rd('content/nak_text_b.json')];
const NAK=NAKD.map(d=>({...d,...(TXT.find(t=>t.id===d.id)||{})}));
const ARTS=rd('content/articles.json');
const FAMOUS=rd('content/famous.json');
/* 計算エンジンをビルドでも使う */
const VMX={Astronomy:createRequire(import.meta.url)('astronomy-engine'),console,Date,Math};vm.createContext(VMX);
vm.runInContext(fs.readFileSync('src/assets/calc.js','utf8')+';this.JY=JY;',VMX);vm.runInContext(fs.readFileSync('src/assets/fortune-data.js','utf8')+';this.FD=FD;',VMX);vm.runInContext(fs.readFileSync('src/assets/seirei.js','utf8')+';this.SR=SR;',VMX);
const JY=VMX.JY,FD=VMX.FD,SR=VMX.SR;
const FAM=FAMOUS.map(f=>{const [y,m,d]=f.date.split('-').map(Number),ds=Date.UTC(y,m-1,d)-f.tz*36e5,a=JY.nak(JY.moonSid(ds)).i,b=JY.nak(JY.moonSid(ds+864e5-6e4)).i;return {...f,y,m,d,n:a,n2:a===b?null:b,hm:''};});
const YOGA=rd('content/yoga.json');
const YST=fs.existsSync('content/yoga_stats.json')?JSON.parse(fs.readFileSync('content/yoga_stats.json','utf8')):{freq:{},pct:[]};
const YLV=id=>{const f=YST.freq[id];return f===undefined?2:f<0.10?4:f<0.25?3:f<0.45?2:1;};const YLN=['','よくある','ときどき','珍しい','とても珍しい'];
const YMAP=Object.fromEntries(YOGA.map(y=>[y.id,{name:y.name,cat:y.cat,c:y.cond,m:y.meaning.split('。').filter(Boolean).slice(0,2).join('。')+'。'}]));
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
fs.cpSync('src/assets',OUT+'/assets',{recursive:true});
const astro='node_modules/astronomy-engine/astronomy.browser.min.js';
fs.copyFileSync(astro,OUT+'/assets/astronomy.min.js');
const V=Date.now().toString(36);
const GNAV=[{label:'占う',items:[['/#quick','星宿診断','生年月日だけで、あなたの星宿と精'],['/chart/','魂の星図','出生図・ヨーガ・星の強さ'],['/aisho/','相性占い','二人の相性を36点で'],['/group/','グループ相性','最大10人の相性'],['/muhurta/','吉日選び','入籍・引っ越し・開業によい日'],['/calendar/','吉日カレンダー','月ごとの吉日と満月・新月'],['/fortune/','今月の運勢','月の星座12種別'],['/sadesati/','サディサティ判定','土星の7年半'],['/wheel/','星宿の円盤','27星宿の巡りを回して見る']]},
 {label:'今日の運勢',href:'/today/'},{label:'宝石の精',href:'/seirei/'},
 {label:'学ぶ',items:[['/jyotish/','はじめての方へ','インド占星術とは'],['/nakshatra/','27星宿','星宿ごとの性格・恋愛・仕事'],['/yoga/','ヨーガ事典','27のヨーガと珍しさ'],['/articles/','読みもの','はじめてのインド占星術'],['/famous/','有名人の星宿','あの人と同じ星宿？']]}];
const NAV=[['/jyotish/','はじめての方へ'],['/today/','今日の運勢'],['/fortune/','今月の運勢'],['/calendar/','吉日カレンダー'],['/chart/','魂の星図'],['/aisho/','相性占い'],['/group/','グループ相性'],['/nakshatra/','27星宿'],['/yoga/','ヨーガ'],['/articles/','読みもの']];
const TOOLS={chart:['/chart/','魂の星図','出生図・魂の星・ダシャー・16分割図'],aisho:['/aisho/','相性占い','36点で見るインド式の相性'],today:['/today/','今日の運勢','27星宿別・毎日更新'],sadesati:['/sadesati/','サディサティ判定','土星の7年半はいつ？'],group:['/group/','グループ相性占い','友だち・家族・職場の相性を一覧で'],yoga:['/yoga/','ヨーガ事典','五大偉人ヨーガほか27のヨーガ'],panchang:['/today/','今日の暦','月の星宿・ティティ・ラーフ・カーラ'],fortune:['/fortune/','今月・今年の運勢','月の星座12種別・星の運行で自動更新'],calendar:['/calendar/','吉日カレンダー','グル・プシュヤ、満月、あなたの好調日'],wheel:['/wheel/','星宿の円盤','回して見る、27星宿の関係'],famous:['/famous/','有名人の星宿','あの人と同じ星宿？'],seirei:['/seirei/','ナヴァラトナ','9つの宝石の精と、守る27星宿'],muhurta:['/muhurta/','吉日選び','入籍・引っ越し・開業によい日を探す']};
const ad=n=>C.adsenseClient?`<div class="ad"><p class="ad-label">広告</p><ins class="adsbygoogle" style="display:block" data-ad-client="${C.adsenseClient}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`:'';
const pages=[];
const shareS=(text,p)=>{const url=C.siteUrl+p,e=encodeURIComponent,u=e(url),t=e(text);return `<div class="share"><span class="share-l">シェアする</span><a class="sh x" href="https://twitter.com/intent/tweet?text=${t}&url=${u}" target="_blank" rel="noopener">X</a><a class="sh th" href="https://www.threads.net/intent/post?text=${e(text+' '+url)}" target="_blank" rel="noopener">Threads</a><a class="sh ln" href="https://social-plugins.line.me/lineit/share?url=${u}&text=${t}" target="_blank" rel="noopener">LINE</a><a class="sh fb" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener">Facebook</a><a class="sh hb" href="https://b.hatena.ne.jp/entry/s/${url.replace(/^https?:\/\//,'')}" target="_blank" rel="noopener">はてブ</a><button type="button" class="sh cp" data-copy="${esc(text+' '+url)}">リンクをコピー</button></div>`;};
const quickForm=`<section id="quick"><div class="sec-head"><h2>生年月日だけで、あなたの星宿を調べる</h2><p>生まれた時刻がわからなくても大丈夫。日本で生まれた方向けに、日本時間で計算します。</p></div><form class="f quick" id="qf" novalidate><label for="qbd">生年月日<input id="qbd" type="date" value="1990-05-15" min="1900-01-01" max="2099-12-31"></label><div class="actions"><button type="submit">私の星宿を調べる</button></div></form><div id="qres" aria-live="polite"></div></section>`;
const NKINL=()=>`window.NKSUM=${JSON.stringify(NAK.map(n=>n.summary||''))};window.NKSU=${JSON.stringify(NAK.map(n=>n.sukuyo))};window.NKCATCH=${JSON.stringify(NAK.map(n=>n.catch||''))};`;
function page(p,{title,desc,body,scripts=[],inline='',ld=null,crumb=null,og=null}){
  const full=p==='/'?`${C.siteName}｜${C.siteSub}`:`${title}｜${C.siteName}`;
  const url=C.siteUrl+p;
  const html=`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(full)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="${p==='/'?'website':'article'}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="${C.siteName}"><meta property="og:image" content="${C.siteUrl}${og||'/assets/og.png'}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FBF6EE"><link rel="icon" href="/assets/icon.svg" type="image/svg+xml"><link rel="icon" href="/assets/logo-192.png" sizes="192x192" type="image/png"><link rel="apple-touch-icon" href="/assets/logo-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/style.css?v=${V}">
${C.adsenseClient?`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${C.adsenseClient}" crossorigin="anonymous"></script>`:''}
${ld?`<script type="application/ld+json">${JSON.stringify(ld)}</script>`:''}
</head><body>
<header class="bar"><div class="bar-in"><a class="logo" href="/" aria-label="${C.siteName}"><img src="/assets/logo-s.webp" alt="" width="40" height="40"><span class="lt"><small>インド占星術</small>ナヴァラトナ</span></a><button type="button" class="menu-btn" aria-expanded="false" aria-controls="gnav"><span class="mi" aria-hidden="true"></span>メニュー</button><nav id="gnav" aria-label="メイン"><ul class="gn">${GNAV.map(g=>g.items?`<li class="dd${g.items.some(([h])=>h!=='/#quick'&&p.startsWith(h))?' cur':''}"><button type="button" class="dd-b" aria-expanded="false">${g.label}</button><ul class="dd-p">${g.items.map(([h,l,d])=>`<li><a href="${h}"${h!=='/#quick'&&p===h?' aria-current="page"':''}><b>${l}</b>${d?`<small>${d}</small>`:''}</a></li>`).join('')}</ul></li>`:`<li><a class="top-a" href="${g.href}"${p.startsWith(g.href)?' aria-current="page"':''}>${g.label}</a></li>`).join('')}</ul></nav></div></header>
<main class="main">${crumb?`<p class="crumb"><a href="/">トップ</a> › ${crumb}</p>`:''}${body}</main>
<script>(function(){var mb=document.querySelector('.menu-btn'),nv=document.getElementById('gnav');function closeAll(ex){document.querySelectorAll('.dd-b[aria-expanded=true]').forEach(function(b){if(b!==ex)b.setAttribute('aria-expanded','false');});}
if(mb)mb.addEventListener('click',function(){var o=mb.getAttribute('aria-expanded')!=='true';mb.setAttribute('aria-expanded',o);nv.classList.toggle('open',o);});
document.querySelectorAll('.dd-b').forEach(function(b){b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')!=='true';closeAll(b);b.setAttribute('aria-expanded',o);});});
document.addEventListener('click',function(e){if(!e.target.closest('.gn')&&!e.target.closest('.menu-btn'))closeAll();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();if(mb&&mb.getAttribute('aria-expanded')==='true'){mb.click();mb.focus();}}});})();</script>
<script>document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.sh.cp');if(!b)return;var s=b.getAttribute('data-copy'),o=b.textContent;function d(){b.textContent='コピーしました';setTimeout(function(){b.textContent=o;},1600);}if(navigator.clipboard)navigator.clipboard.writeText(s).then(d,function(){});});</script>
<footer class="foot"><div class="foot-in"><ul><li><a href="/about/">運営者情報</a></li><li><a href="/privacy/">プライバシーポリシー</a></li><li><a href="/contact/">お問い合わせ</a></li><li><a href="/articles/">読みもの</a></li><li><a href="/nakshatra/">27星宿一覧</a></li></ul>
<p>当サイトの占いは、インド占星術（パラーシャラ式・ラーヒリー）の伝統的な読み方にもとづく一つの視点です。重要な決断は、ご自身の判断でお願いします。入力された生年月日は、お使いの端末の中だけで計算され、送信・保存されません。</p><p>© ${new Date().getFullYear()} ${C.siteName}</p></div></footer>
${scripts.length?`<script src="/assets/astronomy.min.js"></script><script src="/assets/calc.js?v=${V}"></script><script src="/assets/common.js?v=${V}"></script>`:''}${inline?`<script>${inline}</script>`:''}${scripts.map(s=>`<script src="/assets/${s}?v=${V}"></script>`).join('')}
</body></html>`;
  const dir=path.join(OUT,p); fs.mkdirSync(dir,{recursive:true}); fs.writeFileSync(path.join(dir,'index.html'),html); pages.push(p);
}
const birthForm=(px,legend,{name=false,gender=false,def={}}={})=>`<fieldset><legend>${legend}</legend>
${name?`<label for="${px}nm">お名前（任意）<input id="${px}nm" type="text" placeholder="例：はなこ" autocomplete="off"></label>`:''}
<label for="${px}bd">生年月日<input id="${px}bd" type="date" value="${def.bd||'1990-05-15'}" min="1900-01-01" max="2099-12-31"></label>
<label for="${px}bt">生まれた時刻<input id="${px}bt" type="time" value="${def.bt||'10:30'}"></label>
<label for="${px}pl">出生地<select id="${px}pl"></select></label>
${gender?`<label for="${px}g">性別（伝統的な計算に使用）<select id="${px}g"><option value="f"${def.g==='f'?' selected':''}>女性</option><option value="m"${def.g==='m'?' selected':''}>男性</option></select></label>`:''}
<label class="inline" for="${px}unk"><input id="${px}unk" type="checkbox">時刻がわからない</label>
<div class="custom" id="${px}custom" hidden><label for="${px}la">緯度（北緯はプラス）<input id="${px}la" type="number" step="0.01" value="35.69"></label><label for="${px}lo">経度（東経はプラス）<input id="${px}lo" type="number" step="0.01" value="139.69"></label><label for="${px}tz">時差（UTC＋時間）<input id="${px}tz" type="number" step="0.5" value="9"></label></div></fieldset>`;
const cta=`<aside class="cta"><h2>星図を、あなただけの物語に</h2><p>無料の星図でわかるのは、星の配置という「地図」までです。16枚の分割図と人生の時期を重ねて読み、あなたの流れとこれからの指針を一冊の鑑定書にまとめる個人鑑定を受け付けています。</p><a href="${C.ctaUrl}" target="_blank" rel="noopener">${C.ctaLabel}</a></aside>`;
const toolCards=keys=>`<div class="grid">${keys.map(k=>{const t=TOOLS[k];return `<a class="card tool" href="${t[0]}"><span class="k">FREE</span><b>${t[1]}</b><p>${t[2]}</p></a>`;}).join('')}</div>`;
const nakChips=()=>`<div class="grid sm">${NAK.map(n=>`<a class="card tool" href="/nakshatra/${n.slug}/"><span class="k">${n.id}　${n.lord}</span><b>${n.name}</b><p>${esc(n.catch||n.span)}</p></a>`).join('')}</div>`;
const artList=list=>`<div class="list">${list.map(a=>`<a href="/articles/${a.slug}/"><b>${esc(a.title)}</b><span>${esc(a.description)}</span></a>`).join('')}</div>`;
const TARA_ROWS=[['1','ジャンマ','命','自分を整える'],['2','サンパット','栄','実り・豊かさ'],['3','ヴィパット','衰','つまずきに注意'],['4','クシェーマ','安','穏やか・安定'],['5','プラティヤク','危','無理をしない'],['6','サーダナ','成','願いが形になる'],['7','ナイダナ','壊','休息を大切に'],['8','ミトラ','友','人の縁'],['9','パラマ・ミトラ','親','最良の縁']];

/* ---------- トップ ---------- */
page('/',{title:'トップ',desc:'生年月日だけで、あなたの星宿と宝石の精がわかるインド占星術の無料占い。今日の運勢、魂の星図、相性占い、吉日カレンダーも無料で。',scripts:['seirei.js','today.js','quick.js'],inline:NKINL(),
body:`<section class="hero hero-top" id="quick"><span class="eyebrow">Jyotish · Vedic Astrology</span><h1>あなたの星宿と、<br>宝石の精に出会う</h1><p class="lead">生まれた日の星をたどって、あなたの性質と宝石の精を見つけよう</p>
<form class="f quick hq" id="qf" novalidate><label for="qbd">生年月日<input id="qbd" type="date" value="1990-05-15" min="1900-01-01" max="2099-12-31"></label><div class="actions"><button type="submit" class="big-btn">私の星宿を調べる</button></div></form>
<p class="note">生まれた時刻がわからなくても大丈夫。計算はこの端末の中だけで行います。インド占星術がはじめての方は<a href="/jyotish/">はじめての方へ</a></p></section>
<section class="sr-sec" aria-label="ナヴァラトナ 9つの宝石の精"><div class="sr-line" data-tap>${SR.L.map(x=>`<button type="button" data-id="${x.id}" aria-expanded="false" aria-controls="srd"><span class="sr-im"><img src="${SR.img(x.id,true)}" alt="" width="128" height="128"></span><span class="sr-nm">${x.name}</span><span class="sr-gm">${x.gem}</span></button>`).join('')}</div>
<div class="srd" id="srd" hidden aria-live="polite"></div>
<p class="note" style="text-align:center"><b>ナヴァラトナ　9つの宝石の精</b>が、27の星宿を3つずつ守っています。精を押すと紹介が出ます。<a href="/seirei/">9人の紹介 →</a></p></section>
<section aria-label="診断結果"><div id="qres" aria-live="polite"></div><div id="qwelcome"></div></section>
<section id="today"><div class="sec-head"><h2>今日の運勢 <span id="today-date" class="note"></span></h2><p>生まれた星宿と、今日の月の星宿の巡り（ターラ）から読む毎日の運勢です。</p></div>
<div class="card now" id="mine"></div><div class="grid" id="pick"></div><div class="card" id="nowslot"></div><p class="note"><a href="/today/">27星宿すべての今日の運勢と時間帯を見る →</a></p></section>
${ad('top')}
<section><div class="sec-head"><h2>もっと占う</h2><p>生年月日と時刻、出生地を入れるだけ。計算はすべてあなたの端末の中で行います。</p></div>${toolCards(['chart','aisho','muhurta','calendar','fortune','group','sadesati','wheel'])}</section>
<section><div class="sec-head"><h2>今日の暦（パンチャーンガ）</h2><p>インドの暦で見る、今日という日の性質。</p></div><div class="facts" id="pc"></div></section>
<section><div class="sec-head"><h2>27星宿（ナクシャトラ）</h2><p>月の通り道を27に分けた「月の宿」。生まれたときの月の星宿が、あなたの心のかたちを表します。</p></div>${nakChips()}</section>
${ad('mid')}
<section><div class="sec-head"><h2>読みもの</h2><p>はじめてのインド占星術。</p></div>${artList(ARTS.slice(0,6))}<p class="note"><a href="/articles/">すべての読みもの →</a></p></section>
${shareS('インド占星術の無料占いサイト「ナヴァラトナ」。生年月日だけで、あなたの星宿と守ってくれる宝石の精がわかります。','/')}${cta}`});

/* ---------- 今日の運勢 ---------- */
page('/today/',{title:'今日の運勢（27星宿別）と今日の暦',desc:'インド占星術の27星宿（ナクシャトラ）別に、今日の運勢を毎日自動で更新。月の星宿、ティティ、ヨーガ、ラーフ・カーラの時間帯もわかります。',scripts:['today.js'],crumb:'今日の運勢',
body:`<div class="hero"><span class="eyebrow">Daily Tara</span><h1>今日の運勢 <span id="today-date" style="font-size:.55em"></span></h1><p class="lead">生まれたときの月の星宿から、今日の月の星宿までを数えた「ターラ（星の巡り）」で、27星宿それぞれの一日を読みます。</p></div>
<div class="card now" id="mine"></div><div class="grid" id="pick"></div>
${ad('top')}
<section><div class="sec-head"><h2>27星宿別の今日の運勢</h2><p>星宿名を押すと、くわしい性格と今日のアドバイスが見られます。</p></div><div class="tara" id="tara"></div></section>
<section id="cho-sec"><div class="sec-head"><h2 id="cho-h">今日の吉凶の時間帯（チョーガディヤ）</h2><p>日の出から日の入りまでと、日の入りから次の日の出までを、それぞれ8つに分けた時間帯です。インドでは、出かける時刻や物事を始める時刻を選ぶのに、毎日使われています。時刻は東京の値です。</p></div><div id="cho" style="display:flex;flex-direction:column;gap:14px"></div>
<p class="note"><span class="pill g">アムリタ・シュバ・ラーバ</span>はよい時間、<span class="pill">チャラ</span>は移動によい時間、<span class="pill b">ウドヴェーガ・カーラ・ローガ</span>は大事な始めごとを避ける時間です。ホーラーは、昼と夜をそれぞれ12に分け、7つの星が順番に受け持つ時間です。</p></section>
<section><div class="sec-head"><h2>今日の暦（パンチャーンガ）</h2><p>時刻は東京の値です。</p></div><div class="facts" id="pc"></div></section>
<section><div class="sec-head"><h2>9つのターラの意味</h2><p>生まれた星宿から今日の月の星宿までを数えると、9つの巡りのどこかにあたります。星宿は27あるので、この巡りが3回繰り返されます。</p></div>
<div class="tbl"><table style="min-width:420px"><thead><tr><th>順番</th><th>ターラ</th><th>この日の性質</th></tr></thead><tbody>${TARA_ROWS.map(r=>`<tr><td class="num">${r[0]}</td><td>${r[1]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>
<p class="note"><a href="/articles/tara/">今日の運勢のしくみをくわしく読む →</a></p></section>
${ad('bottom')}${cta}`});

/* ---------- 魂の星図 ---------- */
page('/chart/',{title:'魂の星図｜インド占星術の無料ホロスコープ（出生図・分割図・ダシャー）',desc:'生年月日・時刻・出生地から、インド占星術の出生図、魂の星（アートマカラカ）、心の星宿と宝石の精、ヨーガ、星の強さ、ヴィムショッタリ・ダシャー、16の分割図を無料で計算します。',scripts:['seirei.js','varga-read.js','chart-extra.js','chart.js'],crumb:'魂の星図',
inline:`window.NKSUM=${JSON.stringify(NAK.map(n=>n.summary||''))};window.NKCATCH=${JSON.stringify(NAK.map(n=>n.catch||''))};window.YOGA=${JSON.stringify(YMAP)};window.YSTAT=${JSON.stringify(YST)};`,
body:`<div id="inwrap" class="inwrap">
<div class="hero"><span class="eyebrow">Free Birth Chart</span><h1>魂の星図</h1><p class="lead">宝石の精たちが案内する、あなただけの鑑定書。心の星宿、魂の星、生まれ持った性質から、才能、人生の時期、結婚や仕事のテーマまで読めます。</p></div>
<form class="f cform" id="f" novalidate><fieldset><legend>生まれたときのこと</legend>
<label for="a-bd">生年月日<input id="a-bd" type="date" value="" min="1900-01-01" max="2099-12-31"></label>
<div class="tgroup"><label for="a-bt">出生時刻<input id="a-bt" type="time" value=""></label>
<label class="inline" for="a-unk"><input id="a-unk" type="checkbox">時刻がわからない</label>
<p class="note">時刻がわからなくても、心の星宿・魂の星・ダシャー・サディサティは見られます。アセンダント、ハウス、星の強さ、アセンダントを使うヨーガと分割図の読みは表示されません。</p></div>
<label for="a-pl">出生地<select id="a-pl"></select></label>
<div class="custom" id="a-custom" hidden><label for="a-la">緯度（北緯はプラス）<input id="a-la" type="number" step="0.01" value="35.69"></label><label for="a-lo">経度（東経はプラス）<input id="a-lo" type="number" step="0.01" value="139.69"></label><label for="a-tz">時差（UTC＋時間）<input id="a-tz" type="number" step="0.5" value="9"></label></div>
<label for="a-nm">お名前（任意）<input id="a-nm" type="text" placeholder="例：はなこ" autocomplete="off"></label></fieldset>
<div class="actions"><button type="submit" class="big-btn">私の星図をひらく</button><button type="button" class="ghost" id="sample">サンプルの星図を見る</button></div>
<p class="status" id="status" role="status"></p><p class="note">入力した生年月日は、この端末の中だけで計算に使い、どこにも送信しません。</p></form>
</div>
<div id="result" class="result" hidden tabindex="-1">
<div class="rbanner" id="rbanner"></div>
<div id="scard"></div>
<div class="tabs" role="tablist" aria-label="星図の内容">
<button role="tab" id="t-ess" aria-controls="p-ess" aria-selected="true">わたしの本質</button><button role="tab" id="t-tal" aria-controls="p-tal" aria-selected="false" tabindex="-1">才能と強み</button><button role="tab" id="t-tim" aria-controls="p-tim" aria-selected="false" tabindex="-1">今の人生の時期</button><button role="tab" id="t-thm" aria-controls="p-thm" aria-selected="false" tabindex="-1">テーマ別に読む</button><button role="tab" id="t-dat" aria-controls="p-dat" aria-selected="false" tabindex="-1">星図とデータ</button></div>
<section class="panel" role="tabpanel" id="p-ess" aria-labelledby="t-ess"><div id="essence" class="stack"></div></section>
<section class="panel" role="tabpanel" id="p-tal" aria-labelledby="t-tal" hidden>
<div class="sec-head"><h2>才能と強み</h2><p>星の組み合わせ（ヨーガ）と、星の強さから見るあなたの持ち味。</p></div>
<div id="kings" class="stack"></div>
<h3 class="subh">あなたのヨーガ</h3><div class="grid" id="yogas"></div><p class="note" id="yoganote"></p>
<details class="card" id="ytopw"><summary><b>ヨーガの珍しさと数え方</b></summary><div id="ytop"></div></details>
<h3 class="subh">星の強さ</h3><p class="note">シャドバラとアシュタカヴァルガは、別々のものさしです。数字どうしを比べず、それぞれの基準で見てください。</p><div id="stren" class="stack"></div></section>
<section class="panel" role="tabpanel" id="p-tim" aria-labelledby="t-tim" hidden>
<div class="sec-head"><h2>今の人生の時期</h2><p>ヴィムショッタリ・ダシャー。月の星宿から決まる、星が順番に人生を受け持つ時期です。</p></div>
<div id="now"></div><div class="tl" id="dasha"></div>
<div class="card" id="sswrap"><h3>サディサティ（土星の7年半）</h3><p class="note">土星が月の星座の前後3つの星座を通る約7年半。ダシャーとは別のしくみで、見直しと土台づくりの時期とされます。<a href="/sadesati/">くわしく</a></p><ul id="ss" class="sslist"></ul></div></section>
<section class="panel" role="tabpanel" id="p-thm" aria-labelledby="t-thm" hidden>
<div class="sec-head"><h2>テーマ別に読む</h2><p>知りたいテーマを選ぶと、対応する分割図（人生のテーマごとに星を細かく見る図）と解説が出ます。</p></div>
<div class="themes" role="group" aria-label="テーマ" id="themes"></div><div id="theme" class="stack"></div>
<p class="note">16枚の分割図と人生の時期を重ねると、いつ・どの分野で力が開くのかまで読めます。<a href="${C.ctaUrl}" target="_blank" rel="noopener">個人鑑定のご案内</a></p></section>
<section class="panel" role="tabpanel" id="p-dat" aria-labelledby="t-dat" hidden>
<div class="sec-head"><h2>出生図（ラーシ・チャート）</h2><p id="stylenote"></p></div>
<div class="stylesw" role="group" aria-label="図の形"><span>図の形</span><button type="button" class="ghost" data-style="s" aria-pressed="true">南インド式</button><button type="button" class="ghost" data-style="n" aria-pressed="false">北インド式</button></div>
<figure class="chart l big-chart" id="d1"></figure>
<p class="note legend">凡例：<b>Asc</b>＝アセンダント（1室）　<b>日</b>太陽　<b>月</b>月　<b>火</b>火星　<b>水</b>水星　<b>木</b>木星　<b>金</b>金星　<b>土</b>土星　<b>ラ</b>ラーフ　<b>ケ</b>ケートゥ　<b><sup>R</sup></b>＝逆行</p>
<h3 class="subh">天体の一覧</h3><div class="tbl"><table id="ptable"></table></div><p class="note" id="ascnote"></p>
<h3 class="subh">16種類の分割図</h3><p class="note">図を押すと、大きく表示します。</p>
<div class="vsel"><label for="vpick">分割図を選ぶ<select id="vpick"></select></label></div><div id="vbig"></div>
<div class="charts" id="vargas"></div><p class="note" id="vnote"></p></section>
<div id="shr"></div>
<p class="note" style="text-align:center"><button type="button" class="ghost" data-edit>入力内容を変更</button></p>
</div>
<section><div class="sec-head"><h2>この星図の見方</h2></div><div class="prose"><p>インド占星術では、星座を実際の星の位置に合わせる「サイデリアル方式」を使うため、西洋占星術とは星座が約1つずれることがあります。くわしくは<a href="/articles/what-is-jyotish/">インド占星術とは</a>、<a href="/articles/divisional-charts/">分割図の読み方</a>、<a href="/articles/atmakaraka/">魂の星（アートマカラカ）とは</a>をどうぞ。</p></div></section>
${cta}`});

/* ---------- 相性 ---------- */
page('/aisho/',{title:'相性占い｜インド式アシュタクータ（36点満点）',desc:'二人の生年月日から、インド占星術の伝統的な相性占い「アシュタクータ」を36点満点で無料計算。ヴァルナ、ヨーニ、ガナ、ナーディなど8項目の意味も解説します。',scripts:['chart-extra.js','aisho.js'],crumb:'相性占い',
body:`<div class="hero"><span class="eyebrow">Ashtakoota</span><h1>相性占い</h1><p class="lead">インドで結婚相手を選ぶときに使われてきた「アシュタクータ」は、二人の月の星宿と星座から、8つの項目で相性を点数にします。36点満点で、18点以上がひとつの目安です。</p></div>
<form class="f" id="f" novalidate>${birthForm('a-','あなた',{gender:true,def:{g:'f'}})}${birthForm('b-','お相手',{gender:true,def:{bd:'1988-09-05',bt:'07:15',g:'m'}})}<div class="actions"><button type="submit">相性を見る</button><span class="status" id="status"></span></div></form>
<section id="res"></section>
${ad('mid')}
<section><div class="sec-head"><h2>点数の読み方</h2></div><div class="prose"><p>アシュタクータは、月だけを使った相性の見方です。点数が低くても、二人の出生図全体の結びつきが強いことはよくあります。点数は「どこに気をつければいいか」を知る地図として使ってください。</p><p>8項目のくわしい意味は、<a href="/articles/compatibility/">アシュタクータの36点のしくみ</a>で解説しています。</p></div></section>
${cta}`});

/* ---------- サディサティ ---------- */
page('/sadesati/',{title:'サディサティ判定｜土星の7年半はいつ？',desc:'生年月日から、インド占星術のサディサティ（土星の7年半）の時期を無料で判定。今サディサティ中の月星座、第1段階・ピーク・最終段階もわかります。',scripts:['sadesati.js'],crumb:'サディサティ判定',
body:`<div class="hero"><span class="eyebrow">Sade Sati</span><h1>サディサティ判定</h1><p class="lead">サディサティは、土星が生まれたときの月の星座とその前後を通る、約7年半の時期です。重さを感じやすい一方で、人生の土台を作り直す大切な時期でもあります。</p></div>
<div class="card"><h3>いまサディサティにいる月星座（土星は<span id="satnow"></span>を通過中）</h3><ul id="nowlist" style="margin:0;padding-left:1.2em"></ul><p class="note">インド式の月星座は、西洋の星座とは違うことがあります。下のフォームで確かめてください。</p></div>
<form class="f" id="f" novalidate>${birthForm('a-','生まれたときのこと')}<div class="actions"><button type="submit">判定する</button><span class="status" id="status"></span></div></form>
<section id="res"></section>
${ad('mid')}
<section><div class="sec-head"><h2>サディサティの過ごし方</h2></div><div class="prose"><p>土星は「時間」と「責任」の星です。この時期は、近道より地道さ、勢いより準備が報われます。生活のリズムを整え、抱え込みすぎず、本当に大切なものを選び直すことが、土星の時期を味方にするコツです。</p><p>くわしくは<a href="/articles/sade-sati/">サディサティ（土星の7年半）とは</a>をどうぞ。</p></div></section>
${cta}`});

/* ---------- 27星宿 ---------- */
page('/nakshatra/',{title:'27星宿（ナクシャトラ）一覧',desc:'インド占星術の27星宿（ナクシャトラ）の一覧。各星宿の性格、恋愛、仕事、神話をまとめています。',crumb:'27星宿',scripts:['seirei.js','quick.js'],inline:NKINL(),
body:`<div class="hero"><span class="eyebrow">27 Nakshatras</span><h1>27星宿（ナクシャトラ）</h1><p class="lead">ナクシャトラは、月がひと晩ずつ泊まる27の「月の宿」。あなたの星宿は<a href="/chart/">魂の星図</a>で調べられます。</p></div>
${quickForm}
<div class="grid"><a class="card tool" href="/wheel/"><span class="k">回して見る</span><b>星宿の円盤</b><p>27星宿の関係を、円盤を回して色で見る</p></a><a class="card tool" href="/famous/"><span class="k">あの人は？</span><b>有名人の星宿</b><p>${FAM.length}人の有名人の月の星宿</p></a></div>
${nakChips()}${ad('mid')}
<div class="tbl"><table style="min-width:620px"><thead><tr><th>#</th><th>星宿</th><th>範囲</th><th>支配星</th><th>ガナ</th></tr></thead><tbody>${NAK.map(n=>`<tr><td class="num">${n.id}</td><td><a href="/nakshatra/${n.slug}/">${n.name}</a></td><td>${n.span}</td><td>${n.lord}</td><td>${n.gana}</td></tr>`).join('')}</tbody></table></div>`});
const TGOOD=[0,1,0,1,0,1,0,1,1],TDESC=['自分自身の星宿と同じ巡り。心と体を整える日。','実りと豊かさの日。','つまずきやすい日。確認をていねいに。','穏やかに満ちる日。','障害にあいやすい日。無理をしない。','願いが形になる日。','休息を大切にする日。大きな決断は控えめに。','人の縁に恵まれる日。','最良の縁の日。'];
const relTable=i=>{const T=[['ジャンマ',0],['サンパット',1],['ヴィパット',2],['クシェーマ',3],['プラティヤク',4],['サーダナ',5],['ナイダナ',6],['ミトラ',7],['パラマ・ミトラ',8]];
  const rows=T.map(([nm,k])=>{const L=[];for(let j=0;j<27;j++){if(JY.tara(i,j)===k)L.push(`<li><a href="/nakshatra/${NAK[j].slug}/">${NAK[j].name}</a></li>`);}
    return `<div class="rel"><h3><span class="rt ${TGOOD[k]?'t-g':k===0?'t-n':'t-b'}">${k+1}</span>${nm}</h3><p class="note" style="margin:2px 0 8px">${TDESC[k]}</p><ul class="chips rl">${L.join('')}</ul></div>`;}).join('');
  return `<section><div class="sec-head"><h2>${NAK[i].name}の人の、日ごとの運勢（ターラ）</h2><p>${NAK[i].name}生まれの人にとって、その日の月がどの星宿にあるとよい日になるかの一覧です。インドでは、今日の運勢や、大切な日を選ぶときに使います。<a href="/articles/tara/">ターラのしくみ →</a></p></div>${rows}</section>`;};
const famousOf=i=>{const L=FAM.filter(f=>f.n===i||f.n2===i);if(!L.length)return '';return `<section><div class="sec-head"><h2>${NAK[i].name}の有名人</h2><p>生年月日から計算した月の星宿です。<a href="/famous/">有名人の星宿一覧 →</a></p></div><ul class="chips">${L.map(f=>`<li>${esc(f.name)}${f.n2!==null?'<small>（切り替わりの日）</small>':''}</li>`).join('')}</ul></section>`;};
NAK.forEach((n,i)=>{const prev=NAK[(i+26)%27],next=NAK[(i+1)%27],P=a=>(a||[]).map(x=>`<p>${esc(x)}</p>`).join('');
page(`/nakshatra/${n.slug}/`,{og:`/assets/og/nak-${n.slug}.jpg`,title:`${n.name}の性格・恋愛・仕事｜インド占星術の27星宿`,desc:`インド占星術の27星宿「${n.name}」。${(n.summary||'').slice(0,70)}`,scripts:['nakwidget.js'],crumb:`<a href="/nakshatra/">27星宿</a> › ${n.name}`,
ld:{"@context":"https://schema.org","@type":"Article","headline":`${n.name}の性格・恋愛・仕事`,"inLanguage":"ja"},
body:`<div class="hero"><span class="eyebrow">Nakshatra ${n.id} / 27</span><h1>${n.name}</h1><p class="lead"><b>${esc(n.catch)}</b></p><p class="lead">${esc(n.summary)}</p></div>
<div class="facts"><div><span>範囲（サイデリアル）</span><b>${n.span}</b></div><div><span>支配星</span><b>${n.lord}</b></div><div><span>神格</span><b>${n.deity}</b></div><div><span>シンボル</span><b>${n.symbol}</b></div><div><span>ガナ（気質）</span><b>${n.gana}</b></div><div><span>ヨーニ（動物）</span><b>${n.yoni}</b></div></div>
<div class="card now" id="nk-today" data-i="${i}"></div>
<section class="prose"><h2>性格</h2>${P(n.personality)}</section>
${ad('mid')}
<section class="prose"><h2>恋愛とパートナーシップ</h2>${P(n.love)}<h2>仕事と才能</h2>${P(n.work)}</section>
<section><div class="sec-head"><h2>強みと課題</h2></div><div class="grid"><div class="card"><h3>強み</h3><ul class="chips">${(n.strengths||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="card"><h3>課題</h3><ul class="chips">${(n.challenges||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div></section>
<section class="prose"><h2>神話とシンボル</h2><p>${esc(n.myth)}</p><h2>${n.name}のあなたへ</h2><p>${esc(n.advice)}</p></section>
${SR.card(n.lord,{label:n.name+'を守る宝石の精'})}
${relTable(i)}${famousOf(i)}
<p class="note">月がどの星宿にあるかは、生まれた時刻によって変わります。<a href="/chart/">魂の星図</a>で確かめられます。相性は<a href="/aisho/">相性占い</a>へ。</p>
${shareS(n.name+'の性格・恋愛・仕事｜インド占星術の27星宿','/nakshatra/'+n.slug+'/')}
<div class="grid"><a class="card tool" href="/nakshatra/${prev.slug}/"><span class="k">← 前の星宿</span><b>${prev.name}</b></a><a class="card tool" href="/nakshatra/${next.slug}/"><span class="k">次の星宿 →</span><b>${next.name}</b></a></div>
${cta}`});});

/* ---------- 読みもの ---------- */
page('/articles/',{title:'読みもの｜はじめてのインド占星術',desc:'インド占星術（ジョーティッシュ）の基本をやさしく解説。27星宿、9つの星、12星座、ハウス、ダシャー、サディサティ、分割図、相性、暦まで。',crumb:'読みもの',
body:`<div class="hero"><span class="eyebrow">Reading</span><h1>読みもの</h1><p class="lead">はじめての方にもわかるように、インド占星術のしくみを一つずつ解説します。</p></div>${artList(ARTS)}${ad('bottom')}`});
ARTS.forEach(a=>{const t=TOOLS[a.related_tool]||TOOLS.chart;
page(`/articles/${a.slug}/`,{title:a.title,desc:a.description,crumb:`<a href="/articles/">読みもの</a>`,ld:{"@context":"https://schema.org","@type":"Article","headline":a.title,"description":a.description,"inLanguage":"ja"},
body:`<div class="hero"><span class="eyebrow">Reading</span><h1>${esc(a.title)}</h1><p class="lead">${esc(a.lead)}</p></div>
<article class="prose guide">${(a.sections||[]).map((s,i)=>`<h2 class="ka">${esc(s.h2)}</h2>${s.poem?`<p class="poem">${s.poem.map(esc).join('<br>')}</p>`:''}${(s.paras||[]).map(p=>`<p>${esc(p)}</p>`).join('')}${s.list&&s.list.length?`<ul>${s.list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${(s.blocks||[]).map(k=>`<div class="ablk${k.img?' wimg':''}">${k.img?`<img src="/assets/seirei/${k.img}-s.webp" alt="" width="72" height="72" loading="lazy">`:''}<h3 class="ka">${esc(k.h3)}</h3>${k.paras.map(p=>`<p>${esc(p)}</p>`).join('')}</div>`).join('')}${s.button?`<p><a class="btn" href="${s.button[1]}">${esc(s.button[0])}</a></p>`:''}${i===1?ad('mid'):''}`).join('')}</article>
${shareS(a.title,'/articles/'+a.slug+'/')}
<a class="card tool" href="${t[0]}"><span class="k">無料で試す</span><b>${t[1]}</b><p>${t[2]}</p></a>
<section><div class="sec-head"><h2>ほかの読みもの</h2></div>${artList(ARTS.filter(x=>x.slug!==a.slug).slice(0,4))}</section>${cta}`});});


/* ---------- ヨーガ事典 ---------- */
const YCATS=[...new Set(YOGA.map(y=>y.cat))];
page('/yoga/',{title:'ヨーガ事典｜五大偉人ヨーガからラージャ・ヨーガまで',desc:'インド占星術の「ヨーガ（星の特別な組み合わせ）」を解説。五大偉人ヨーガ（ルチャカ・バドラ・ハンサ・マーラヴィヤ・シャシャ）、ガジャケーサリ、ラージャ・ヨーガ、ダナ・ヨーガ、ニーチャ・バンガなどの成立条件と意味。',crumb:'ヨーガ事典',
ld:{"@context":"https://schema.org","@type":"Article","headline":"ヨーガ事典","inLanguage":"ja"},
body:`<div class="hero"><span class="eyebrow">Yoga</span><h1>ヨーガ事典</h1><p class="lead">インド占星術の「ヨーガ」は、体を動かすヨガではなく、星と星の「結びつき」のこと。特定の星が特定の場所に入ったり、組み合わさったりすると、その人の人生に特別な力が生まれると考えます。あなたのチャートにどのヨーガがあるかは、<a href="/chart/">魂の星図</a>で自動で調べられます。</p></div>
<section><div class="sec-head"><h2>ヨーガの読み方</h2></div><div class="prose"><p>ヨーガは「成立しているかどうか」だけでなく、その星がどれだけ強いか、そしてその星の時期（ダシャー）がいつ巡ってくるかで、表れ方が大きく変わります。同じヨーガを持っていても、ダシャーが来るまでは眠っていることもあります。</p><p>反対に、ヨーガがないことは悪い意味ではありません。ヨーガはチャートの「目立つ特徴」を拾うための目印です。</p><p>★の数は珍しさの目安です。1940〜2015年のランダムな4,000人分のチャートで、それぞれのヨーガを持つ人の割合を数えました（★★★★＝10%未満、★★★＝25%未満、★★＝45%未満、★＝それ以上）。ラージャ・ヨーガのように、7割以上の人が持つヨーガもあります。</p></div></section>
<nav aria-label="ヨーガの分類"><ul class="chips">${YCATS.map(c=>`<li><a href="#cat-${YCATS.indexOf(c)}" style="text-decoration:none;color:inherit">${c}</a></li>`).join('')}</ul></nav>
${ad('top')}
${YCATS.map((c,ci)=>`<section id="cat-${ci}"><div class="sec-head"><h2>${c}</h2>${c==='五大偉人ヨーガ'?'<p>パンチャ・マハープルシャ・ヨーガ。火星・水星・木星・金星・土星の5つの星が、それぞれ最も力を発揮する場所にあるときに成立する、古典で特に重んじられるヨーガです。</p>':''}</div>${YOGA.filter(y=>y.cat===c).map(y=>`<div class="yd" id="${y.id}"><h3>${esc(y.name)}</h3><span class="rar r${YLV(y.id)}">${'★★★★'.slice(0,YLV(y.id))}<span class="mut">${'★★★★'.slice(YLV(y.id))}</span> ${YLN[YLV(y.id)]}${YST.freq[y.id]!==undefined?`（約${Math.max(1,Math.round(YST.freq[y.id]*100))}%の人が持つ）`:''}</span><p class="c"><b>成立条件：</b>${esc(y.cond)}</p><p>${esc(y.meaning)}</p></div>`).join('')}</section>`).join('')}
${ad('bottom')}
<a class="card tool" href="/chart/"><span class="k">無料で調べる</span><b>あなたのヨーガを調べる</b><p>魂の星図で、生年月日からヨーガを自動判定します</p></a>${shareS('インド占星術のヨーガ事典。五大偉人ヨーガ、ラージャ・ヨーガなど27のヨーガの意味と珍しさ。','/yoga/')}${cta}`});

/* ---------- はじめての方へ ---------- */
const ORDER_ART=['what-is-jyotish','nakshatra','planets','rashi','houses','dasha','divisional-charts','atmakaraka','ashtakavarga','sade-sati','gochara','compatibility','mangal-dosha','tara','panchang','choghadiya','muhurta'];
const GUIDE_T={'what-is-jyotish':['インド占星術の基本','西洋占星術との違いや、星図を読むための基本を紹介します。'],nakshatra:['27星宿（ナクシャトラ）','生まれたときの月が宿る場所から、心の傾向や感性を読み解きます。'],planets:['9つの星（ナヴァグラハ）','太陽から土星、ラーフ・ケートゥまで。それぞれの星が表すテーマを知りましょう。'],rashi:['12星座（ラーシ）','インド式の星座の意味と、西洋占星術とは星座がずれる理由を解説します。'],houses:['12のハウス（バーヴァ）','仕事、お金、恋愛、家族。星図の12の場所が表す、人生のテーマを紹介します。'],dasha:['人生の時期（ダシャー）','今はどの星が受け持つ時期なのか。人生の流れを読む方法を解説します。'],'divisional-charts':['分割図','結婚や仕事など、テーマごとに星の配置を詳しく見るための図を紹介します。'],atmakaraka:['魂の星（アートマカラカ）','伝統的に、魂の課題を読む手がかりとされる星。その求め方と意味を紹介します。'],ashtakavarga:['アシュタカヴァルガ','星からの支えを点数で表す方法と、その数字の読み方を解説します。'],'sade-sati':['サディサティ（土星の7年半）','どんな時期を指すのか、いつ巡るのか。意味と過ごし方を紹介します。'],gochara:['星の運行（ゴーチャラ）','今動いている星を、生まれたときの配置と重ねて読む方法を解説します。'],compatibility:['インド式の相性占い','36点満点の相性は、何を見ているのでしょう。8つの項目と点数の受け止め方を紹介します。'],'mangal-dosha':['マンガル・ドーシャ','結婚の相性で注目される火星の配置について、基本の考え方を解説します。'],tara:['9つのターラ','生まれた星宿と今日の月の星宿から、一日の流れを読むしくみを紹介します。'],panchang:['インドの暦（パンチャーンガ）','月の満ち欠けや星宿など、インドの暦をつくる5つの要素を解説します。'],choghadiya:['チョーガディヤとホーラー','一日の中に巡る時間帯の意味と、日常への取り入れ方を紹介します。'],muhurta:['吉日選び（ムフールタ）','入籍、引っ越し、開業など、大切な一歩を踏み出す日を選ぶ考え方を紹介します。']};
page('/jyotish/',{title:'インド占星術（ジョーティッシュ）とは｜はじめての方へ',desc:'インド占星術（ジョーティッシュ）は、生まれた瞬間の星の配置から、あなたらしさと人生のタイミングを読み解く占星術です。西洋占星術との違い、月とナクシャトラ、ダシャー、このサイトの計算方式と読む順番を紹介します。',crumb:'はじめての方へ',
ld:{"@context":"https://schema.org","@type":"Article","headline":"インド占星術（ジョーティッシュ）とは","inLanguage":"ja"},
body:`<div class="hero"><span class="eyebrow">Beginner's Guide</span><h1 class="ka">インド占星術<wbr>（ジョーティッシュ）とは</h1><p class="lead gl">あなたらしさと、<span class="nw">人生のタイミングを知る。</span></p></div>
<section class="g-intro"><img src="/assets/logo.webp" alt="" width="120" height="120" class="g-logo"><p class="poem">自然にできること。<br>なぜか繰り返してしまうこと。<br>そして、これから育てていきたいこと。</p></section>
<section class="prose guide">
<p>生まれた瞬間の星の配置を手がかりに、あなたの性質や人生の流れを読み解く。それが、<b>インド占星術「ジョーティッシュ」</b>です。</p>
<p>ジョーティッシュは、サンスクリット語で<b>「光の学問」</b>と訳されます。インドでは古くから、結婚や仕事、新しいことを始める日取りなど、暮らしの節目に役立てられてきました。</p>
<p>自分の持ち味を知り、今という時期をどう過ごすか考えるために。あなたの星図を、ひらいてみませんか。</p>
<p><a class="btn" href="/chart/">魂の星図をひらく</a></p></section>
<section class="hints"><div class="sec-head"><h2 class="ka">インド占星術を知る、<wbr>3つの手がかり</h2></div>
<article class="hint"><div class="h-vis"><svg class="dg" viewBox="0 0 430 124" role="img" aria-label="西洋とインドで星座の区切りが約24度ずれ、同じ太陽が牡牛座と牡羊座になる図"><defs><clipPath id="cp"><rect x="64" y="0" width="366" height="124"/></clipPath></defs><g clip-path="url(#cp)"><rect x="-20" y="12" width="90" height="28" rx="4" class="dg-r"/><text x="25" y="31" class="dg-t">魚座</text><rect x="70" y="12" width="90" height="28" rx="4" class="dg-r"/><text x="115" y="31" class="dg-t">牡羊座</text><rect x="160" y="12" width="90" height="28" rx="4" class="dg-r dg-hl"/><text x="205" y="31" class="dg-t">牡牛座</text><rect x="250" y="12" width="90" height="28" rx="4" class="dg-r"/><text x="295" y="31" class="dg-t">双子座</text><rect x="340" y="12" width="90" height="28" rx="4" class="dg-r"/><text x="385" y="31" class="dg-t">蟹座</text><rect x="430" y="12" width="90" height="28" rx="4" class="dg-r"/><text x="475" y="31" class="dg-t">獅子座</text><rect x="52" y="80" width="90" height="28" rx="4" class="dg-r"/><text x="97" y="99" class="dg-t">魚座</text><rect x="142" y="80" width="90" height="28" rx="4" class="dg-r dg-hl"/><text x="187" y="99" class="dg-t">牡羊座</text><rect x="232" y="80" width="90" height="28" rx="4" class="dg-r"/><text x="277" y="99" class="dg-t">牡牛座</text><rect x="322" y="80" width="90" height="28" rx="4" class="dg-r"/><text x="367" y="99" class="dg-t">双子座</text><rect x="412" y="80" width="90" height="28" rx="4" class="dg-r"/><text x="457" y="99" class="dg-t">蟹座</text><rect x="502" y="80" width="90" height="28" rx="4" class="dg-r"/><text x="547" y="99" class="dg-t">獅子座</text></g><text x="2" y="31" class="dg-l">西洋</text><text x="2" y="99" class="dg-l">インド</text><line x1="205" y1="4" x2="205" y2="116" class="dg-sun"/><circle cx="205" cy="62" r="10" class="dg-sd"/><text x="205" y="66" class="dg-st">日</text><path d="M160 62 H142" class="dg-ar"/><text x="248" y="66" class="dg-n">約24度ずれる</text></svg><p class="h-cap">同じ太陽でも、基準が違うと星座が変わる</p></div><div class="h-txt"><span class="h-no">1</span><h3 class="ka">いつもと違う星座に、<wbr>出会うかもしれません</h3>
<p>一般的な西洋占星術が春分点を基準にするのに対し、インド占星術では、恒星を基準にした<b>「サイデリアル方式」</b>を使います。</p>
<p>二つの方式には現在<b>およそ24度の差</b>があるため、西洋占星術で牡牛座だった太陽が、インド占星術では牡羊座になることもあります。</p>
<p>星座の名前が変わるのは、星を読むための基準が違うから。慣れ親しんだ自分像に、新しい一面が加わるかもしれません。</p></div></article>
<article class="hint"><div class="h-vis"><div class="moonv"><img src="${SR.img('moti')}" alt="月の精モティ" width="150" height="150"><svg viewBox="0 0 200 200" aria-hidden="true">${Array.from({length:27},(_,k)=>{const a=(k/27)*Math.PI*2-Math.PI/2;return `<circle cx="${(100+86*Math.cos(a)).toFixed(1)}" cy="${(100+86*Math.sin(a)).toFixed(1)}" r="${k===0?6:3.4}" class="${k===0?'dg-on2':'dg-dot'}"/>`;}).join('')}</svg></div><p class="h-cap">月の通り道を27に分けた星宿</p></div><div class="h-txt"><span class="h-no">2</span><h3 class="ka">月の位置から、<wbr>心の動きを読み解きます</h3>
<p class="poem sm">何に安心し、どんなことに心が揺れるのか。</p>
<p>インド占星術では、生まれたときの<b>月の位置</b>を大切にします。特に、月の通り道を27に分けた<b>「ナクシャトラ（星宿）」</b>は、心の傾向や、その人らしい感性を読む手がかりです。</p>
<p>さらに、生まれた瞬間に東の地平線に昇っていた星座<b>「ラグナ」</b>や、太陽、ほかの星も重ね合わせ、あなたの全体像を読み解いていきます。</p></div></article>
<article class="hint"><div class="h-vis"><div class="dashav">${['duri','hira','mani','moti','prava','gome','pushpa','nila','panna'].map((id,k)=>`<span class="${k===4?'on':''}"><img src="${SR.img(id,true)}" alt="" width="56" height="56">${k===4?'<i>今</i>':''}</span>`).join('')}</div><p class="h-cap">星が順番に人生を受け持つ「ダシャー」</p></div><div class="h-txt"><span class="h-no">3</span><h3 class="ka">性質だけでなく、<wbr>人生の「時期」も<wbr>見ていきます</h3>
<p class="poem sm">自分の力を外へ広げたいとき。<br>学びを深めたいとき。<br>暮らしや人間関係を見直したいとき。</p>
<p>インド占星術には、<b>「ダシャー」</b>という独自の時期の読み方があります。人生を星が受け持つ期間に分け、その時期にどんなテーマが表れやすいかを考えます。</p>
<p>生まれ持った性質と、今巡っている時期。その両方を見ることで、これからの過ごし方を考えるヒントが得られます。</p></div></article></section>
<section><div class="sec-head"><h2>このサイトの計算方式</h2><p>ナヴァラトナでは、伝統的なパラーシャラ式を基本に、次の設定で星図を作成しています。</p></div>
<div class="facts f3"><div><span>星座の基準</span><b>サイデリアル方式</b></div><div><span>アヤナムシャ</span><b>ラーヒリー</b></div><div><span>ハウスの区切り方</span><b>ホールサイン</b></div></div>
<p class="note">アヤナムシャは、春分点を基準にした位置を、恒星を基準にした位置へ換算するための補正値です。専門用語は、最初から覚えなくても大丈夫。まずは、ご自身の星図で気になるところから見てみてください。</p></section>
${ad('mid')}
<section><div class="sec-head"><h2 class="ka">まずは、<wbr>あなたの星を<wbr>知ることから</h2><p>このサイトの占い・星図・事典は、すべて無料で利用できます。はじめての方には「魂の星図」がおすすめです。生年月日・出生時刻・出生地を入力して、あなたの星の配置を見てみましょう。出生時刻がわからない場合も利用できますが、読み取れる範囲や計算の精度が変わります。</p></div>
<a class="card tool feat" href="/chart/"><span class="k">はじめての方におすすめ</span><b>魂の星図</b><b class="tc">あなたの性質と、人生の流れを知る</b><p>出生図、心の星宿、魂の星、人生の時期、16種類の分割図をまとめて確認できます。まずは「わたしの本質」から読んでみてください。</p></a>
<div class="grid">
<a class="card tool" href="/today/"><span class="k">FREE</span><b>今日の運勢</b><b class="tc">今日をどう過ごすか、星からヒントを</b><p>生まれたときの星宿と、今日の月の巡りから、一日の流れを読み解きます。</p></a>
<a class="card tool" href="/aisho/"><span class="k">FREE</span><b>相性占い</b><b class="tc">ふたりの心が、どんなふうに響き合うか</b><p>伝統的なインド式の相性を、36点満点で確認できます。点数とあわせて、ふたりの関係を理解する手がかりを探してみてください。</p></a>
<a class="card tool" href="/group/"><span class="k">FREE</span><b>グループ相性占い</b><b class="tc">友だち・家族・職場の関係を、ひと目で</b><p>複数人の相性を一覧で確認できます。気が合う理由や、それぞれの違いを知るきっかけに。</p></a>
<a class="card tool" href="/sadesati/"><span class="k">FREE</span><b>サディサティ判定</b><b class="tc">土星の7年半は、あなたにいつ巡る？</b><p>生まれたときの月を基準に、サディサティの時期を確認できます。暮らしや責任との向き合い方を考える入口として。</p></a>
<a class="card tool" href="/yoga/"><span class="k">FREE</span><b>ヨーガ事典</b><b class="tc">星の組み合わせが語る、才能と可能性</b><p>「ヨーガ」とは、星の特定の組み合わせのこと。五大偉人ヨーガをはじめ、27のヨーガの意味を紹介します。</p></a>
</div></section>
<section><div class="sec-head"><h2>もっと知りたくなったら</h2><p>自分の星図を見ながら読むと、難しく感じた言葉も少しずつ身近になります。まずは1〜3から。そのあとは、気になるテーマを選んで読み進めてください。</p></div><div class="list">${ORDER_ART.map((sl,i)=>{const a=ARTS.find(x=>x.slug===sl);return a?`<a href="/articles/${a.slug}/"><b>${i+1}．${GUIDE_T[sl][0]}</b><span>${GUIDE_T[sl][1]}</span></a>`:'';}).join('')}</div></section>
<aside class="cta"><h2 class="ka">星図から、<wbr>あなたのこれからを<wbr>読み解く</h2><p class="poem">「自分の強みを、仕事にどう生かせる？」<br>「恋愛や結婚で、繰り返しているテーマは？」<br>「今の私は、どんな時期にいるんだろう？」</p><p>星図を見て、もっと詳しく知りたくなった方へ。</p><p>個人鑑定では、出生図・16種類の分割図・人生の時期を重ね合わせ、あなたのご相談に沿って読み解きます。生まれ持った持ち味と、今向き合っていること。そして、これからの選択のヒントを、あなたのための一冊の鑑定書にまとめてお届けします。</p><a href="${C.ctaUrl}" target="_blank" rel="noopener">個人鑑定について相談する（Threads）</a></aside>`});

/* ---------- グループ相性 ---------- */
page('/group/',{title:'グループ相性占い｜インド占星術で友だち・家族・職場の相性を一覧',desc:'最大10人の生年月日から、インド占星術の相性（アシュタクータ36点）を全員分まとめて計算。いちばん相性のいい二人、グループの潤滑油、グループの気質がわかります。',scripts:['group.js'],crumb:'グループ相性占い',
body:`<div class="hero"><span class="eyebrow">Group Compatibility</span><h1>グループ相性占い</h1><p class="lead">友だち、家族、職場のチーム。最大10人の生年月日から、全員の組み合わせの相性をまとめて計算します。時刻がわからなくても大丈夫です。</p></div>
<form class="f" id="f" novalidate><div id="rows" style="grid-column:1/-1;display:flex;flex-direction:column;gap:12px"></div><div class="actions"><button type="button" class="ghost" id="add">メンバーを追加</button><button type="submit">相性を見る</button><span class="status" id="status"></span></div><p class="note" style="grid-column:1/-1">入力した内容はこの端末の中だけで計算され、送信されません。</p></form>
<section id="res"></section>
${ad('mid')}
<section><div class="sec-head"><h2>グループ相性の見方</h2></div><div class="prose"><p>表の数字は、二人ずつの相性点（36点満点）です。緑は24点以上、オレンジは18点未満。「グループの潤滑油」は、みんなとの相性の平均が一番高い人で、輪をつなぐ役割を担いやすい人です。</p><p>二人の相性をくわしく知りたいときは、<a href="/aisho/">相性占い</a>で8項目の内訳が見られます。</p></div></section>
${cta}`});

/* ---------- 吉日カレンダー ---------- */
page('/calendar/',{title:'吉日カレンダー｜インド占星術の暦で見る吉日・満月・新月',desc:'インド占星術の暦（パンチャーンガ）で見る月ごとの吉日カレンダー。毎日の月の星宿、グル・プシュヤ、アムリタ・シッディ、エーカーダシー、満月・新月、あなたの星宿にとっての好調日がわかります。',scripts:['calendar.js'],crumb:'吉日カレンダー',
body:`<div class="hero"><span class="eyebrow">Auspicious Days</span><h1>吉日カレンダー</h1><p class="lead">インドの暦で、毎日の月の星宿と吉日を一覧にしました。あなたの星宿を選ぶと、あなたにとっての好調日が色でわかります。</p></div>
<div class="calbar"><button type="button" class="ghost" id="prev" aria-label="前の月">◀</button><h2 id="mtitle" style="margin:0"></h2><button type="button" class="ghost" id="next" aria-label="次の月">▶</button><label for="mynk" class="inline" style="margin-left:auto">あなたの星宿 <select id="mynk"></select></label></div>
<div id="cal"></div>
<p class="note">色の見方：<span class="pill g">吉日</span>は暦の吉日、<span class="pill s">暦の節目</span>は満月・新月など。あなたの星宿を選ぶと、好調日は緑、注意日はオレンジの枠になります。星宿は日の出（東京）の時点のものです。星宿がわからない方は<a href="/">生年月日だけで調べる</a>へ。</p>
<div id="det"></div><div id="mylist"></div>
<p class="note">入籍・引っ越し・開業など、目的に合う日を探すなら<a href="/muhurta/">吉日選び（ムフールタ）</a>へ。</p>
<section><div class="sec-head"><h2>今月の吉日と暦の節目</h2></div><div class="card" id="list"></div></section>
<div id="shr"></div>
${ad('mid')}
<section><div class="sec-head"><h2>吉日の意味</h2></div><div class="prose">
<p><b>グル・プシュヤ</b>　木曜日（木星の日）に、月がプシュヤにある日。プシュヤは27星宿で最も吉祥とされる星宿で、木星の日と重なるこの日は、インドで金や宝飾品を買い、学びや事業を始める大吉日として知られています。</p>
<p><b>ラヴィ・プシュヤ</b>　日曜日（太陽の日）に、月がプシュヤにある日。健康や名誉に関わる始めごとによいとされます。</p>
<p><b>アムリタ・シッディ・ヨーガ</b>　曜日と月の星宿が、特によい組み合わせになる日です（日曜×ハスタ、月曜×ムリガシラー、火曜×アシュヴィニー、水曜×アヌラーダー、木曜×プシュヤ、金曜×レーヴァティー、土曜×ローヒニー）。</p>
<p><b>エーカーダシー</b>　満ちていく月・欠けていく月の、それぞれ11日目。ヴィシュヌ神に捧げる日で、断食をして心身を清める習慣があります。</p>
<p><b>満月・新月</b>　カレンダーの日付は、日の出の時点のティティ（月齢日）で決めています。満月・新月の正確な瞬間は、一覧の時刻をご覧ください。</p>
<p><b>サンクラーンティ</b>　太陽がインド式の次の星座に移る日。1月中旬の山羊座入り（マカラ・サンクラーンティ）は、インドの大きなお祭りです。</p>
<p>あなたの好調日は、あなたの星宿から数えた<a href="/articles/tara/">ターラ（星の巡り）</a>で見ています。</p></div></section>
${cta}`});

/* ---------- 今月・今年の運勢 ---------- */
const SNAME=JY.SIGNS;
page('/fortune/',{title:'今月の運勢・今年の運勢｜インド占星術の月星座別',desc:'インド占星術の月の星座（ラーシ）12種類別に、今月の運勢と今年の運勢を、木星・土星・ラーフの運行（ゴーチャラ）から自動で読みます。注意日（チャンドラーシュタマ）もわかります。',crumb:'今月の運勢',
body:`<div class="hero"><span class="eyebrow">Gochara</span><h1>今月の運勢・今年の運勢</h1><p class="lead">インド占星術では、生まれたときの月の星座（ラーシ）から数えて、いま星がどこを通っているかで運勢を読みます。これを「ゴーチャラ」と言います。星の動きから自動で計算するので、いつでも今の運勢が見られます。</p></div>
<div class="card"><h3>あなたの「月の星座」は、西洋の星座とは違います</h3><p style="margin:0">ふだんの星占いの星座は「太陽の星座」です。インド占星術では、生まれたときの月がいた星座を使います。<a href="/">生年月日だけで調べる</a>と、月の星座もわかります。</p></div>
<div class="grid sm">${SNAME.map((s,i)=>`<a class="card tool" href="/fortune/${FD.SL[i]}/"><span class="k">${FD.IN[i]}</span><b>${s}</b><p>月が${s}の人</p></a>`).join('')}</div>
${ad('mid')}
<section><div class="sec-head"><h2>ゴーチャラ（星の運行）の読み方</h2></div><div class="prose"><p>木星は約1年、土星は約2年半、ラーフは約1年半ごとに星座を移ります。この3つの大きな星で一年の流れを、太陽・火星・金星の動きでひと月の流れを読みます。</p><p>月があなたの月の星座から8番目を通る約2日半は「チャンドラーシュタマ」と呼ばれ、インドでは大切な始めごとを避ける日とされています。</p><p>ゴーチャラは、誰にでも同じように働く「天気予報」のようなものです。あなた自身の出生図やダシャー（人生の時期）と重ねると、より深く読めます。<a href="/chart/">魂の星図</a>で調べられます。</p></div></section>
${shareS('インド占星術の月星座別・今月の運勢と今年の運勢','/fortune/')}${cta}`});
SNAME.forEach((s,i)=>{const now=Date.now();
page(`/fortune/${FD.SL[i]}/`,{title:`${s}（月星座）の今月の運勢・今年の運勢｜インド占星術`,desc:`インド占星術で月が${s}（${FD.IN[i]}）にある人の、今月の運勢と今年の運勢。木星・土星・ラーフの運行と、願いが叶いやすい日・注意日（チャンドラーシュタマ）を自動計算します。`,scripts:['fortune-data.js','fortune.js'],crumb:`<a href="/fortune/">今月の運勢</a> › ${s}`,
body:`<div class="hero"><span class="eyebrow">Moon in ${FD.SL[i].replace(/^./,c=>c.toUpperCase())}</span><h1>${s}の運勢</h1><p class="lead">月が${s}（${FD.IN[i]}）にある人へ。${FD.CHAR[i]}</p></div>
<div id="ftn" data-s="${i}"></div>
${SR.card(['火星','金星','水星','月','太陽','水星','金星','火星','木星','土星','土星','木星'][i],{label:s+'を治める星の精'})}
<section><div class="sec-head"><h2>今月の運勢</h2><div class="seg"><button type="button" class="ghost" data-off="0" aria-pressed="true">今月</button><button type="button" class="ghost" data-off="1" aria-pressed="false">来月</button></div></div><div id="fm">${FD.month(i,now,0)}</div></section>
${ad('mid')}
<section><div class="sec-head"><h2>今年の運勢</h2><p>木星・土星・ラーフ、3つの大きな星の巡り</p></div><div id="fy">${FD.year(i,now)}</div></section>
<p class="note">月の星座から数えて何番目を星が通っているかで読んでいます。月の星座がわからない方は<a href="/">生年月日だけで調べる</a>へ。</p>
<div id="shr"></div>
<div class="grid">${[(i+11)%12,(i+1)%12].map(k=>`<a class="card tool" href="/fortune/${FD.SL[k]}/"><span class="k">${k===(i+11)%12?'← 前の星座':'次の星座 →'}</span><b>${SNAME[k]}</b></a>`).join('')}</div>
${cta}`});});

/* ---------- 星宿の円盤 ---------- */
page('/wheel/',{title:'星宿の円盤｜27星宿とターラを回して見る',desc:'27星宿（ナクシャトラ）の円盤を回して、あなたの星宿から見た9つのターラ（星の巡り）を色で見られます。今日の月と星の位置も表示。',scripts:['wheel.js'],crumb:'星宿の円盤',
body:`<div class="hero"><span class="eyebrow">Nakshatra Wheel</span><h1>星宿の円盤</h1><p class="lead">27の星宿を円にならべた円盤です。上に来た星宿から数えて、ほかの星宿が9つのターラ（星の巡り）のどれにあたるかが色でわかります。円盤をドラッグして回したり、星宿を押したりしてみてください。内側の丸は、今の星の位置です。</p></div>
<div class="wctl"><button type="button" class="ghost" id="wprev" aria-label="前の星宿">◀</button><select id="wsel" aria-label="基準の星宿"></select><button type="button" class="ghost" id="wnext" aria-label="次の星宿">▶</button><button type="button" class="ghost" id="wtoday">今日の月</button></div>
<div class="wbox"><svg id="wheel" role="img" aria-label="27星宿の円盤"></svg></div>
<div class="wleg"><span><i style="background:var(--accent)"></i>ジャンマ（自分の星宿）</span><span><i style="background:#3E9B6B"></i>よい巡り</span><span><i style="background:#C9584A"></i>注意の巡り</span></div>
<div id="winfo"></div><div id="shr"></div>
${ad('mid')}
<section><div class="sec-head"><h2>円盤の見方</h2></div><div class="prose"><p>自分の星宿を1番目（ジャンマ）として数えると、ほかの星宿は、サンパット（実り）、ヴィパット（つまずき）、クシェーマ（安らぎ）、プラティヤク（障害）、サーダナ（達成）、ナイダナ（休息）、ミトラ（友）、パラマ・ミトラ（最良の縁）の9つの巡りのどれかにあたります。27星宿なので、この巡りが3回繰り返されます。</p><p>今日の月がどの色の星宿にあるかを見ると、今日があなたにとってどんな日かがわかります。外側の文字は星宿の名前、内側の小さな数字は巡りの番号です。星宿の「前」「後」は、プールヴァ（前の）・ウッタラ（後の）の略です。いちばん外の輪は、インド式の12星座です。</p><p>二人の相性をくわしく知りたいときは<a href="/aisho/">相性占い</a>へ。</p></div></section>
${cta}`});

/* ---------- 有名人の星宿 ---------- */
const CATS=[...new Set(FAM.map(f=>f.cat))];
page('/famous/',{title:'有名人の星宿｜インド占星術で見る有名人の月のナクシャトラ',desc:`大谷翔平、宇多田ヒカル、スティーブ・ジョブズなど、有名人${FAM.length}人の月の星宿（ナクシャトラ）を、生年月日から計算しました。あなたと同じ星宿の有名人は？`,crumb:'有名人の星宿',
body:`<div class="hero"><span class="eyebrow">Famous People</span><h1>有名人の星宿</h1><p class="lead">有名人${FAM.length}人の、生まれたときの月の星宿を生年月日から計算しました。あなたと同じ星宿の人はいますか？</p></div>
<p class="note">生まれた時刻は公表されていないため、生まれた日の月の星宿を出しています。その日のうちに月が次の星宿へ移った人は、二つの星宿を並べています。生年月日は公開されている情報（Wikipedia）にもとづきます。海外の方は、生まれた国の時間で計算しています。</p>
<nav aria-label="分類"><ul class="chips">${CATS.map((c,k)=>`<li><a href="#c${k}" style="text-decoration:none;color:inherit">${c}</a></li>`).join('')}<li><a href="#bynak" style="text-decoration:none;color:inherit">星宿別</a></li></ul></nav>
${CATS.map((c,k)=>`<section id="c${k}"><div class="sec-head"><h2>${c}</h2></div><div class="tbl"><table style="min-width:460px"><thead><tr><th>名前</th><th>生年月日</th><th>月の星宿</th><th>支配星</th></tr></thead><tbody>${FAM.filter(f=>f.cat===c).map(f=>`<tr><td><b>${esc(f.name)}</b></td><td class="num">${f.y}年${f.m}月${f.d}日</td><td><a href="/nakshatra/${NAK[f.n].slug}/">${NAK[f.n].name}</a>${f.n2!==null?` か <a href="/nakshatra/${NAK[f.n2].slug}/">${NAK[f.n2].name}</a>`:''}</td><td>${NAK[f.n].lord}</td></tr>`).join('')}</tbody></table></div></section>${k===1?ad('mid'):''}`).join('')}
<section id="bynak"><div class="sec-head"><h2>星宿別の有名人</h2></div><div class="list">${NAK.map((n,i)=>{const L=FAM.filter(f=>f.n===i||f.n2===i);return L.length?`<a href="/nakshatra/${n.slug}/"><b>${n.name}</b><span>${L.map(f=>esc(f.name)).join('、')}</span></a>`:'';}).join('')}</div></section>
${shareS('有名人の月の星宿を、インド占星術で調べました。あなたと同じ星宿は？','/famous/')}
<a class="card tool" href="/"><span class="k">無料で調べる</span><b>あなたの星宿を調べる</b><p>生年月日だけでわかります</p></a>${cta}`});

/* ---------- 吉日選び ---------- */
page('/muhurta/',{title:'吉日選び（ムフールタ）｜入籍・引っ越し・開業によい日',desc:'インド占星術のムフールタ（吉日選び）で、入籍・結婚式、引っ越し、開業・契約、旅行、大きな買いもの、習いごとによい日を、これから最大6か月分探せます。あなたの星宿にとってよい日もわかります。',scripts:['muhurta.js'],crumb:'吉日選び',
body:`<div class="hero"><span class="eyebrow">Muhurta</span><h1>吉日選び（ムフールタ）</h1><p class="lead">インドでは、結婚、引っ越し、開業など人生の大切な始まりを、星を見て選んだ「ムフールタ（よい時）」に行います。目的を選ぶと、これからの吉日を探します。</p></div>
<form class="f" id="mf" novalidate><label for="mp">目的<select id="mp"></select></label><label for="mn">あなたの星宿（わかれば）<select id="mn"></select></label><label for="mr">探す期間<select id="mr"><option value="1">1か月</option><option value="3" selected>3か月</option><option value="6">6か月</option></select></label><div class="actions"><button type="submit">吉日を探す</button></div><p class="note" style="grid-column:1/-1">星宿がわからない方は<a href="/">生年月日だけで調べる</a>へ。</p></form>
<section id="mres" style="display:flex;flex-direction:column;gap:12px"></section>
${ad('mid')}
<section><div class="sec-head"><h2>このページの吉日の選び方</h2></div><div class="prose">
<p>ムフールタでは、その日の月の星宿、ティティ（月齢日）、曜日の3つを組み合わせて、目的に合う日を選びます。このページでは、次の条件をすべて満たす日を出しています。</p>
<ul><li>月の星宿が、目的ごとに伝統的に選ばれる星宿であること</li><li>ティティが吉日（2・3・5・7・10・11・12・13日目）であること。4・9・14日目（リクタ）と新月・満月は避けます</li><li>火曜日・土曜日を避けること（旅行は日曜日も可）</li><li>あなたの星宿を選んだ場合は、あなたの星宿から数えたターラが、ジャンマ・ヴィパット・プラティヤク・ナイダナ（自分の星宿・すれ違い・障害・破壊）にあたる日を除くこと</li></ul>
<p>「特におすすめ」は、満ちていく月の日、あなたにとってサンパット・サーダナ・パラマ・ミトラ（実り・達成・最良の縁）の日、グル・プシュヤなどが重なる日です。</p>
<p>本格的なムフールタでは、その日の中でもよい時間帯（ラグナ）まで選び、本人の出生図の時期も重ねます。このページは日を選ぶための簡易版です。当日の時間帯は<a href="/today/">今日の吉凶の時間帯（チョーガディヤ）</a>で見られます。</p></div></section>
${cta}`});

/* ---------- 宝石の精 ---------- */
const NKBY=pl=>NAK.filter((n,i)=>JY.DL[i%9]===pl);
page('/seirei/',{title:'ナヴァラトナ　9つの宝石の精｜27星宿を守る精',desc:'インド占星術の9つの星（ナヴァグラハ）には、それぞれ決まった宝石があります。ルビーの精マニ、真珠の精モティなど、27星宿を守る9人の宝石の精を紹介します。',crumb:'ナヴァラトナ',og:'/assets/og.png',
body:`<div class="hero"><span class="eyebrow">Navaratna · Gem Spirits</span><h1>ナヴァラトナ<br><small style="font-size:.55em">9つの宝石の精</small></h1><p class="lead">インド占星術の9つの星には、それぞれ決まった宝石があります（ナヴァラトナ）。ナヴァラトナでは、その宝石から生まれた9人の精が、27の星宿を3つずつ守っています。あなたの星宿を守るのは、どの精でしょう？</p></div>
${quickForm}
<div class="sr-grid">${SR.L.map(x=>`<div class="card" id="${x.id}"><img src="${SR.img(x.id)}" alt="${x.gem}の精 ${x.name}" width="180" height="180" loading="lazy"><span class="eyebrow">${x.gem}の精・${x.pl}</span><b class="sname">${x.name}</b><b style="font-size:15px">${x.catch}</b><p class="note" style="color:inherit;margin:0">${x.char}</p><p class="note" style="margin:0">ちょっと苦手なこと：${x.weak}</p><p style="margin:0">「${x.word}」</p><p class="note" style="margin:4px 0 0">頭の上のしるし：${x.mark}</p><div class="nk">${NKBY(x.pl).map(n=>`<a class="pill" href="/nakshatra/${n.slug}/">${n.name}</a>`).join('')}</div></div>`).join('')}</div>
${ad('mid')}
<section><div class="sec-head"><h2>五大偉人ヨーガの「王の姿」</h2><p>火星・水星・木星・金星・土星の精は、五大偉人ヨーガを持つ人のもとで、特別な姿になります。<a href="/chart/">魂の星図</a>でヨーガを調べると、あなたの精の王の姿があらわれます。</p></div>
<div class="sr-grid">${[['nila','シャシャ・ヨーガ'],['prava','ルチャカ・ヨーガ'],['panna','バドラ・ヨーガ'],['hira','マーラヴィヤ・ヨーガ'],['pushpa','ハンサ・ヨーガ']].map(([id,y])=>{const x=SR.L.find(z=>z.id===id);return `<div class="card"><img src="${SR.img(id+'_k')}" alt="${x.name}の王の姿" width="180" height="180" loading="lazy"><span class="eyebrow">${y}</span><b class="sname">${x.pl}の王・${x.name}</b></div>`;}).join('')}</div></section>
<section><div class="sec-head"><h2>9つの星と宝石</h2></div><div class="prose"><p>インドでは古くから、9つの星（ナヴァグラハ）にそれぞれの宝石を結びつけてきました。太陽はルビー、月は真珠、火星は赤珊瑚、水星はエメラルド、木星はイエローサファイア、金星はダイヤモンド、土星はブルーサファイア、ラーフはヘソナイト、ケートゥはキャッツアイです。この9つの宝石をまとめて「ナヴァラトナ（9つの宝石）」と呼びます。</p><p>27の星宿には、それぞれ支配星があり、9つの星が3つずつ受け持っています。宝石の精は、その支配星の宝石から生まれた存在です。ナヴァラトナでは、宝石を「身につけて開運するもの」ではなく、それぞれの星の性質を表す色と形として楽しんでいます。</p></div></section>
${shareS('ナヴァラトナ　9つの宝石の精。インド占星術の9つの星から生まれた精たち。あなたの星宿を守るのは？','/seirei/')}${cta}`,scripts:['seirei.js','quick.js'],inline:NKINL()});

/* ---------- 固定ページ ---------- */
page('/about/',{title:'運営者情報',desc:`${C.siteName}の運営者情報とサイトの方針。`,crumb:'運営者情報',body:`<div class="hero"><h1>運営者情報</h1></div><div class="prose">
<p><b>サイト名：</b>${C.siteName}（${C.siteSub}）<br><b>運営：</b>${C.operator}</p>
<h2>このサイトについて</h2><p>${C.siteName}は、インド占星術（ジョーティッシュ）を、日本語でわかりやすく、無料で楽しんでいただくためのサイトです。東洋の占術にも長く親しんできた占い師が、伝統的な読み方にもとづいて運営しています。</p>
<h2>計算方法</h2><p>天体の位置は、オープンソースの天文計算ライブラリ Astronomy Engine（MIT License）で計算しています。インド占星術の方式は、パラーシャラ式、アヤナムシャはラーヒリー、ハウスはホールサイン、ラーフ・ケートゥは平均位置、ダシャーは1年＝365.25日です。ほかのサイトやソフトと、日付が数日ずれることがあります。</p>
<h2>占いの結果について</h2><p>占いの結果は、伝統的な読み方にもとづく一つの視点です。健康・法律・お金など重要な判断は、専門家への相談とご自身の判断でお願いします。</p></div>`});
page('/privacy/',{title:'プライバシーポリシー',desc:`${C.siteName}のプライバシーポリシー（個人情報・Cookie・広告配信について）。`,crumb:'プライバシーポリシー',body:`<div class="hero"><h1>プライバシーポリシー</h1></div><div class="prose">
<h2>入力された生年月日について</h2><p>当サイトの占いで入力された生年月日・時刻・出生地は、お使いの端末（ブラウザ）の中だけで計算に使われ、当サイトのサーバーに送信・保存されることはありません。今日の運勢を表示するため、計算した星宿の番号のみをブラウザのローカルストレージに保存する場合があります。ブラウザの設定から削除できます。</p>
<h2>広告の配信について</h2><p>当サイトでは、第三者配信の広告サービス（Google AdSense）を利用する場合があります。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。Cookieを無効にする方法や、Googleによる広告でのCookieの使用については、<a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener">Googleの広告に関するポリシー</a>をご覧ください。パーソナライズ広告は、<a href="https://adssettings.google.com/" target="_blank" rel="noopener">広告設定</a>で無効にできます。</p>
<h2>アクセス解析について</h2><p>当サイトでは、サイトの改善のためにアクセス解析ツールを利用する場合があります。解析ツールはCookieを使って匿名のトラフィックデータを収集することがあり、個人を特定するものではありません。</p>
<h2>免責事項</h2><p>当サイトの内容は、正確さに努めていますが、その完全性を保証するものではありません。当サイトの情報を利用したことによる損害について、責任を負いかねます。</p>
<h2>著作権</h2><p>当サイトの文章の無断転載はご遠慮ください。</p>
<h2>改定</h2><p>本ポリシーは、必要に応じて改定することがあります。</p><p class="note">制定日：2026年11月</p></div>`});
page('/contact/',{title:'お問い合わせ',desc:`${C.siteName}へのお問い合わせ方法。`,crumb:'お問い合わせ',body:`<div class="hero"><h1>お問い合わせ</h1></div><div class="prose"><p>${esc(C.contactText)}</p><p>占い結果の個別のご相談にはお答えしていません。個人鑑定をご希望の方は、<a href="${C.ctaUrl}" target="_blank" rel="noopener">個人鑑定のご案内</a>をご覧ください。</p></div>`});

/* ---------- 404・sitemap・robots・icon ---------- */
fs.writeFileSync(OUT+'/404.html',fs.readFileSync(OUT+'/contact/index.html','utf8').replace(/<main class="main">[\s\S]*<\/main>/,'<main class="main"><div class="hero"><h1>ページが見つかりません</h1><p class="lead"><a href="/">トップへ戻る</a></p></div></main>').replace(/<title>[^<]*<\/title>/,`<title>ページが見つかりません｜${C.siteName}</title>`));
const today=new Date().toISOString().slice(0,10);
fs.writeFileSync(OUT+'/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>`<url><loc>${C.siteUrl}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(OUT+'/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${C.siteUrl}/sitemap.xml\n`);
fs.writeFileSync(OUT+'/assets/icon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D68A"/><stop offset=".5" stop-color="#C9A04A"/><stop offset="1" stop-color="#9C7428"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="#2B1F45"/><path d="M32 6C34 22 42 30 58 32C42 34 34 42 32 58C30 42 22 34 6 32C22 30 30 22 32 6Z" fill="url(#g)"/></svg>`);
console.log('built',pages.length,'pages; nak text',TXT.length,'articles',ARTS.length);
