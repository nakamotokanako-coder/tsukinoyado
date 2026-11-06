import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import {createRequire} from 'node:module'; const C=JSON.parse(fs.readFileSync('site.config.json','utf8'));
const OUT='dist'; fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT+'/assets',{recursive:true});
const rd=f=>fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):[];
const NAKD=rd('content/nak_data.json'); const TXT=[...rd('content/nak_text_a.json'),...rd('content/nak_text_b.json')];
const NAK=NAKD.map(d=>({...d,...(TXT.find(t=>t.id===d.id)||{})}));
const ARTS=rd('content/articles.json');
const FAMOUS=rd('content/famous.json');
/* 計算エンジンをビルドでも使う */
const VMX={Astronomy:createRequire(import.meta.url)('astronomy-engine'),console,Date,Math};vm.createContext(VMX);
vm.runInContext(fs.readFileSync('src/assets/calc.js','utf8')+';this.JY=JY;',VMX);vm.runInContext(fs.readFileSync('src/assets/fortune-data.js','utf8')+';this.FD=FD;',VMX);
const JY=VMX.JY,FD=VMX.FD;
const FAM=FAMOUS.map(f=>{const [y,m,d]=f.date.split('-').map(Number),ds=Date.UTC(y,m-1,d)-f.tz*36e5,a=JY.nak(JY.moonSid(ds)).i,b=JY.nak(JY.moonSid(ds+864e5-6e4)).i;return {...f,y,m,d,n:a,n2:a===b?null:b};});
const YOGA=rd('content/yoga.json');
const YST=fs.existsSync('content/yoga_stats.json')?JSON.parse(fs.readFileSync('content/yoga_stats.json','utf8')):{freq:{},pct:[]};
const YLV=id=>{const f=YST.freq[id];return f===undefined?2:f<0.10?4:f<0.25?3:f<0.45?2:1;};const YLN=['','よくある','ときどき','珍しい','とても珍しい'];
const YMAP=Object.fromEntries(YOGA.map(y=>[y.id,{name:y.name,cat:y.cat,m:y.meaning.split('。').filter(Boolean).slice(0,2).join('。')+'。'}]));
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
for(const f of fs.readdirSync('src/assets')) fs.copyFileSync('src/assets/'+f,OUT+'/assets/'+f);
const astro='node_modules/astronomy-engine/astronomy.browser.min.js';
fs.copyFileSync(astro,OUT+'/assets/astronomy.min.js');
const V=Date.now().toString(36);
const NAV=[['/jyotish/','はじめての方へ'],['/today/','今日の運勢'],['/fortune/','今月の運勢'],['/calendar/','吉日カレンダー'],['/chart/','魂の星図'],['/aisho/','相性占い'],['/group/','グループ相性'],['/nakshatra/','27星宿'],['/yoga/','ヨーガ'],['/articles/','読みもの']];
const TOOLS={chart:['/chart/','魂の星図','出生図・魂の星・ダシャー・16分割図'],aisho:['/aisho/','相性占い','36点で見るインド式の相性'],today:['/today/','今日の運勢','27星宿別・毎日更新'],sadesati:['/sadesati/','サディサティ判定','土星の7年半はいつ？'],group:['/group/','グループ相性占い','友だち・家族・職場の相性を一覧で'],yoga:['/yoga/','ヨーガ事典','五大偉人ヨーガほか27のヨーガ'],panchang:['/today/','今日の暦','月の星宿・ティティ・ラーフ・カーラ'],fortune:['/fortune/','今月・今年の運勢','月の星座12種別・星の運行で自動更新'],calendar:['/calendar/','吉日カレンダー','グル・プシュヤ、満月、あなたの好調日'],wheel:['/wheel/','星宿の円盤','回して見る、27星宿の関係'],famous:['/famous/','有名人の星宿','あの人と同じ星宿？']};
const ad=n=>C.adsenseClient?`<div class="ad"><p class="ad-label">広告</p><ins class="adsbygoogle" style="display:block" data-ad-client="${C.adsenseClient}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`:'';
const pages=[];
const shareS=(text,p)=>{const url=C.siteUrl+p,e=encodeURIComponent,u=e(url),t=e(text);return `<div class="share"><span class="share-l">シェアする</span><a class="sh x" href="https://twitter.com/intent/tweet?text=${t}&url=${u}" target="_blank" rel="noopener">X</a><a class="sh th" href="https://www.threads.net/intent/post?text=${e(text+' '+url)}" target="_blank" rel="noopener">Threads</a><a class="sh ln" href="https://social-plugins.line.me/lineit/share?url=${u}&text=${t}" target="_blank" rel="noopener">LINE</a><a class="sh fb" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener">Facebook</a><a class="sh hb" href="https://b.hatena.ne.jp/entry/s/${url.replace(/^https?:\/\//,'')}" target="_blank" rel="noopener">はてブ</a><button type="button" class="sh cp" data-copy="${esc(text+' '+url)}">リンクをコピー</button></div>`;};
const quickForm=`<section id="quick"><div class="sec-head"><h2>生年月日だけで、あなたの星宿を調べる</h2><p>生まれた時刻がわからなくても大丈夫。日本で生まれた方向けに、日本時間で計算します。</p></div><form class="f quick" id="qf" novalidate><label for="qbd">生年月日<input id="qbd" type="date" value="1990-05-15" min="1900-01-01" max="2099-12-31"></label><div class="actions"><button type="submit">星宿を調べる</button></div></form><div id="qres" aria-live="polite"></div></section>`;
const NKINL=()=>`window.NKSUM=${JSON.stringify(NAK.map(n=>n.summary||''))};window.NKSU=${JSON.stringify(NAK.map(n=>n.sukuyo))};`;
function page(p,{title,desc,body,scripts=[],inline='',ld=null,crumb=null}){
  const full=p==='/'?`${C.siteName}｜${C.siteSub}`:`${title}｜${C.siteName}`;
  const url=C.siteUrl+p;
  const html=`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(full)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="${p==='/'?'website':'article'}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="${C.siteName}"><meta property="og:image" content="${C.siteUrl}/assets/og.png"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1F1A38"><link rel="icon" href="/assets/icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/style.css?v=${V}">
${C.adsenseClient?`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${C.adsenseClient}" crossorigin="anonymous"></script>`:''}
${ld?`<script type="application/ld+json">${JSON.stringify(ld)}</script>`:''}
</head><body>
<header class="bar"><div class="bar-in"><a class="logo" href="/">${C.siteName}<small>${C.siteSub}</small></a><nav aria-label="メイン"><ul>${NAV.map(([h,l])=>`<li><a href="${h}"${p.startsWith(h)?' aria-current="page"':''}>${l}</a></li>`).join('')}</ul></nav></div></header>
<main class="main">${crumb?`<p class="crumb"><a href="/">トップ</a> › ${crumb}</p>`:''}${body}</main>
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
const nakChips=()=>`<div class="grid sm">${NAK.map(n=>`<a class="card tool" href="/nakshatra/${n.slug}/"><span class="k">${n.id}　${n.sukuyo}</span><b>${n.name}</b><p>${esc(n.catch||n.span)}</p></a>`).join('')}</div>`;
const artList=list=>`<div class="list">${list.map(a=>`<a href="/articles/${a.slug}/"><b>${esc(a.title)}</b><span>${esc(a.description)}</span></a>`).join('')}</div>`;
const TARA_ROWS=[['1','ジャンマ','命','自分を整える'],['2','サンパット','栄','実り・豊かさ'],['3','ヴィパット','衰','つまずきに注意'],['4','クシェーマ','安','穏やか・安定'],['5','プラティヤク','危','無理をしない'],['6','サーダナ','成','願いが形になる'],['7','ナイダナ','壊','休息を大切に'],['8','ミトラ','友','人の縁'],['9','パラマ・ミトラ','親','最良の縁']];

/* ---------- トップ ---------- */
page('/',{title:'トップ',desc:'インド占星術（ジョーティッシュ）の無料占いサイト。生年月日だけでわかる27星宿、今日の運勢、今月の運勢、吉日カレンダー、魂の星図、相性占いを無料で。',scripts:['today.js','quick.js'],inline:NKINL(),
body:`<div class="hero"><span class="eyebrow">Jyotish · Vedic Astrology</span><h1>月の宿に、<br>あなたの星を訪ねる。</h1><p class="lead">インド占星術（ジョーティッシュ）は、生まれた瞬間の月が宿っていた「星宿」から、人の性質と人生の時期を読む占星術です。日本の宿曜のルーツでもあるこの智慧を、すべて無料でどうぞ。</p></div>
${quickForm}
<section><div class="sec-head"><h2>今日の運勢 <span id="today-date" class="note"></span></h2><p>生まれた星宿と、今日の月の星宿の巡り（ターラ）から読む毎日の運勢です。</p></div>
<div class="card now" id="mine"></div><div class="grid" id="pick"></div><p class="note"><a href="/today/">27星宿すべての今日の運勢を見る →</a></p></section>
${ad('top')}
<section><div class="sec-head"><h2>無料占い</h2><p>生年月日と時刻、出生地を入れるだけ。計算はすべてあなたの端末の中で行います。</p></div>${toolCards(['chart','aisho','fortune','calendar','group','sadesati','wheel','famous','yoga'])}</section>
<section><div class="sec-head"><h2>今日の暦（パンチャーンガ）</h2><p>インドの暦で見る、今日という日の性質。</p></div><div class="facts" id="pc"></div></section>
<section><div class="sec-head"><h2>27星宿（ナクシャトラ）</h2><p>月の通り道を27に分けた「月の宿」。生まれたときの月の星宿が、あなたの心のかたちを表します。</p></div>${nakChips()}</section>
${ad('mid')}
<section><div class="sec-head"><h2>読みもの</h2><p>はじめてのインド占星術。</p></div>${artList(ARTS.slice(0,6))}<p class="note"><a href="/articles/">すべての読みもの →</a></p></section>
${shareS('インド占星術の無料占いサイト「月の宿」。生年月日だけで27星宿がわかります。','/')}${cta}`});

/* ---------- 今日の運勢 ---------- */
page('/today/',{title:'今日の運勢（27星宿別）と今日の暦',desc:'インド占星術の27星宿（ナクシャトラ）別に、今日の運勢を毎日自動で更新。月の星宿、ティティ、ヨーガ、ラーフ・カーラの時間帯もわかります。',scripts:['today.js'],crumb:'今日の運勢',
body:`<div class="hero"><span class="eyebrow">Daily Tara</span><h1>今日の運勢 <span id="today-date" style="font-size:.55em"></span></h1><p class="lead">生まれたときの月の星宿から、今日の月の星宿までを数えた「ターラ（星の巡り）」で、27星宿それぞれの一日を読みます。</p></div>
<div class="card now" id="mine"></div><div class="grid" id="pick"></div>
${ad('top')}
<section><div class="sec-head"><h2>27星宿別の今日の運勢</h2><p>星宿名を押すと、くわしい性格と今日のアドバイスが見られます。</p></div><div class="tara" id="tara"></div></section>
<section><div class="sec-head"><h2>今日の暦（パンチャーンガ）</h2><p>時刻は東京の値です。</p></div><div class="facts" id="pc"></div></section>
<section><div class="sec-head"><h2>9つのターラの意味</h2><p>星宿は9つごとに同じ性質の巡りを繰り返します。日本の宿曜の「三九の秘法」と同じ構造です。</p></div>
<div class="tbl"><table style="min-width:420px"><thead><tr><th>順番</th><th>ターラ</th><th>宿曜</th><th>この日の性質</th></tr></thead><tbody>${TARA_ROWS.map(r=>`<tr><td class="num">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody></table></div>
<p class="note"><a href="/articles/tara/">今日の運勢のしくみをくわしく読む →</a></p></section>
${ad('bottom')}${cta}`});

/* ---------- 魂の星図 ---------- */
page('/chart/',{title:'魂の星図｜インド占星術の無料ホロスコープ（出生図・分割図・ダシャー）',desc:'生年月日・時刻・出生地から、インド占星術の出生図（南インド式）、魂の星（アートマカラカ）、月の星宿、ヴィムショッタリ・ダシャー、サディサティ、分割図D9・D10・D60を無料で計算します。',scripts:['chart.js'],crumb:'魂の星図',
inline:`window.NKSUM=${JSON.stringify(NAK.map(n=>n.summary||''))};window.YOGA=${JSON.stringify(YMAP)};window.YSTAT=${JSON.stringify(YST)};`,
body:`<div class="hero"><span class="eyebrow">Free Birth Chart</span><h1>魂の星図</h1><p class="lead">出生図、魂の目的を示す星、心の星宿、人生の時期、結婚・天職・過去世の分割図まで。生まれた時刻がわかると、より正確になります。</p></div>
<form class="f" id="f" novalidate>${birthForm('a-','生まれたときのこと',{name:true})}<div class="actions"><button type="submit">星図を出す</button><span class="status" id="status"></span></div></form>
<div id="result" style="display:flex;flex-direction:column;gap:36px">
<section><div class="sec-head"><h2>あなたの核</h2><p>魂の目的・心・生まれ持った性質</p></div><div class="grid" id="readings"></div><div id="shr"></div></section>
<section><div class="sec-head"><h2>あなたのヨーガ</h2><p>星の組み合わせが生む、特別な配置。五大偉人ヨーガ、ラージャ・ヨーガなどを自動で見つけます。</p></div><div class="card now" id="ytop"></div><div class="grid" id="yogas"></div><p class="note" id="yoganote"></p></section>
${ad('top')}
<section><div class="sec-head"><h2>出生図（ラーシ・チャート）</h2><p>南インド式。星座の位置は固定で、色のついたマスがアセンダント（ラグナ）です。</p></div><figure class="chart l" id="d1"></figure><div class="tbl"><table id="ptable"></table></div><p class="note" id="ascnote"></p></section>
<section><div class="sec-head"><h2>人生の時期</h2><p>ヴィムショッタリ・ダシャーと、土星の7年半（サディサティ）</p></div><div class="card now" id="now"></div><div class="timeline" id="dasha"></div><div class="card"><h3>サディサティ（土星の7年半）</h3><ul id="ss" style="margin:0;padding-left:1.2em"></ul></div></section>
${ad('mid')}
<section><div class="sec-head"><h2>分割図（16種類）</h2><p>パラーシャラが説いた16の分割図すべて。人生のテーマごとに星を細かく見る図で、D1で弱い星も、ここで強さを取り戻すことがあります。</p></div><div class="charts" id="vargas"></div><p class="note" id="vnote"></p></section>
</div>
<section><div class="sec-head"><h2>この星図の見方</h2></div><div class="prose"><p>インド占星術では、星座を実際の星の位置に合わせる「サイデリアル方式」を使うため、西洋占星術とは星座が約1つずれることがあります。くわしくは<a href="/articles/what-is-jyotish/">インド占星術とは</a>、<a href="/articles/divisional-charts/">分割図の読み方</a>、<a href="/articles/atmakaraka/">魂の星（アートマカラカ）とは</a>をどうぞ。</p></div></section>
${cta}`});

/* ---------- 相性 ---------- */
page('/aisho/',{title:'相性占い｜インド式アシュタクータ（36点満点）',desc:'二人の生年月日から、インド占星術の伝統的な相性占い「アシュタクータ」を36点満点で無料計算。ヴァルナ、ヨーニ、ガナ、ナーディなど8項目の意味も解説します。',scripts:['aisho.js'],crumb:'相性占い',
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
page('/nakshatra/',{title:'27星宿（ナクシャトラ）一覧',desc:'インド占星術の27星宿（ナクシャトラ）の一覧。各星宿の性格、恋愛、仕事、神話と、日本の宿曜27宿との対応をまとめています。',crumb:'27星宿',scripts:['quick.js'],inline:NKINL(),
body:`<div class="hero"><span class="eyebrow">27 Nakshatras</span><h1>27星宿（ナクシャトラ）</h1><p class="lead">ナクシャトラは、月がひと晩ずつ泊まる27の「月の宿」。インドから中国を経て日本に伝わり、宿曜の27宿になりました。あなたの星宿は<a href="/chart/">魂の星図</a>で調べられます。</p></div>
${quickForm}
<div class="grid"><a class="card tool" href="/wheel/"><span class="k">回して見る</span><b>星宿の円盤</b><p>27星宿の関係を、円盤を回して色で見る</p></a><a class="card tool" href="/famous/"><span class="k">あの人は？</span><b>有名人の星宿</b><p>${FAM.length}人の有名人の月の星宿</p></a></div>
${nakChips()}${ad('mid')}
<div class="tbl"><table style="min-width:620px"><thead><tr><th>#</th><th>星宿</th><th>宿曜</th><th>範囲</th><th>支配星</th><th>ガナ</th></tr></thead><tbody>${NAK.map(n=>`<tr><td class="num">${n.id}</td><td><a href="/nakshatra/${n.slug}/">${n.name}</a></td><td>${n.sukuyo}</td><td>${n.span}</td><td>${n.lord}</td><td>${n.gana}</td></tr>`).join('')}</tbody></table></div>`});
const RTYPES=[['命','同じ星宿','分身のように似た二人。強い共感で結ばれ、同じ弱点も分かち合います。'],['栄親','栄・親','互いを引き立て、豊かにし合う、穏やかで発展的な関係。一緒にいるほど運が育ちます。'],['友衰','友・衰','気楽で心地よい友情の関係。なれ合いになると、どちらかが疲れやすい面も。'],['安壊','安・壊','強く惹かれ合い、互いを大きく動かす関係。「安」の側は安らぎを、「壊」の側は変化をもたらします。'],['危成','危・成','違いから学び合う関係。最初はすれ違っても、互いを成長させます。'],['業胎','業・胎','前世からの約束を感じさせる、宿命的な縁。']];
const relTable=i=>{const rows=RTYPES.map(([t,lab,desc])=>{const L=[];for(let j=0;j<27;j++){if(t==='命'&&j!==i)continue;const r=JY.relation(i,j);if(r.type!==t)continue;L.push(`<li><a href="/nakshatra/${NAK[j].slug}/">${NAK[j].name}</a>${t==='命'?'':`<small>相手は${r.aSees}・あなたは${r.bSees}</small>`}</li>`);}
  return `<div class="rel"><h3><span class="rt t-${t}">${t}</span>${lab}</h3><p class="note" style="margin:2px 0 8px">${desc}</p><ul class="chips rl">${L.join('')}</ul></div>`;}).join('');
  return `<section><div class="sec-head"><h2>${NAK[i].name}と、ほかの星宿との関係</h2><p>宿曜の「三九の秘法」と同じしくみで、星宿どうしの距離から関係を読みます。「相手は栄」は、${NAK[i].name}のあなたから見て相手が「栄」にあたるという意味です。<a href="/wheel/">円盤で見る →</a></p></div>${rows}</section>`;};
const famousOf=i=>{const L=FAM.filter(f=>f.n===i||f.n2===i);if(!L.length)return '';return `<section><div class="sec-head"><h2>${NAK[i].name}の有名人</h2><p>生年月日から計算した月の星宿です。<a href="/famous/">有名人の星宿一覧 →</a></p></div><ul class="chips">${L.map(f=>`<li>${esc(f.name)}${f.n2!==null?'<small>（切り替わりの日）</small>':''}</li>`).join('')}</ul></section>`;};
NAK.forEach((n,i)=>{const prev=NAK[(i+26)%27],next=NAK[(i+1)%27],P=a=>(a||[]).map(x=>`<p>${esc(x)}</p>`).join('');
page(`/nakshatra/${n.slug}/`,{title:`${n.name}（${n.sukuyo}）の性格・恋愛・仕事`,desc:`インド占星術の27星宿「${n.name}」（宿曜の${n.sukuyo}）。${(n.summary||'').slice(0,70)}`,scripts:['nakwidget.js'],crumb:`<a href="/nakshatra/">27星宿</a> › ${n.name}`,
ld:{"@context":"https://schema.org","@type":"Article","headline":`${n.name}（${n.sukuyo}）の性格・恋愛・仕事`,"inLanguage":"ja"},
body:`<div class="hero"><span class="eyebrow">Nakshatra ${n.id} / 27</span><h1>${n.name}</h1><p class="lead"><b>${esc(n.catch)}</b></p><p class="lead">${esc(n.summary)}</p></div>
<div class="facts"><div><span>宿曜での対応</span><b>${n.sukuyo}</b></div><div><span>範囲（サイデリアル）</span><b>${n.span}</b></div><div><span>支配星</span><b>${n.lord}</b></div><div><span>神格</span><b>${n.deity}</b></div><div><span>シンボル</span><b>${n.symbol}</b></div><div><span>ガナ（気質）</span><b>${n.gana}</b></div><div><span>ヨーニ（動物）</span><b>${n.yoni}</b></div></div>
<div class="card now" id="nk-today" data-i="${i}"></div>
<section class="prose"><h2>性格</h2>${P(n.personality)}</section>
${ad('mid')}
<section class="prose"><h2>恋愛とパートナーシップ</h2>${P(n.love)}<h2>仕事と才能</h2>${P(n.work)}</section>
<section><div class="sec-head"><h2>強みと課題</h2></div><div class="grid"><div class="card"><h3>強み</h3><ul class="chips">${(n.strengths||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div class="card"><h3>課題</h3><ul class="chips">${(n.challenges||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div></section>
<section class="prose"><h2>神話とシンボル</h2><p>${esc(n.myth)}</p><h2>${n.name}のあなたへ</h2><p>${esc(n.advice)}</p></section>
${relTable(i)}${famousOf(i)}
<p class="note">月がどの星宿にあるかは、生まれた時刻によって変わります。<a href="/chart/">魂の星図</a>で確かめられます。相性は<a href="/aisho/">相性占い</a>へ。</p>
${shareS(n.name+'（宿曜の'+n.sukuyo+'）の性格・恋愛・仕事｜インド占星術の27星宿','/nakshatra/'+n.slug+'/')}
<div class="grid"><a class="card tool" href="/nakshatra/${prev.slug}/"><span class="k">← 前の星宿</span><b>${prev.name}</b></a><a class="card tool" href="/nakshatra/${next.slug}/"><span class="k">次の星宿 →</span><b>${next.name}</b></a></div>
${cta}`});});

/* ---------- 読みもの ---------- */
page('/articles/',{title:'読みもの｜はじめてのインド占星術',desc:'インド占星術（ジョーティッシュ）の基本をやさしく解説。27星宿、9つの星、12星座、ハウス、ダシャー、サディサティ、分割図、相性、暦まで。',crumb:'読みもの',
body:`<div class="hero"><span class="eyebrow">Reading</span><h1>読みもの</h1><p class="lead">はじめての方にもわかるように、インド占星術のしくみを一つずつ解説します。</p></div>${artList(ARTS)}${ad('bottom')}`});
ARTS.forEach(a=>{const t=TOOLS[a.related_tool]||TOOLS.chart;
page(`/articles/${a.slug}/`,{title:a.title,desc:a.description,crumb:`<a href="/articles/">読みもの</a>`,ld:{"@context":"https://schema.org","@type":"Article","headline":a.title,"description":a.description,"inLanguage":"ja"},
body:`<div class="hero"><span class="eyebrow">Reading</span><h1>${esc(a.title)}</h1><p class="lead">${esc(a.lead)}</p></div>
<article class="prose">${(a.sections||[]).map((s,i)=>`<h2>${esc(s.h2)}</h2>${(s.paras||[]).map(p=>`<p>${esc(p)}</p>`).join('')}${s.list&&s.list.length?`<ul>${s.list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${i===1?ad('mid'):''}`).join('')}</article>
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
const ORDER_ART=['what-is-jyotish','nakshatra','planets','rashi','houses','dasha','divisional-charts','atmakaraka','sade-sati','compatibility','tara','panchang'];
page('/jyotish/',{title:'インド占星術（ジョーティッシュ）とは｜はじめての方へ',desc:'インド占星術（ジョーティッシュ）とは何か。西洋占星術との違い、27星宿と日本の宿曜とのつながり、このサイトでできること、学ぶ順番をまとめた入門ガイドです。',crumb:'はじめての方へ',
ld:{"@context":"https://schema.org","@type":"Article","headline":"インド占星術（ジョーティッシュ）とは","inLanguage":"ja"},
body:`<div class="hero"><span class="eyebrow">Beginner's Guide</span><h1>インド占星術（ジョーティッシュ）とは</h1><p class="lead">ジョーティッシュは、サンスクリット語で「光の学問」。数千年の伝統を持つインドの占星術で、今もインドでは、結婚や仕事、家を建てる日取りまで、暮らしの大切な場面で使われています。</p></div>
<section class="prose"><h2>西洋占星術との3つの違い</h2>
<p><b>1. 星座の基準が違う</b><br>西洋占星術は、季節（春分点）を基準に星座を決めます。インド占星術は、夜空の実際の星の位置を基準にします（サイデリアル方式）。この差は今、約24度。そのため、西洋で牡牛座の人が、インドでは牡羊座になることがよくあります。</p>
<p><b>2. 太陽より「月」を重んじる</b><br>西洋の星占いは太陽の星座が主役ですが、インド占星術では、生まれたときの月がどこにあったかを最も大切にします。月の通り道を27に分けた「ナクシャトラ（星宿）」が、その人の心のかたちを表します。</p>
<p><b>3. 「いつ」を読む技術がある</b><br>ヴィムショッタリ・ダシャーという時期の読み方で、人生をいくつもの時期に区切り、「いつ何が起きやすいか」を具体的に読みます。土星の7年半（サディサティ）のように、時期のサイクルを細かく見られるのが大きな特徴です。</p>
<h2>日本の宿曜とのつながり</h2>
<p>インドの星宿の体系は、仏教とともに中国へ伝わり、平安時代に空海が持ち帰った『宿曜経』として日本に根づきました。宿曜の27宿は、インドの27のナクシャトラがルーツです。今日の運勢の「命・栄・衰・安・危・成・壊・友・親」という巡りも、インドのターラ（星の巡り）と同じしくみです。インド占星術は、宿曜の「ふるさと」とも言えます。</p>
<h2>このサイトの方式</h2>
<p>パラーシャラ式（インド占星術の根本経典の流れ）、アヤナムシャ（星座のずれの補正値）はラーヒリー、ハウスはホールサインで計算しています。インドで最も広く使われている、標準的な方式です。</p></section>
${ad('mid')}
<section><div class="sec-head"><h2>まずはやってみる</h2><p>生年月日を入れるだけ。すべて無料です。</p></div>${toolCards(['chart','today','aisho','group','sadesati','yoga'])}</section>
<section><div class="sec-head"><h2>この順番で読むとわかる</h2><p>はじめての方におすすめの読む順番です。</p></div><div class="list">${ORDER_ART.map((sl,i)=>{const a=ARTS.find(x=>x.slug===sl);return a?`<a href="/articles/${a.slug}/"><b>${i+1}. ${esc(a.title)}</b><span>${esc(a.description)}</span></a>`:'';}).join('')}</div></section>
${cta}`});

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
body:`<div class="hero"><span class="eyebrow">Auspicious Days</span><h1>吉日カレンダー</h1><p class="lead">インドの暦で、毎日の月の星宿と吉日を一覧にしました。あなたの星宿を選ぶと、あなたにとっての好調日（栄・成・親など）が色でわかります。</p></div>
<div class="calbar"><button type="button" class="ghost" id="prev" aria-label="前の月">◀</button><h2 id="mtitle" style="margin:0"></h2><button type="button" class="ghost" id="next" aria-label="次の月">▶</button><label for="mynk" class="inline" style="margin-left:auto">あなたの星宿 <select id="mynk"></select></label></div>
<div id="cal"></div>
<p class="note">色の見方：<span class="pill g">吉日</span>は暦の吉日、<span class="pill s">暦の節目</span>は満月・新月など。あなたの星宿を選ぶと、好調日は緑、注意日はオレンジの枠になります。星宿は日の出（東京）の時点のものです。星宿がわからない方は<a href="/">生年月日だけで調べる</a>へ。</p>
<div id="det"></div><div id="mylist"></div>
<section><div class="sec-head"><h2>今月の吉日と暦の節目</h2></div><div class="card" id="list"></div></section>
<div id="shr"></div>
${ad('mid')}
<section><div class="sec-head"><h2>吉日の意味</h2></div><div class="prose">
<p><b>グル・プシュヤ</b>　木曜日（木星の日）に、月がプシュヤ（鬼宿）にある日。プシュヤは27星宿で最も吉祥とされる星宿で、木星の日と重なるこの日は、インドで金や宝飾品を買い、学びや事業を始める大吉日として知られています。日本の宿曜で「鬼宿日」を大吉日とするのも、同じルーツです。</p>
<p><b>ラヴィ・プシュヤ</b>　日曜日（太陽の日）に、月がプシュヤにある日。健康や名誉に関わる始めごとによいとされます。</p>
<p><b>アムリタ・シッディ・ヨーガ</b>　曜日と月の星宿が、特によい組み合わせになる日です（日曜×ハスタ、月曜×ムリガシラー、火曜×アシュヴィニー、水曜×アヌラーダー、木曜×プシュヤ、金曜×レーヴァティー、土曜×ローヒニー）。宿曜の「甘露日」にあたります。</p>
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
<section><div class="sec-head"><h2>今月の運勢</h2><div class="seg"><button type="button" class="ghost" data-off="0" aria-pressed="true">今月</button><button type="button" class="ghost" data-off="1" aria-pressed="false">来月</button></div></div><div id="fm">${FD.month(i,now,0)}</div></section>
${ad('mid')}
<section><div class="sec-head"><h2>今年の運勢</h2><p>木星・土星・ラーフ、3つの大きな星の巡り</p></div><div id="fy">${FD.year(i,now)}</div></section>
<p class="note">月の星座から数えて何番目を星が通っているかで読んでいます。月の星座がわからない方は<a href="/">生年月日だけで調べる</a>へ。</p>
<div id="shr"></div>
<div class="grid">${[(i+11)%12,(i+1)%12].map(k=>`<a class="card tool" href="/fortune/${FD.SL[k]}/"><span class="k">${k===(i+11)%12?'← 前の星座':'次の星座 →'}</span><b>${SNAME[k]}</b></a>`).join('')}</div>
${cta}`});});

/* ---------- 星宿の円盤 ---------- */
page('/wheel/',{title:'星宿の円盤｜27星宿の関係を回して見る',desc:'27星宿（ナクシャトラ）の円盤を回して、星宿どうしの関係（命・栄親・友衰・安壊・危成・業胎）を色で見られます。今日の月と星の位置も表示。',scripts:['wheel.js'],crumb:'星宿の円盤',
body:`<div class="hero"><span class="eyebrow">Nakshatra Wheel</span><h1>星宿の円盤</h1><p class="lead">27の星宿を円にならべた円盤です。上に来た星宿から見て、ほかの星宿との関係が色でわかります。円盤をドラッグして回したり、星宿を押したりしてみてください。内側の丸は、今の星の位置です。</p></div>
<div class="wctl"><button type="button" class="ghost" id="wprev" aria-label="前の星宿">◀</button><select id="wsel" aria-label="基準の星宿"></select><button type="button" class="ghost" id="wnext" aria-label="次の星宿">▶</button><button type="button" class="ghost" id="wtoday">今日の月</button></div>
<div class="wbox"><svg id="wheel" role="img" aria-label="27星宿の円盤"></svg></div>
<div class="wleg"><span><i style="background:var(--accent)"></i>命</span><span><i style="background:#3E9B6B"></i>栄親</span><span><i style="background:#4C86C6"></i>友衰</span><span><i style="background:#C9584A"></i>安壊</span><span><i style="background:#D9913A"></i>危成</span><span><i style="background:#8B6FC9"></i>業胎</span></div>
<div id="winfo"></div><div id="shr"></div>
${ad('mid')}
<section><div class="sec-head"><h2>円盤の見方</h2></div><div class="prose"><p>星宿は、9つごとに同じ性質の巡り（命・栄・衰・安・危・成・壊・友・親）を3回繰り返します。宿曜の「三九の秘法」と同じしくみです。外側の文字はその星宿の名前、内側の小さな文字は「相手から見たあなた」の関係です。</p><p>星宿の「前」「後」は、プールヴァ（前の）・ウッタラ（後の）の略です。いちばん外の輪は、インド式の12星座です。</p><p>二人の相性をくわしく知りたいときは<a href="/aisho/">相性占い</a>、グループなら<a href="/group/">グループ相性占い</a>へ。</p></div></section>
${cta}`});

/* ---------- 有名人の星宿 ---------- */
const CATS=[...new Set(FAM.map(f=>f.cat))];
page('/famous/',{title:'有名人の星宿｜インド占星術で見る有名人の月のナクシャトラ',desc:`大谷翔平、宇多田ヒカル、スティーブ・ジョブズなど、有名人${FAM.length}人の月の星宿（ナクシャトラ）と宿曜の宿を、生年月日から計算しました。あなたと同じ星宿の有名人は？`,crumb:'有名人の星宿',
body:`<div class="hero"><span class="eyebrow">Famous People</span><h1>有名人の星宿</h1><p class="lead">有名人${FAM.length}人の、生まれたときの月の星宿を生年月日から計算しました。あなたと同じ星宿の人はいますか？</p></div>
<p class="note">生まれた時刻は公表されていないため、生まれた日の月の星宿を出しています。その日のうちに月が次の星宿へ移った人は、二つの星宿を並べています。生年月日は公開されている情報（Wikipedia）にもとづきます。海外の方は、生まれた国の時間で計算しています。</p>
<nav aria-label="分類"><ul class="chips">${CATS.map((c,k)=>`<li><a href="#c${k}" style="text-decoration:none;color:inherit">${c}</a></li>`).join('')}<li><a href="#bynak" style="text-decoration:none;color:inherit">星宿別</a></li></ul></nav>
${CATS.map((c,k)=>`<section id="c${k}"><div class="sec-head"><h2>${c}</h2></div><div class="tbl"><table style="min-width:460px"><thead><tr><th>名前</th><th>生年月日</th><th>月の星宿</th><th>宿曜</th></tr></thead><tbody>${FAM.filter(f=>f.cat===c).map(f=>`<tr><td><b>${esc(f.name)}</b></td><td class="num">${f.y}年${f.m}月${f.d}日</td><td><a href="/nakshatra/${NAK[f.n].slug}/">${NAK[f.n].name}</a>${f.n2!==null?` か <a href="/nakshatra/${NAK[f.n2].slug}/">${NAK[f.n2].name}</a>`:''}</td><td>${NAK[f.n].sukuyo}${f.n2!==null?'／'+NAK[f.n2].sukuyo:''}</td></tr>`).join('')}</tbody></table></div></section>${k===1?ad('mid'):''}`).join('')}
<section id="bynak"><div class="sec-head"><h2>星宿別の有名人</h2></div><div class="list">${NAK.map((n,i)=>{const L=FAM.filter(f=>f.n===i||f.n2===i);return L.length?`<a href="/nakshatra/${n.slug}/"><b>${n.name}（${n.sukuyo}）</b><span>${L.map(f=>esc(f.name)).join('、')}</span></a>`:'';}).join('')}</div></section>
${shareS('有名人の月の星宿を、インド占星術で調べました。あなたと同じ星宿は？','/famous/')}
<a class="card tool" href="/"><span class="k">無料で調べる</span><b>あなたの星宿を調べる</b><p>生年月日だけでわかります</p></a>${cta}`});

/* ---------- 固定ページ ---------- */
page('/about/',{title:'運営者情報',desc:`${C.siteName}の運営者情報とサイトの方針。`,crumb:'運営者情報',body:`<div class="hero"><h1>運営者情報</h1></div><div class="prose">
<p><b>サイト名：</b>${C.siteName}（${C.siteSub}）<br><b>運営：</b>${C.operator}</p>
<h2>このサイトについて</h2><p>${C.siteName}は、インド占星術（ジョーティッシュ）を、日本語でわかりやすく、無料で楽しんでいただくためのサイトです。宿曜や東洋の占術にも長く親しんできた占い師が、伝統的な読み方にもとづいて運営しています。</p>
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
fs.writeFileSync(OUT+'/assets/icon.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1F1A38"/><path d="M40 14a20 20 0 1 0 10 34A16 16 0 1 1 40 14z" fill="#E8A04C"/></svg>`);
console.log('built',pages.length,'pages; nak text',TXT.length,'articles',ARTS.length);
