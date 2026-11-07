/* ホロスコープ作成：数値とチャートを先に見せるページ。計算は JY（calc.js）の既存関数だけを使う */
(function(){var $=TK.$,S=JY.SIGNS;
var ORDER=['太陽','月','火星','水星','木星','金星','土星','ラーフ','ケートゥ'];
var VM={1:['D1 ラーシ','出生図'],2:['D2 ホーラ','財'],3:['D3 ドレッカーナ','兄弟・行動力'],4:['D4 チャトゥルタムシャ','家・不動産'],7:['D7 サプタムシャ','子ども'],9:['D9 ナヴァムシャ','結婚・人生の実り'],10:['D10 ダシャムシャ','仕事'],12:['D12 ドワーダシャムシャ','両親'],16:['D16 ショーダシャムシャ','快適さ・幸福'],20:['D20 ヴィムシャムシャ','精神修行'],24:['D24 チャトゥルヴィムシャムシャ','学問'],27:['D27 バムシャ','強さと弱さ'],30:['D30 トリムシャムシャ','困難'],40:['D40 カヴェーダムシャ','母方'],45:['D45 アクシャヴェーダムシャ','父方'],60:['D60 シャシュティアムシャ','過去世のカルマ']};
var VD=[1,2,3,4,7,9,10,12,16,20,24,27,30,40,45,60];
var st={b:null,mode:null,r:null,D:1};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function dm(x){var s=Math.round(x*3600),d=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return d+'°'+String(m).padStart(2,'0')+'′'+String(sec).padStart(2,'0')+'″';}
function pad(n){return String(n).padStart(2,'0');}
/* 日付・時刻は出生地の時差で表示する */
function ymdL(ms,tz){var d=new Date(ms+tz*36e5);return d.getUTCFullYear()+'/'+pad(d.getUTCMonth()+1)+'/'+pad(d.getUTCDate());}
function hmL(ms,tz){if(!ms)return '—';var d=new Date(ms+tz*36e5);return pad(d.getUTCHours())+':'+pad(d.getUTCMinutes());}
function cells(r,D){var c={},a=JY.varga(r.asc,D);(c[a]=c[a]||[]).push('<span class="asc">Asc</span>');ORDER.forEach(function(k){var p=r.P[k],s=JY.varga(p.lon,D);(c[s]=c[s]||[]).push('<span title="'+k+'">'+p.ab+(p.retro?'<sup>R</sup>':'')+'</span>');});return {c:c,a:a};}
function pill(p){var m={高揚:'ex',自室:'own',減衰:'deb'},h='';if(p.dig)h+='<span class="pill '+m[p.dig]+'">'+p.dig+'</span> ';if(p.retro)h+='<span class="pill r">逆行</span>';return h;}
function sampleBirth(){var ms=Date.UTC(1990,4,15,10,30)-9*36e5;return {ms:ms,lat:35.69,lon:139.69,tz:9,place:'東京',unknown:false,label:'1990年5月15日 10:30 東京',y:1990,m:5,d:15,dayStart:Date.UTC(1990,4,15)-9*36e5};}

function render(b,mode){var r=JY.compute(b.ms,b.lat,b.lon),moon=r.P['月'],unk=b.unknown,memo={};
  function sens(D){if(unk||D===1)return '';if(memo[D]!==undefined)return memo[D];var a0=JY.varga(r.asc,D),out='';for(var sec of [30,60,120,300,600]){var e=JY.varga(JY.compute(b.ms-sec*1000,b.lat,b.lon).asc,D),l=JY.varga(JY.compute(b.ms+sec*1000,b.lat,b.lon).asc,D);if(e!==a0||l!==a0){out=sec<=60?'<span class="pill r">とても繊細</span>':sec<=300?'<span class="pill r">やや繊細</span>':'';break;}}return memo[D]=out;}
  st.b=b;st.mode=mode;st.r=r;st.sens=sens;

  $('hbanner').className='rbanner '+(mode==='sample'?'sample':'me');
  $('hbanner').innerHTML=(mode==='sample'?'<b class="tag">サンプル</b><span>サンプルのチャートです（1990年5月15日 10:30 東京）。あなたの結果ではありません。</span><button type="button" data-hedit>自分の生年月日で作る</button>':
    '<b class="tag me">あなたのチャート</b><span>'+esc(b.label)+'</span><button type="button" class="ghost" data-hedit>入力内容を変更</button>');

  /* 要点 */
  var now=Date.now(),Y=365.25*864e5,ds=JY.dasha(b.ms,moon.lon),cm=null,ca=null;
  ds.forEach(function(x){if(x.start<=now&&now<x.end){cm=x;x.subs.forEach(function(s){if(s.start<=now&&now<s.end)ca=s;});}});
  $('hkey').innerHTML='<div><dt>アセンダント</dt><dd>'+(unk?'<span class="mut">時刻不明</span>':S[r.ascSign]+' <small class="num">'+dm(r.asc%30)+'</small>')+'</dd></div>'+
    '<div><dt>月の星座</dt><dd>'+S[moon.sign]+'</dd></div>'+
    '<div><dt>月の星宿</dt><dd>'+moon.nak.name+' <small>第'+moon.nak.pada+'パダ</small></dd></div>'+
    '<div><dt>魂の星（AK）</dt><dd>'+r.ak+'</dd></div>'+
    '<div><dt>現在のダシャー</dt><dd>'+(cm?cm.lord+' ／ '+ca.lord:'—')+'</dd></div>';

  /* 天体の一覧 */
  var t='<thead><tr><th>天体</th><th>星座</th><th>度数</th><th>黄経</th><th>星宿・パダ</th><th>星宿の支配星</th><th>ハウス</th><th>D9</th><th>状態</th><th>カーラカ</th></tr></thead><tbody>';
  if(!unk)t+='<tr class="asc-row"><td><b>アセンダント</b></td><td>'+S[r.ascSign]+'</td><td class="num">'+dm(r.asc%30)+'</td><td class="num">'+dm(r.asc)+'</td><td>'+r.ascNak.name+' '+r.ascNak.pada+'</td><td>'+JY.DL[r.ascNak.i%9]+'</td><td class="num">1室</td><td>'+S[JY.varga(r.asc,9)]+'</td><td></td><td></td></tr>';
  ORDER.forEach(function(k){var p=r.P[k];t+='<tr><td><b>'+k+'</b> <span class="ab">'+p.ab+'</span></td><td>'+S[p.sign]+'</td><td class="num">'+dm(p.deg)+'</td><td class="num">'+dm(p.lon)+'</td><td>'+p.nak.name+' '+p.nak.pada+'</td><td>'+JY.DL[p.nak.i%9]+'</td><td class="num">'+(unk?'—':p.house+'室')+'</td><td>'+S[JY.varga(p.lon,9)]+'</td><td>'+pill(p)+'</td><td class="num">'+(p.karaka||'')+'</td></tr>';});
  $('hptable').innerHTML=t+'</tbody>';
  $('hpnote').innerHTML='度数＝星座の中での度数。黄経＝牡羊座0°からの通しの度数（サイデリアル）。カーラカ：AK魂の星・AmK仕事・BK兄弟・MK母・PiK子ども・GKライバル・DK配偶者。表は横にスクロールできます。'+(unk?'<br><span class="warn">時刻がわからないため、正午で計算しています。アセンダントとハウスは表示していません。月は1日で約13度動きます。</span>':'');

  /* ダシャー */
  var dh='';ds.filter(function(x){return x.end>b.ms&&x.start<b.ms+110*Y;}).forEach(function(x){var cur=x===cm,past=x.end<=now,age=x.start<=b.ms?0:Math.floor((x.start-b.ms)/Y);
    dh+='<details class="dmd '+(cur?'cur':past?'past':'fut')+'"'+(cur?' open':'')+'><summary><b class="dl">'+x.lord+'</b><span class="num dd">'+(x.start<=b.ms?ymdL(b.ms,b.tz)+'（誕生）':ymdL(x.start,b.tz))+' 〜 '+ymdL(x.end,b.tz)+'</span><span class="num da">'+age+'歳〜</span>'+(cur?'<span class="pill now">今ここ</span>':'')+'</summary>'+
     '<table class="dad"><thead><tr><th>小期（アンタル）</th><th>はじまり</th><th>おわり</th></tr></thead><tbody>'+x.subs.map(function(s){var c=s===ca;return '<tr'+(c?' class="cur"':'')+'><td>'+x.lord+' ／ '+s.lord+(c?' <span class="pill now">今</span>':'')+'</td><td class="num">'+ymdL(s.start,b.tz)+'</td><td class="num">'+ymdL(s.end,b.tz)+'</td></tr>';}).join('')+'</tbody></table></details>';});
  $('hdasha').innerHTML=dh;

  /* 生まれた日の暦 */
  var pc=JY.panchang(b.ms,b.lat,b.lon,b.tz);
  $('hpanch').innerHTML=[['曜日',pc.vara],['ティティ（月の満ち欠け）','第'+pc.tithi+'ティティ・'+pc.tithiName+'<br><small>'+pc.paksha+'</small>'],['月の星宿',pc.nak.name+' 第'+pc.nak.pada+'パダ'],['ヨーガ（太陽と月）',pc.yoga],['日の出・日の入り',hmL(pc.rise,b.tz)+' ／ '+hmL(pc.set,b.tz)]].map(function(x){return '<div><dt>'+x[0]+'</dt><dd>'+x[1]+'</dd></div>';}).join('')+(unk?'<p class="note">時刻不明のため正午の値です。</p>':'');

  /* 分割図 */
  $('hvpick').innerHTML=VD.map(function(D){return '<option value="'+D+'"'+(D===st.D?' selected':'')+'>'+VM[D][0]+'（'+VM[D][1]+'）</option>';}).join('');
  $('hthumbs').innerHTML=VD.map(function(D){var k=cells(r,D);return '<button type="button" class="vthumb" data-v="'+D+'" aria-label="'+VM[D][0]+'を大きく表示"><figure class="chart"><figcaption><b>'+VM[D][0]+'</b><span>'+VM[D][1]+'</span>'+sens(D)+'</figcaption>'+TK.grid(k.c,unk?-1:k.a,VM[D][0].split(' ')[0])+'</figure></button>';}).join('');
  drawBig();}

function drawBig(){var r=st.r,b=st.b,D=st.D,k=cells(r,D),s=st.sens(D);
  $('hvpick').value=D;
  document.querySelectorAll('#hthumbs .vthumb').forEach(function(x){x.setAttribute('aria-pressed',+x.dataset.v===D?'true':'false');});
  $('hbig').innerHTML='<figcaption><b>'+VM[D][0]+'</b><span>'+VM[D][1]+'</span>'+s+'</figcaption>'+TK.grid(k.c,b.unknown?-1:k.a,D===1?'ラーシ<br>出生図':VM[D][0].split(' ')[0]);
  $('hsens').innerHTML=s?'この図は、出生時刻が少し違うだけでアセンダント（ハウス）が入れ替わる繊細な図です。ハウスより、星がどの星座にあるかを中心に見てください。':'';}

var NOTE={s:'南インド式：星座の位置が固定。色のついたマスがアセンダント（1室）です。',n:'北インド式：上の中央のひし形が1室（アセンダント）。数字は星座の番号（1＝牡羊座〜12＝魚座）です。時刻不明のときは南インド式で表示します。'};
function syncStyle(){var v=TK.getStyle();$('hstylenote').textContent=NOTE[v];document.querySelectorAll('[data-style]').forEach(function(x){x.setAttribute('aria-pressed',x.dataset.style===v?'true':'false');});}
document.querySelectorAll('[data-style]').forEach(function(x){x.addEventListener('click',function(){TK.setStyle(x.dataset.style);syncStyle();if(st.b){var y=window.scrollY;render(st.b,st.mode);window.scrollTo(0,y);}});});
syncStyle();

function show(b,mode){try{render(b,mode);}catch(err){$('hstatus').textContent='計算できませんでした。入力を確認してください。';return;}
  $('hresult').hidden=false;$('hin').classList.add('done');$('hstatus').textContent='';
  $('hresult').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){try{$('hresult').focus({preventScroll:true});}catch(e){}},400);}
TK.initPlace('h-');
$('hf').addEventListener('submit',function(e){e.preventDefault();var b=TK.readBirth('h-');if(b.err){$('hstatus').textContent=b.err;return;}show(b,'me');});
$('hsample').addEventListener('click',function(){show(sampleBirth(),'sample');});
$('hvpick').addEventListener('change',function(){st.D=+$('hvpick').value;drawBig();});
document.addEventListener('click',function(e){var el=e.target.closest?e.target:null;if(!el)return;
  var th=el.closest('#hthumbs [data-v]');if(th){st.D=+th.dataset.v;drawBig();$('hbigwrap').scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(el.closest('[data-hedit]')){$('hin').classList.remove('done');$('hin').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){var f=$('h-bd-y')||$('h-bd');f.focus({preventScroll:true});},350);return;}
  if(el.closest('[data-read]')){e.preventDefault();var d;if(st.mode==='sample'){d={bd:'1990-05-15',bt:'10:30',unk:false,pl:String(TK.PLACES.map(function(x){return x[0];}).indexOf('東京'))};}else d=TK.formData('h-');TK.handTo('/chart/',d);}});
/* 魂の星図・トップから来たとき */
(function(){var d=TK.takeHand('h-');if(!d)return;if(d.complete){var b=TK.readBirth('h-');if(!b.err)show(b,'me');}else{$('hstatus').textContent='生年月日を入れました。出生時刻と出生地を入れて「チャートを作成」を押してください。';setTimeout(function(){var t=$('h-bt');if(t)t.focus();},300);}})();
})();
