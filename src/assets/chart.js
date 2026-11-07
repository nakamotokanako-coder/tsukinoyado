/* 魂の星図：入力 → 星図カード → 5つのタブ。計算はすべて JY（calc.js）の既存の関数を使う */
(function(){var $=TK.$;
var AKT=window.AKT;
var LGT=['開拓者。まっすぐで行動が早く、自分の道を自分で切り開きます。','安定と美。落ち着きと五感の豊かさで、確かなものを育てます。','知性と軽やかさ。言葉と好奇心で、人と情報をつなぎます。','守り育てる人。情が深く、家族や仲間を大切にします。','王の気質。誇り高く、自然と人の中心に立ちます。','分析と奉仕。細やかな気配りと実務力で、人を助けます。','調和と公正。美意識とバランス感覚で、人と人を結びます。','深さと変容。秘めた情熱と洞察力で、物事の本質に迫ります。','理想と自由。信念と冒険心を持ち、遠くを目指します。','忍耐と実現力。時間をかけて、着実に目標を形にします。','独創と博愛。型にはまらず、新しい視点で人の役に立ちます。','共感と霊性。優しさと直感で、人の痛みに寄り添います。'];
var VM={2:['D2 ホーラ','財・お金の蓄え方'],3:['D3 ドレッカーナ','兄弟姉妹・勇気・行動力'],4:['D4 チャトゥルタムシャ','家・土地・不動産'],7:['D7 サプタムシャ','子ども・子孫'],9:['D9 ナヴァムシャ','結婚・パートナー・人生の実り'],10:['D10 ダシャムシャ','仕事・天職・社会での役割'],12:['D12 ドワーダシャムシャ','両親'],16:['D16 ショーダシャムシャ','快適さ・幸福・乗り物'],20:['D20 ヴィムシャムシャ','信仰・精神修行'],24:['D24 チャトゥルヴィムシャムシャ','学問・教育'],27:['D27 バムシャ','総合的な強さと弱さ'],30:['D30 トリムシャムシャ','困難・弱点'],40:['D40 カヴェーダムシャ','母方から受け継ぐもの'],45:['D45 アクシャヴェーダムシャ','父方から受け継ぐもの・品性'],60:['D60 シャシュティアムシャ','過去世から持ってきたカルマ']};var VD=[2,3,4,7,9,10,12,16,20,24,27,30,40,45,60];
var THEMES=[['結婚・パートナー',9],['仕事・天職',10],['子ども・創作',7],['お金',2],['家・不動産',4],['学び',24],['両親',12],['幸福・快適さ',16],['兄弟・行動力',3],['精神性・信仰',20],['困難と弱点',30],['過去世のカルマ',60]];
var ORDER=['太陽','月','火星','水星','木星','金星','土星','ラーフ','ケートゥ'],S=JY.SIGNS,SITE='インド占星術ナヴァラトナ';
var SAMPLE={y:1990,m:5,d:15,t:'10:30'};
var st={b:null,mode:null,tab:'t-ess',theme:9,vD:9};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function dm(x){var m=Math.round(x*60);return Math.floor(m/60)+'°'+String(m%60).padStart(2,'0')+'′';}
function cells(r,D){var c={},a=JY.varga(r.asc,D);(c[a]=c[a]||[]).push('<span class="asc">Asc</span>');ORDER.forEach(function(k){var p=r.P[k],s=JY.varga(p.lon,D);(c[s]=c[s]||[]).push('<span title="'+k+'">'+p.ab+(p.retro?'<sup>R</sup>':'')+'</span>');});return {c:c,a:a};}
function pill(p){var m={高揚:'ex',自室:'own',減衰:'deb'},h='';if(p.dig)h+='<span class="pill '+m[p.dig]+'">'+p.dig+'</span> ';if(p.retro)h+='<span class="pill r">逆行</span>';return h;}
function spOf(pl){return window.SR?SR.BY[pl]:null;}
function first(t){var i=t.indexOf('。');return i<0?[t,'']:[t.slice(0,i+1),t.slice(i+1)];}
function sampleBirth(){var ms=Date.UTC(SAMPLE.y,SAMPLE.m-1,SAMPLE.d,10,30)-9*36e5;return {ms:ms,lat:35.69,lon:139.69,tz:9,place:'東京',unknown:false,label:'1990年5月15日 10:30 東京',y:SAMPLE.y,m:SAMPLE.m,d:SAMPLE.d,dayStart:Date.UTC(SAMPLE.y,SAMPLE.m-1,SAMPLE.d)-9*36e5};}

function render(b,mode){
  var r=JY.compute(b.ms,b.lat,b.lon),moon=r.P['月'],ak=r.ak,nm=mode==='me'?$('a-nm').value.trim():'',who=mode==='sample'?'サンプル':(nm?esc(nm)+'さん':'あなた');
  if(mode==='me')TK.saveNak(moon.nak.i);
  var mr=b.unknown?TK.moonNakRange(b):null,nk=moon.nak.i,lord=JY.DL[nk%9],sp=spOf(lord),CT=(window.NKCATCH||[])[nk]||'',SM=(window.NKSUM||[])[nk]||'';
  var memo={};function sens(D){if(b.unknown)return '';if(memo[D]!==undefined)return memo[D];var a0=JY.varga(r.asc,D),out='';for(var sec of [30,60,120,300,600]){var e=JY.varga(JY.compute(b.ms-sec*1000,b.lat,b.lon).asc,D),l=JY.varga(JY.compute(b.ms+sec*1000,b.lat,b.lon).asc,D);if(e!==a0||l!==a0){out=sec<=60?'<span class="pill r">とても繊細</span>':sec<=300?'<span class="pill r">やや繊細</span>':'';break;}}return memo[D]=out;}

  /* 状態の帯 */
  $('rbanner').className='rbanner '+mode;
  $('rbanner').innerHTML=mode==='sample'?'<b class="tag">サンプル</b><span>これは<b>サンプルの星図</b>です（1990年5月15日 10:30 東京生まれ）。あなたの結果ではありません。</span><button type="button" data-edit>自分の生年月日で見る</button>':
    '<b class="tag me">あなたの星図</b><span>'+who+'／'+esc(b.label)+'</span><button type="button" class="ghost" data-edit>入力内容を変更</button><a class="btn ghost" href="/horoscope/" data-horo>チャートの数値を見る</a>';

  /* あなたの星図カード */
  var lg=b.unknown?null:first(LGT[r.ascSign]);
  $('scard').innerHTML='<div class="scard" style="--sc:'+(sp?sp.color:'#4B2E73')+'">'+(sp?'<div class="sc-im"><img src="'+SR.img(sp.id)+'" alt="'+sp.gem+'の精 '+sp.name+'" width="320" height="320"></div>':'')+
    '<div class="sc-body"><span class="sc-role">心の星宿を守る宝石の精</span><b class="sc-name">'+(sp?sp.name:'')+'</b><span class="sc-gem">'+(sp?sp.gem+'の精・'+sp.pl+'の精':'')+'</span>'+
    (mode==='sample'?'<span class="sc-sample">サンプル</span>':'')+
    '<dl class="sc-dl"><div><dt>心の星宿</dt><dd><b>'+moon.nak.name+((window.NKLAB||[])[nk]?'<small class="sc-lab">'+NKLAB[nk]+'</small>':'')+'</b><span>'+esc(CT)+'</span></dd></div>'+
    '<div><dt>魂の星<small>アートマカラカ</small></dt><dd><b>'+ak+'</b><span>'+AKT[ak][0]+'</span></dd></div>'+
    '<div><dt>アセンダント<small>ラグナ</small></dt><dd>'+(b.unknown?'<span>時刻がわからないため表示していません</span>':'<b>'+S[r.ascSign]+'</b><span>'+lg[0]+'</span>')+'</dd></div></dl>'+
    '<p class="note sc-n">宝石の精は「心の星宿の支配星（'+lord+'）」から決まります。魂の星やいちばん強い星とは、役割が別です。</p></div></div>'+
    '<div class="rc-actions sc-act"><button type="button" class="ghost" data-act="save">画像を保存</button><button type="button" class="ghost" data-act="share">シェアする</button><button type="button" data-goto="t-ess">くわしく読む</button></div><p class="note rc-msg" aria-live="polite"></p>'+
    '<div class="rc-sharebox" hidden>'+TK.shareHTML('インド占星術で魂の星図をひらきました。心の星宿は「'+moon.nak.name+'」、守ってくれる宝石の精は「'+(sp?sp.name:'')+'」でした。 #ナヴァラトナ #インド占星術',location.origin+'/chart/')+'</div>';

  /* ① わたしの本質 */
  var ess='<div class="ess"><span class="eyebrow">心の星宿<small>月のナクシャトラ＝生まれたときの月がいた星宿。心の動き方を表します</small></span><h3 class="ess-v">'+moon.nak.name+'<small>月は'+S[moon.sign]+'</small></h3><p class="ess-f">'+esc(CT)+'</p><p>'+SM+'</p>'+
     (mr?'<p class="warn">この日は月が「'+JY.NK[mr[0]]+'」から「'+JY.NK[mr[1]]+'」へ移る日です。時刻がわかると確定できます。</p>':'')+
     (sp?'<div class="mini-seirei"><img src="'+SR.img(sp.id,true)+'" alt="" width="56" height="56"><span class="note">この星宿を守る精：<a href="/seirei/#'+sp.id+'">'+sp.name+'（'+sp.gem+'・'+lord+'）</a></span></div>':'')+
     '<a class="more" href="/nakshatra/'+moon.nak.slug+'/">'+moon.nak.name+'をくわしく読む →</a></div>';
  ess+='<div class="ess"><span class="eyebrow">魂の星<small>アートマカラカ＝7つの星のうち、星座の中でいちばん度数が進んだ星。人生を通して向き合い、育てていくテーマを表します</small></span><h3 class="ess-v">'+ak+'</h3><p class="ess-f">'+AKT[ak][0]+'</p><p>'+AKT[ak][1]+'</p><p>'+AKT[ak][2]+'</p><p class="ess-g"><b>育てたいこと</b>'+AKT[ak][3].replace(/^育てたいのは、/,'')+'</p><a class="more" href="/articles/atmakaraka/">魂の星について読む →</a></div>';
  ess+='<div class="ess"><span class="eyebrow">アセンダント<small>ラグナ＝生まれた瞬間に東の地平線から昇っていた星座。生まれ持った性質と、外から見たあなたを表します</small></span>'+
     (b.unknown?'<p class="note">時刻がわからないため、アセンダントは表示していません。</p>':'<h3 class="ess-v">'+S[r.ascSign]+'</h3><p class="ess-f">'+lg[0]+'</p><p>'+lg[1]+'</p>')+'<a class="more" href="/articles/houses/">12のハウスとアセンダントについて読む →</a></div>';
  ess+='<div class="ess-sub"><h3 class="subh">パートナーシップの配置</h3>'+(window.CX?CX.mangal(r,b):'')+'</div>';
  $('essence').innerHTML=ess;

  /* ② 才能と強み */
  var YG=window.YOGA||{},ys=JY.yogas(r).filter(function(y){return !(b.unknown&&y.lagna);}),grp={};
  ys.forEach(function(y){(grp[y.id]=grp[y.id]||[]).push(y.detail);});
  var ST=window.YSTAT||{freq:{},pct:[]},PT=[0,0,1,3,6],EXC=['kemadruma','kalasarpa'];
  function lv(id){var f=ST.freq[id];return f===undefined?2:f<0.10?4:f<0.25?3:f<0.45?2:1;}
  function rar(id){var L=lv(id),f=ST.freq[id];return '<span class="rar r'+L+'">'+'★★★★'.slice(0,L)+'<span class="mut">'+'★★★★'.slice(L)+'</span>'+(f!==undefined?' 試算上の出現率：約'+Math.max(1,Math.round(f*100))+'%':'')+'</span>';}
  var YDET={ruchaka:1};function ylink(id){return YDET[id]?'/yoga/'+id+'/':'/yoga/#'+id;}
  var ids=Object.keys(grp).sort(function(x,y){return lv(y)-lv(x);});
  var KG=window.SR?ids.filter(function(id){return SR.KING[id];}):[];
  $('kings').innerHTML=KG.length?KG.map(function(id){var sid=SR.KING[id],s=SR.L.filter(function(x){return x.id===sid;})[0],k=SR.king(id),Y=YG[id]||{name:id,m:'',c:''};
     return '<article class="king2" style="--sc:'+s.color+'"><div class="k-im"><img src="'+SR.img(k||sid)+'" alt="'+s.name+'の王の姿" width="320" height="320"></div><div class="k-body"><span class="eyebrow">五大偉人ヨーガ・王の姿</span><h3 class="k-name">'+s.pl+'の王・'+s.name+'</h3>'+
       '<p class="k-str"><b>どんな強み？</b>'+(Y.h?'<span class="k-h">'+Y.h+'</span>':'')+Y.m+'</p><p class="note" style="color:inherit"><b>あなたの配置：</b>'+grp[id].join('／')+'</p>'+
       '<p class="note"><b>'+Y.name+'</b>の成立条件：'+(Y.c||'')+'</p>'+rar(id)+'<a class="more" href="'+ylink(id)+'">'+Y.name+'をくわしく読む →</a></div></article>';}).join(''):
     '<div class="card nok"><p style="margin:0">このチャートには、宝石の精の「王の姿」があらわれる五大偉人ヨーガはありません。五大偉人ヨーガは持っている人の少ない配置で、ないことは悪い意味ではありません。下のヨーガと星の強さに、あなたの持ち味があらわれています。</p></div>';
  var rest=ids.filter(function(id){return KG.indexOf(id)<0;});
  $('yogas').innerHTML=rest.length?rest.map(function(id){var Y=YG[id]||{name:id,cat:'',m:''};return '<div class="card yc"><span class="eyebrow">'+Y.cat+'</span><b class="yn">'+Y.name+'</b>'+(Y.h?'<span class="yd-h">'+Y.h+'</span>':'')+'<p style="margin:0">'+Y.m+'</p><p class="note" style="color:inherit"><b>あなたの配置：</b>'+grp[id].join('／')+'</p>'+rar(id)+'<a class="more" href="/yoga/#'+id+'">くわしく読む →</a></div>';}).join(''):(KG.length?'':'<p class="note">主なヨーガは見つかりませんでした。ヨーガがないことは、悪い意味ではありません。</p>');
  var sc=ids.filter(function(id){return EXC.indexOf(id)<0;}).reduce(function(t,id){return t+PT[lv(id)];},0),below=ST.pct.filter(function(v){return v<sc;}).length,top=Math.max(1,100-below);
  var contrib=ids.filter(function(id){return EXC.indexOf(id)<0&&PT[lv(id)]>0;}).sort(function(x,y){return PT[lv(y)]-PT[lv(x)];}),
    lab=top<=10?'とても個性的な配置':top<=30?'個性的な配置':top<=60?'ほどよく個性のある配置':'よくある配置が中心';
  $('ytopw').hidden=!(ST.pct.length&&top<=30);
  $('ytop').innerHTML=ST.pct.length&&top<=30?'<p style="margin:8px 0 0"><b>'+lab+'</b>：100人いたら、上から約'+top+'番目（'+sc+'点）。</p>'+
   (contrib.length?'<p class="note" style="color:inherit"><b>点数のもとになったヨーガ：</b>'+contrib.map(function(id){var L=lv(id);return (YG[id]||{name:id}).name+'（'+'★★★★'.slice(0,L)+' +'+PT[L]+'点）';}).join('、')+'</p>':'')+
   '<p class="note">数え方：持っているヨーガを、★の数で点数にしました（★★★★＝出現率10%未満は6点、★★★＝10〜25%は3点、★★＝25〜45%は1点、★＝45%以上は0点）。その合計を、ランダムに選んだ4,000人分のチャートと比べています。ヨーガの「数」ではなく「珍しさ」を見ているので、★1つ（出現率45%以上）のヨーガがたくさんあっても点数は上がりません。良い悪いの評価ではありません。</p>':'';
  $('yoganote').innerHTML=b.unknown?'時刻がわからないため、アセンダントを使うヨーガ（五大偉人ヨーガ、ラージャ・ヨーガなど）は表示していません。':'ヨーガは成立していても、その星の強さや時期（ダシャー）によって表れ方が変わります。';
  $('stren').innerHTML=window.CX?CX.strength(r,b):'';

  /* ③ 今の人生の時期 */
  var now=Date.now(),Y=365.25*864e5,ds=JY.dasha(b.ms,moon.lon).filter(function(x){return x.end>b.ms&&x.start<b.ms+85*Y;}),cm=null,ca=null;
  ds.forEach(function(x){if(x.start<=now&&now<x.end){cm=x;x.subs.forEach(function(s){if(s.start<=now&&now<s.end)ca=s;});}});
  var cs=cm?spOf(cm.lord):null;
  $('now').innerHTML=cm?'<div class="nowc" style="--sc:'+(cs?cs.color:'#4B2E73')+'">'+(cs?'<img src="'+SR.img(cs.id,true)+'" alt="" width="120" height="120">':'')+'<div><span class="eyebrow">今ここ</span><b class="nw">'+cm.lord+'期 ／ '+ca.lord+'の小期</b>'+
     '<p style="margin:4px 0 0"><b>'+cm.lord+'期</b>（大期・'+TK.ym(cm.start)+'〜'+TK.ym(cm.end)+'）：'+TK.DT[cm.lord]+'</p><p style="margin:4px 0 0"><b>'+ca.lord+'の小期</b>（'+TK.ym(ca.start)+'〜'+TK.ym(ca.end)+'）：'+TK.DT[ca.lord]+'</p>'+
     (cs?'<p class="note">この大期を受け持つ精：<a href="/seirei/#'+cs.id+'">'+cs.name+'（'+cs.gem+'）</a></p>':'')+'<p class="note">テーマは一般的なものです。実際の出方は、その星がチャートのどこにあるかで変わります。</p></div></div>':'<p class="note">現在の時期は表示範囲外です。</p>';
  $('dasha').innerHTML=ds.map(function(x){var age=x.start<=b.ms?0:Math.floor((x.start-b.ms)/Y),cur=x===cm,past=x.end<=now,s2=spOf(x.lord);
     return '<details class="tl-row '+(cur?'cur':past?'past':'fut')+'"'+(cur?' open':'')+'><summary>'+(s2?'<img src="'+SR.img(s2.id,true)+'" alt="" width="40" height="40">':'')+'<span class="tl-m"><b>'+x.lord+'期</b><span class="d">'+(x.start<=b.ms?'誕生時':TK.ym(x.start))+' 〜 '+TK.ym(x.end)+'（'+age+'歳〜）</span></span>'+(cur?'<span class="pill now">今ここ</span>':past?'<span class="pill pst">過去</span>':'<span class="pill fut">これから</span>')+'</summary>'+
       '<p class="tl-t">'+TK.DT[x.lord]+'</p><ul class="subs">'+x.subs.map(function(s){var c=s===ca;return '<li'+(c?' class="cur"':'')+'><b>'+s.lord+'の小期</b><span class="d">'+TK.ym(s.start)+' 〜 '+TK.ym(s.end)+'</span>'+(c?'<span class="pill now">今ここ</span>':'')+'</li>';}).join('')+'</ul></details>';}).join('');
  var ss=JY.sadeSati(b.ms,moon.sign,90);
  $('ss').innerHTML=ss.length?ss.map(function(p){var live=p.start<=now&&(p.end===null||now<p.end),past=p.end!==null&&p.end<=now;return '<li class="'+(live?'cur':past?'past':'fut')+'"><span class="num">'+(p.fromStart?'誕生時':TK.ymd(p.start))+' 〜 '+(p.end?TK.ymd(p.end):'')+'</span> '+(live?'<span class="pill now">いまこの時期</span>':past?'<span class="pill pst">終了</span>':'<span class="pill fut">これから</span>')+'</li>';}).join(''):'<li>表示範囲内にはありません。</li>';

  /* ④ テーマ別 */
  var VP=window.VR?VR.parts(r,b,sens):{};
  var dg=[];ORDER.slice(0,7).forEach(function(k){var p=r.P[k],v9=JY.dignity(k,JY.varga(p.lon,9));if(p.dig==='減衰'&&(v9==='自室'||v9==='高揚'))dg.push(k);});
  function sensNote(D){var s=sens(D);return s?'<p class="note sensn">'+s+' この図は、出生時刻がほんの少し違うだけでアセンダント（ハウス）が入れ替わります。ハウスより、どの星がどの星座にあるかを中心に見るのがおすすめです。</p>':'';}
  function chartFig(D,cls){var k=cells(r,D);return '<figure class="chart '+(cls||'')+'"><figcaption><b>'+VM[D][0]+'</b><span>'+VM[D][1]+'</span>'+sens(D)+'</figcaption>'+TK.grid(k.c,b.unknown?-1:k.a,VM[D][0].split(' ')[0])+'</figure>';}
  function drawTheme(){var D=st.theme;$('themes').querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',+x.dataset.d===D?'true':'false');});
    $('theme').innerHTML='<div class="thm">'+(VP[D]||'<div class="card"><span class="eyebrow">'+VM[D][0]+'（'+VM[D][1]+'）</span><p style="margin:0">この図には、サイトでの自動の解説はありません。図そのものは、左の配置で確かめられます。星の組み合わせを重ねた読み解きは、個人鑑定でお伝えしています。</p></div>')+
      (D===9&&dg.length?'<p class="note" style="color:inherit"><b>'+dg.join('・')+'</b>は、出生図では弱い位置（減衰）ですが、D9では力を取り戻しています。年齢とともに強さが表に出てくる星です。</p>':'')+
      '<div class="thm-c">'+chartFig(D,'l')+sensNote(D)+'</div></div>';}
  $('themes').innerHTML=THEMES.map(function(t){return '<button type="button" class="ghost" data-d="'+t[1]+'" aria-pressed="false">'+t[0]+'</button>';}).join('');
  $('themes').querySelectorAll('button').forEach(function(x){x.addEventListener('click',function(){st.theme=+x.dataset.d;drawTheme();});});
  drawTheme();

  /* ⑤ 星図とデータ */
  var k1=cells(r,1);$('d1').innerHTML='<figcaption><b>D1 出生図</b><span>'+who+(mode==='me'?'':'')+'</span></figcaption>'+TK.grid(k1.c,b.unknown?-1:k1.a,'ラーシ<br>出生図');
  var t='<thead><tr><th>星</th><th>星座</th><th>度数</th><th>ハウス</th><th>星宿・パダ</th><th>状態</th><th>カーラカ</th></tr></thead><tbody>';
  if(!b.unknown)t+='<tr><td><b>アセンダント</b></td><td>'+S[r.ascSign]+'</td><td class="num">'+dm(r.asc%30)+'</td><td class="num">1室</td><td>'+r.ascNak.name+' '+r.ascNak.pada+'</td><td></td><td></td></tr>';
  ORDER.forEach(function(k){var p=r.P[k];t+='<tr><td><b>'+k+'</b></td><td>'+S[p.sign]+'</td><td class="num">'+dm(p.deg)+'</td><td class="num">'+(b.unknown?'—':p.house+'室')+'</td><td>'+p.nak.name+' '+p.nak.pada+'</td><td>'+pill(p)+'</td><td class="num">'+(p.karaka||'')+'</td></tr>';});
  $('ptable').innerHTML=t+'</tbody>';
  var near='';if(!b.unknown){var e=null,l=null;for(var m=1;m<=10;m++){if(e===null&&JY.compute(b.ms-m*6e4,b.lat,b.lon).ascSign!==r.ascSign)e=m;if(l===null&&JY.compute(b.ms+m*6e4,b.lat,b.lon).ascSign!==r.ascSign)l=m;}
    if(e!==null||l!==null)near='<br><span class="warn">アセンダントが星座の境目近くにあります（出生時刻が'+(e!==null?e+'分早い':'')+(e!==null&&l!==null?'か、':'')+(l!==null?l+'分遅い':'')+'と変わります）。時刻の記録を確認してください。</span>';}
  $('ascnote').innerHTML='カーラカ：AK＝魂の星、AmK＝仕事、BK＝兄弟、MK＝母、PiK＝子ども、GK＝ライバル、DK＝配偶者。表は横にスクロールできます。'+(b.unknown?'<br><span class="warn">時刻がわからないため、アセンダントとハウスは表示していません。月の位置は1日で約13度動くので、目安としてご覧ください。</span>':near);
  $('vpick').innerHTML=VD.map(function(D){return '<option value="'+D+'"'+(D===st.vD?' selected':'')+'>'+VM[D][0]+'（'+VM[D][1]+'）</option>';}).join('');
  function drawBig(){$('vbig').innerHTML=chartFig(st.vD,'l big-chart')+sensNote(st.vD);$('vpick').value=st.vD;}
  $('vpick').onchange=function(){st.vD=+$('vpick').value;drawBig();};
  $('vargas').innerHTML=VD.map(function(D){return '<button type="button" class="vthumb" data-v="'+D+'" aria-label="'+VM[D][0]+'を大きく表示">'+chartFig(D)+'</button>';}).join('');
  $('vargas').querySelectorAll('[data-v]').forEach(function(x){x.addEventListener('click',function(){st.vD=+x.dataset.v;drawBig();$('vbig').scrollIntoView({behavior:'smooth',block:'start'});});});
  drawBig();
  $('vnote').innerHTML='分割図は、記録された出生時刻どおりに計算しています。細かい分割図ほど、時刻がほんの少し違うだけでアセンダント（ハウス）が入れ替わる「繊細な図」です。「やや繊細」「とても繊細」の図は、ハウスより、どの星がどの星座にあるか（こちらは時刻が多少違っても変わりません）を中心に見るのがおすすめです。';

  st.b=b;st.mode=mode;st.r=r;st.sp=sp;
  wireCard(moon.nak.name,ak,b.unknown?null:S[r.ascSign],sp);
  return true;}

/* 保存とシェア */
function wireCard(nkName,ak,asc,sp){var root=$('scard'),msg=root.querySelector('.rc-msg');
  root.querySelectorAll('[data-act]').forEach(function(x){x.addEventListener('click',function(){
    if(x.dataset.act==='share'){var text='インド占星術で魂の星図をひらきました。心の星宿は「'+nkName+'」、宝石の精は「'+(sp?sp.name:'')+'」。 #ナヴァラトナ';
      if(navigator.share)navigator.share({title:SITE,text:text,url:location.origin+'/chart/'}).catch(function(){});else{var bx=root.querySelector('.rc-sharebox');bx.hidden=!bx.hidden;}}
    else{msg.textContent='画像を作っています…';makeImage(nkName,ak,asc,sp).then(function(blob){var name='navaratna-chart.png',file=null;try{file=new File([blob],name,{type:'image/png'});}catch(e){}
      if(file&&navigator.canShare&&navigator.canShare({files:[file]})&&/iPhone|iPad|Android/i.test(navigator.userAgent)){navigator.share({files:[file],title:SITE}).then(function(){msg.textContent='';}).catch(function(){msg.textContent='';});}
      else{var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1500);msg.textContent='画像を保存しました。生年月日や出生地は画像に入っていません。';}
    }).catch(function(){msg.textContent='画像を作れませんでした。お手数ですが、画面のスクリーンショットをご利用ください。';});}});});}
function makeImage(nkName,ak,asc,sp){return new Promise(function(res,rej){if(!sp)return rej();var W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;var x=cv.getContext('2d');if(!x)return rej();
  var img=new Image();img.onload=function(){(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){
    var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#FFFDF8');g.addColorStop(1,'#F6EEDF');x.fillStyle=g;x.fillRect(0,0,W,H);
    var rg=x.createRadialGradient(W/2,480,40,W/2,480,480);rg.addColorStop(0,sp.color+'55');rg.addColorStop(1,sp.color+'00');x.fillStyle=rg;x.fillRect(0,0,W,H);
    x.strokeStyle='#C9A85C';x.lineWidth=3;x.strokeRect(40,40,W-80,H-80);x.lineWidth=1;x.strokeRect(54,54,W-108,H-108);
    var serif='"Shippori Mincho B1","Hiragino Mincho ProN","Yu Mincho",serif',sans='"Zen Kaku Gothic New","Hiragino Sans","Yu Gothic",sans-serif';
    x.textAlign='center';x.fillStyle='#A9822F';x.font='700 32px '+sans;x.fillText('魂の星図　心の星宿を守る宝石の精',W/2,140);
    x.drawImage(img,W/2-290,165,580,580);
    x.fillStyle='#2B1F45';x.font='800 108px '+serif;x.fillText(sp.name,W/2,850);
    x.fillStyle='#584E70';x.font='500 34px '+sans;x.fillText(sp.gem+'の精・'+sp.pl+'の精',W/2,905);
    var rows=[['心の星宿',nkName],['魂の星',ak]];if(asc)rows.push(['アセンダント',asc]);
    rows.forEach(function(rw,k){var yy=995+k*72;x.textAlign='right';x.fillStyle='#A9822F';x.font='700 32px '+sans;x.fillText(rw[0],W/2-24,yy);x.textAlign='left';x.fillStyle='#2B1F45';x.font='800 46px '+serif;x.fillText(rw[1],W/2+8,yy);});
    x.textAlign='center';x.fillStyle='#A9822F';x.font='600 28px '+sans;x.fillText('インド占星術ナヴァラトナ',W/2,1262);
    cv.toBlob(function(bb){bb?res(bb):rej();},'image/png');});};img.onerror=rej;img.src=SR.img(sp.id);});}

/* タブ */
function tabs(){var T=[].slice.call(document.querySelectorAll('[role=tab]'));
  function sel(id,focus){T.forEach(function(t){var on=t.id===id;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;$(t.getAttribute('aria-controls')).hidden=!on;if(on&&focus)t.focus();});st.tab=id;}
  T.forEach(function(t,i){t.addEventListener('click',function(){sel(t.id);var tb=document.querySelector('.tabs'),y=tb.getBoundingClientRect().top;if(y>120||y<-2)window.scrollTo({top:window.scrollY+y-4,behavior:'smooth'});});t.addEventListener('keydown',function(e){var k=e.key,j=k==='ArrowRight'?(i+1)%T.length:k==='ArrowLeft'?(i-1+T.length)%T.length:k==='Home'?0:k==='End'?T.length-1:-1;if(j>=0){e.preventDefault();sel(T[j].id,true);}});});
  return sel;}
var selTab;
function show(b,mode){try{render(b,mode);}catch(err){$('status').textContent='計算できませんでした。入力を確認してください。';return;}
  $('result').hidden=false;$('inwrap').classList.add('done');$('status').textContent='';selTab(st.tab);
  $('result').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){try{$('result').focus({preventScroll:true});}catch(e){}},400);}
TK.initPlace('a-');selTab=tabs();
$('f').addEventListener('submit',function(e){e.preventDefault();var b=TK.readBirth('a-');if(b.err){$('status').textContent=b.err;return;}show(b,'me');});
$('sample').addEventListener('click',function(){show(sampleBirth(),'sample');});
/* ホロスコープ作成ページとの行き来（URLには載せない） */
function horoData(){if(st.mode==='sample'){var ti=TK.PLACES.map(function(x){return x[0];}).indexOf('東京');return {bd:'1990-05-15',bt:'10:30',unk:false,pl:String(ti)};}return TK.formData('a-');}
document.addEventListener('click',function(e){var h=e.target.closest&&e.target.closest('[data-horo]');if(h){e.preventDefault();TK.handTo('/horoscope/',horoData());}});
(function(){var d=TK.takeHand('a-');if(!d)return;if(d.complete){var b=TK.readBirth('a-');if(!b.err)show(b,'me');}else{$('status').textContent='生年月日を入れました。出生時刻と出生地を入れて「私の星図をひらく」を押してください。';setTimeout(function(){var t=$('a-bt');if(t)t.focus();},300);}})();
document.addEventListener('click',function(e){var ed=e.target.closest&&e.target.closest('[data-edit]');if(ed){$('inwrap').classList.remove('done');$('inwrap').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){$('a-bd-y')?$('a-bd-y').focus({preventScroll:true}):$('a-bd').focus({preventScroll:true});},350);return;}
  var g=e.target.closest&&e.target.closest('[data-goto]');if(g){selTab(g.dataset.goto);document.querySelector('.tabs').scrollIntoView({behavior:'smooth',block:'start'});}});
/* 南インド式・北インド式の切り替え（結果を保ったまま描き直す） */
var NOTE={s:'南インド式。星座の位置は固定で、色のついたマスがアセンダント（ラグナ）です。',n:'北インド式。上の中央のひし形が1室（アセンダント）で、そこから反時計回りに2室、3室…と続きます。数字は星座の番号（1＝牡羊座〜12＝魚座）です。時刻がわからない場合は南インド式で表示します。'};
function syncStyle(){var v=TK.getStyle();$('stylenote').textContent=NOTE[v];document.querySelectorAll('[data-style]').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.style===v?'true':'false');});}
document.querySelectorAll('[data-style]').forEach(function(x){x.addEventListener('click',function(){TK.setStyle(x.dataset.style);syncStyle();if(st.b){var y=window.scrollY;render(st.b,st.mode);selTab(st.tab);window.scrollTo(0,y);}});});
syncStyle();
})();
