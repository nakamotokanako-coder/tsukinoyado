(function(){var $=TK.$;
var AKT={太陽:['誇りと自分らしさ','人を照らし、導くために生まれた魂。自分の軸を持ち、堂々と生きることが今世のテーマです。課題は、プライドと謙虚さのバランス。'],月:['心と共感','人の心を癒し、育むために生まれた魂。感じる力そのものが才能です。課題は、感情に振り回されず、自分の心も満たすこと。'],火星:['勇気と行動','守るべきもののために戦い、道を切り開く魂。行動することで運命が動きます。課題は、怒りと衝動の扱い方。'],水星:['知性と言葉','考え、工夫し、言葉と形にして人に届ける魂。学びと伝えることが今世のテーマです。課題は、迷いすぎないことと、言葉の誠実さ。'],木星:['知恵と導き','本当の知恵を探し、それを必要な人に手渡す魂。学び、教えることが今世のテーマです。課題は、教えを押しつけず、自分で確かめること。'],金星:['愛と美','人との関係を通して、愛と調和を学ぶ魂。美しいもの、心地よいものを生み出す力があります。課題は、尽くしすぎず、受け取ること。'],土星:['忍耐と責任','時間をかけて、本物を築く魂。遅咲きでも、積み上げたものは崩れません。課題は、重さを一人で抱え込まないこと。']};
var LGT=['開拓者。まっすぐで行動が早く、自分の道を自分で切り開きます。','安定と美。落ち着きと五感の豊かさで、確かなものを育てます。','知性と軽やかさ。言葉と好奇心で、人と情報をつなぎます。','守り育てる人。情が深く、家族や仲間を大切にします。','王の気質。誇り高く、自然と人の中心に立ちます。','分析と奉仕。細やかな気配りと実務力で、人を助けます。','調和と公正。美意識とバランス感覚で、人と人を結びます。','深さと変容。秘めた情熱と洞察力で、物事の本質に迫ります。','理想と自由。信念と冒険心を持ち、遠くを目指します。','忍耐と実現力。時間をかけて、着実に目標を形にします。','独創と博愛。型にはまらず、新しい視点で人の役に立ちます。','共感と霊性。優しさと直感で、人の痛みに寄り添います。'];
var VM={2:['D2 ホーラ','財・お金の蓄え方'],3:['D3 ドレッカーナ','兄弟姉妹・勇気・行動力'],4:['D4 チャトゥルタムシャ','家・土地・不動産'],7:['D7 サプタムシャ','子ども・子孫'],9:['D9 ナヴァムシャ','結婚・パートナー・人生の実り'],10:['D10 ダシャムシャ','仕事・天職・社会での役割'],12:['D12 ドワーダシャムシャ','両親'],16:['D16 ショーダシャムシャ','快適さ・幸福・乗り物'],20:['D20 ヴィムシャムシャ','信仰・精神修行'],24:['D24 チャトゥルヴィムシャムシャ','学問・教育'],27:['D27 バムシャ','総合的な強さと弱さ'],30:['D30 トリムシャムシャ','困難・弱点'],40:['D40 カヴェーダムシャ','母方から受け継ぐもの'],45:['D45 アクシャヴェーダムシャ','父方から受け継ぐもの・品性'],60:['D60 シャシュティアムシャ','過去世から持ってきたカルマ']};var VD=[2,3,4,7,9,10,12,16,20,24,27,30,40,45,60];
var ORDER=['太陽','月','火星','水星','木星','金星','土星','ラーフ','ケートゥ'],S=JY.SIGNS;
function dm(x){var m=Math.round(x*60);return Math.floor(m/60)+'°'+String(m%60).padStart(2,'0')+'′';}
function cells(r,D){var c={},a=JY.varga(r.asc,D);(c[a]=c[a]||[]).push('<span class="asc">Asc</span>');ORDER.forEach(function(k){var p=r.P[k],s=JY.varga(p.lon,D);(c[s]=c[s]||[]).push('<span title="'+k+'">'+p.ab+(p.retro?'<sup>R</sup>':'')+'</span>');});return {c:c,a:a};}
function pill(p){var m={高揚:'ex',自室:'own',減衰:'deb'},h='';if(p.dig)h+='<span class="pill '+m[p.dig]+'">'+p.dig+'</span> ';if(p.retro)h+='<span class="pill r">逆行</span>';return h;}
function render(){var b=TK.readBirth('a-'),st=$('status');if(b.err){st.textContent=b.err;return false;}
  var r=JY.compute(b.ms,b.lat,b.lon),moon=r.P['月'],ak=r.ak,nm=$('a-nm').value.trim(),who=nm?nm+'さん':'あなた';
  TK.saveNak(moon.nak.i);
  var mr=b.unknown?TK.moonNakRange(b):null;
  $('readings').innerHTML='<div class="card ak"><span class="eyebrow">魂の星（アートマカラカ）</span><span class="big">'+ak+'</span><h3>'+AKT[ak][0]+'</h3><p class="note" style="color:inherit">'+AKT[ak][1]+'</p></div>'+
   '<div class="card"><span class="eyebrow">心の星宿（月のナクシャトラ）</span><span class="big">'+moon.nak.name+'</span><h3>月は'+S[moon.sign]+'</h3><p class="note" style="color:inherit">'+(window.NKSUM||[])[moon.nak.i]||''+'</p><a href="/nakshatra/'+moon.nak.slug+'/">'+moon.nak.name+'のくわしい解説を読む</a>'+(mr?'<p class="warn">この日は月が「'+JY.NK[mr[0]]+'」から「'+JY.NK[mr[1]]+'」へ移る日です。時刻がわかると確定できます。</p>':'')+'</div>'+
   (b.unknown?'':'<div class="card"><span class="eyebrow">アセンダント（ラグナ）</span><span class="big">'+S[r.ascSign]+'</span><h3>生まれ持った性質</h3><p class="note" style="color:inherit">'+LGT[r.ascSign]+'</p></div>');
  var k1=cells(r,1);$('d1').innerHTML='<figcaption><b>D1 出生図</b><span>'+who+'／'+b.label+'</span></figcaption>'+TK.grid(k1.c,b.unknown?-1:k1.a,'ラーシ<br>出生図');
  var t='<thead><tr><th>星</th><th>星座</th><th>度数</th><th>ハウス</th><th>星宿・パダ</th><th>状態</th><th>カーラカ</th></tr></thead><tbody>';
  if(!b.unknown)t+='<tr><td><b>アセンダント</b></td><td>'+S[r.ascSign]+'</td><td class="num">'+dm(r.asc%30)+'</td><td class="num">1室</td><td>'+r.ascNak.name+' '+r.ascNak.pada+'</td><td></td><td></td></tr>';
  ORDER.forEach(function(k){var p=r.P[k];t+='<tr><td><b>'+k+'</b></td><td>'+S[p.sign]+'</td><td class="num">'+dm(p.deg)+'</td><td class="num">'+(b.unknown?'—':p.house+'室')+'</td><td>'+p.nak.name+' '+p.nak.pada+'</td><td>'+pill(p)+'</td><td class="num">'+(p.karaka||'')+'</td></tr>';});
  $('ptable').innerHTML=t+'</tbody>';
  var YG=window.YOGA||{},ys=JY.yogas(r).filter(function(y){return !(b.unknown&&y.lagna);}),grp={};
  ys.forEach(function(y){(grp[y.id]=grp[y.id]||[]).push(y.detail);});
  $('yogas').innerHTML=Object.keys(grp).length?Object.keys(grp).map(function(id){var Y=YG[id]||{name:id,cat:'',m:''};return '<div class="card'+(Y.cat==='五大偉人ヨーガ'?' ak':'')+'"><span class="eyebrow">'+Y.cat+'</span><b style="font-size:16px">'+Y.name+'</b><p class="note" style="color:inherit">'+grp[id].join('／')+'</p><p class="note">'+Y.m+'</p><a href="/yoga/#'+id+'" style="font-size:13px">くわしく見る</a></div>';}).join(''):'<p class="note">主なヨーガは見つかりませんでした。ヨーガがないことは、悪い意味ではありません。</p>';
  $('yoganote').innerHTML=b.unknown?'時刻がわからないため、アセンダントを使うヨーガ（五大偉人ヨーガ、ラージャ・ヨーガなど）は表示していません。':'ヨーガは成立していても、その星の強さや時期（ダシャー）によって表れ方が変わります。';
  var near='';if(!b.unknown){var e=null,l=null;for(var m=1;m<=10;m++){if(e===null&&JY.compute(b.ms-m*6e4,b.lat,b.lon).ascSign!==r.ascSign)e=m;if(l===null&&JY.compute(b.ms+m*6e4,b.lat,b.lon).ascSign!==r.ascSign)l=m;}
    if(e!==null||l!==null)near='<br><span class="warn">アセンダントが星座の境目近くにあります（出生時刻が'+(e!==null?e+'分早い':'')+(e!==null&&l!==null?'か、':'')+(l!==null?l+'分遅い':'')+'と変わります）。時刻の記録を確認してください。</span>';}
  $('ascnote').innerHTML='カーラカ：AK＝魂の星、AmK＝仕事、BK＝兄弟、MK＝母、PiK＝子ども、GK＝ライバル、DK＝配偶者。'+(b.unknown?'<br><span class="warn">時刻がわからないため、アセンダントとハウスは表示していません。月の位置は1日で約13度動くので、目安としてご覧ください。</span>':near);
  var now=Date.now(),ds=JY.dasha(b.ms,moon.lon).filter(function(x){return x.end>b.ms&&x.start<b.ms+85*365.25*864e5;}),cm=null,ca=null;
  ds.forEach(function(x){if(x.start<=now&&now<x.end){cm=x;x.subs.forEach(function(s){if(s.start<=now&&now<s.end)ca=s;});}});
  $('now').innerHTML=cm?'<span class="eyebrow">今の時期</span><span class="big" style="color:var(--ink)">'+cm.lord+'期 ／ '+ca.lord+'の小期</span><p class="note" style="color:inherit">'+cm.lord+'期（'+TK.ym(cm.start)+'〜'+TK.ym(cm.end)+'）：'+TK.DT[cm.lord]+'</p><p class="note" style="color:inherit">'+ca.lord+'の小期（'+TK.ym(ca.start)+'〜'+TK.ym(ca.end)+'）：'+TK.DT[ca.lord]+'</p><p class="note">テーマは一般的なものです。実際の出方は、その星がチャートのどこにあるかで変わります。</p>':'<p class="note">現在の時期は表示範囲外です。</p>';
  $('dasha').innerHTML=ds.map(function(x){var age=x.start<=b.ms?0:Math.floor((x.start-b.ms)/(365.25*864e5));return '<div class="row'+(x===cm?' cur':'')+'"><b>'+x.lord+'期</b><div><span class="d">'+(x.start<=b.ms?'誕生時':TK.ym(x.start))+' 〜 '+TK.ym(x.end)+'（'+age+'歳〜）</span><p>'+TK.DT[x.lord]+'</p></div></div>';}).join('');
  var ss=JY.sadeSati(b.ms,moon.sign,90);
  $('ss').innerHTML=ss.length?ss.map(function(p){var live=p.start<=now&&(p.end===null||now<p.end),past=p.end!==null&&p.end<=now;return '<li><span class="num">'+(p.fromStart?'誕生時':TK.ymd(p.start))+' 〜 '+(p.end?TK.ymd(p.end):'')+'</span> '+(live?'<span class="pill b">いまこの時期</span>':past?'<span class="pill r">終了</span>':'<span class="pill own">これから</span>')+'</li>';}).join(''):'<li>表示範囲内にはありません。</li>';
  function sens(D){if(b.unknown)return '';var a0=JY.varga(r.asc,D);for(var sec of [30,60,120,300,600]){var e=JY.varga(JY.compute(b.ms-sec*1000,b.lat,b.lon).asc,D),l=JY.varga(JY.compute(b.ms+sec*1000,b.lat,b.lon).asc,D);if(e!==a0||l!==a0)return sec<=60?'<span class="pill r">とても繊細</span>':sec<=300?'<span class="pill r">やや繊細</span>':'';}return '';}
  $('vargas').innerHTML=VD.map(function(D){var k=cells(r,D);return '<figure class="chart"><figcaption><b>'+VM[D][0]+'</b><span>'+VM[D][1]+'</span>'+sens(D)+'</figcaption>'+TK.grid(k.c,b.unknown?-1:k.a,VM[D][0].split(' ')[0])+'</figure>';}).join('');
  var dg=[];ORDER.slice(0,7).forEach(function(k){var p=r.P[k],v9=JY.dignity(k,JY.varga(p.lon,9));if(p.dig==='減衰'&&(v9==='自室'||v9==='高揚'))dg.push(k);});
  $('vnote').innerHTML=(dg.length?'<b>'+dg.join('・')+'</b>は、出生図では弱い位置（減衰）ですが、D9では力を取り戻しています。年齢とともに強さが表に出てくる星です。<br>':'')+'分割図は、記録された出生時刻どおりに計算しています。細かい分割図ほど、時刻がほんの少し違うだけでアセンダント（ハウス）が入れ替わる「繊細な図」です。「やや繊細」「とても繊細」の図は、ハウスより、どの星がどの星座にあるか（こちらは時刻が多少違っても変わりません）を中心に見るのがおすすめです。';
  st.textContent=who+'の星図を表示しています';return true;}
TK.initPlace('a-');
$('f').addEventListener('submit',function(e){e.preventDefault();try{if(render())$('result').scrollIntoView({behavior:'smooth'});}catch(err){$('status').textContent='計算できませんでした。入力を確認してください。';}});
TK.ready(function(){try{render();$('status').textContent='サンプル表示中（1990年5月15日 10:30 東京生まれ）';}catch(e){}});
})();
