/* 星の強さ（アシュタカヴァルガ）とマンガル・ドーシャ */
var CX=(function(){
var HT=['自分・からだ','お金・家族','努力・発信','家・心','才能・恋愛・子ども','仕事の日常・健康','パートナー','変化・深いつながり','幸運・学び','仕事・社会','収入・願い','手放し・精神性'];
var PK={太陽:'自信、リーダーシップ、社会的な立場',月:'心の安定、人望、共感力',火星:'行動力、勇気、勝負強さ',水星:'知性、言葉、商才',木星:'知恵、幸運、人を導く力',金星:'愛、美しさ、豊かさ',土星:'忍耐、組織力、長く続く実績'};
var SEV=['太陽','月','火星','水星','木星','金星','土星'];
function ico(k){return window.SR&&SR.BY[k]?'<img class="sb-ic" src="'+SR.img(SR.BY[k].id,true)+'" alt="" width="28" height="28">':'';}
function lvl(v){return v>=6?['とても強い','g']:v>=5?['強い','g']:v>=4?['ふつう','']:v>=3?['やや弱い','b']:['弱い','b'];}
function strength(r,b){if(b.unknown)return '<div class="card"><p class="note" style="margin:0">時刻がわからないため、星の強さ（シャドバラ・アシュタカヴァルガ）は計算していません。生まれた時刻が必要な計算です。</p></div>';
  var A=JY.ashtakavarga(r),pts=SEV.map(function(k){return {k:k,v:A.bav[k][r.P[k].sign]};}),mx=Math.max.apply(null,pts.map(function(x){return x.v;})),best=pts.filter(function(x){return x.v===mx;});
  var SB=JY.shadbala(r,b.ms,b.lat,b.lon),sr=SEV.map(function(k){return {k:k,x:SB[k]};}).sort(function(a,c){return c.x.ratio-a.x.ratio;}),top=sr[0],mxr=Math.max(1.8,top.x.ratio);
  var h=window.SR?SR.card(top.k,{label:'いちばん強い星（シャドバラ）：'+top.k,text:PK[top.k]+'が、あなたのいちばん頼れる力です。この星が働く分野や、この星の時期（ダシャー）に、実力を出しやすくなります。'}):'<div class="card now"><span class="eyebrow">いちばん強い星（シャドバラ）</span><span class="big">'+top.k+'</span><p style="margin:0">'+PK[top.k]+'が、あなたのいちばん頼れる力です。</p></div>';
  h+='<div class="card"><h3>シャドバラ（6種類の強さの合計）</h3><div class="bars">'+sr.map(function(o){var q=o.x.ratio,c=q>=1.3?'g':q>=1?'':'b';return '<div class="sbar"><b>'+ico(o.k)+o.k+'</b><span class="track"><i style="width:'+Math.min(100,q/mxr*100)+'%" class="'+c+'"></i></span><span class="num">'+o.x.rupa.toFixed(1)+'</span><span class="pill '+c+'">'+(q>=1.3?'とても強い':q>=1?'十分':'足りない')+'</span></div>';}).join('')+'</div>'+
   '<p class="note">数字はルーパ（強さの単位）。パラーシャラが星ごとに決めた必要量（太陽5、月6、火星5、水星7、木星6.5、金星5.5、土星5）を超えていれば「十分」、1.3倍以上で「とても強い」としています。位置・方角・時間・動き・生まれつき・ほかの星からの視線、の6つを合計したものです。</p>'+
   '<details><summary class="note">6種類の内訳を見る</summary><div class="tbl"><table style="min-width:0"><thead><tr><th></th><th>位置</th><th>方角</th><th>時間</th><th>動き</th><th>生来</th><th>視線</th></tr></thead><tbody>'+sr.map(function(o){var c=o.x.c;return '<tr><td><b>'+o.k+'</b></td>'+[c.sthana,c.dig,c.kala,c.chesta,c.nais,c.drik].map(function(v){return '<td class="num">'+(v/60).toFixed(2)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div><p class="note">東京の日の出・日の入りで時間の強さを計算しています。星どうしの戦い（グラハ・ユッダ）は省いた簡易版で、専門ソフトと少し違う値になることがあります。</p></details></div>';
  h+='<div class="card"><h3>アシュタカヴァルガで見る星の強さ</h3><div class="bars">'+pts.map(function(x){var L=lvl(x.v);return '<div class="sbar"><b>'+ico(x.k)+x.k+'</b><span class="track"><i style="width:'+(x.v/8*100)+'%" class="'+L[1]+'"></i></span><span class="num">'+x.v+'</span><span class="pill '+L[1]+'">'+L[0]+'</span></div>';}).join('')+'</div><p class="note">それぞれの星が、いる星座で受けている「応援の点（ビンドゥ）」です。8点満点で、4点がふつう、5点以上で強く働くとされます。星座の高揚・減衰やヨーガとは別のものさしなので、たとえば高揚している星でも点が低いことがあります。その場合は「力はあるが、周りの応援を得るのに時間がかかる星」と読みます。</p></div>';
  var hs=A.sav.map(function(v,i){var house=(i-r.ascSign+12)%12+1;return {h:house,v:v,s:i};}).sort(function(a,b){return a.h-b.h;}),
      strong=hs.filter(function(x){return x.v>=30;}).sort(function(a,b){return b.v-a.v;}),weak=hs.filter(function(x){return x.v<=24;}).sort(function(a,b){return a.v-b.v;});
  h+='<div class="card"><h3>人生の分野ごとの力（サルヴァ・アシュタカヴァルガ）</h3><div class="tbl"><table style="min-width:0"><thead><tr><th>ハウス</th><th>分野</th><th>点</th><th></th></tr></thead><tbody>'+hs.map(function(x){var c=x.v>=30?'g':x.v<=24?'b':'';return '<tr><td class="num">'+x.h+'室</td><td>'+HT[x.h-1]+'</td><td class="num">'+x.v+'</td><td><span class="track sm"><i style="width:'+Math.min(100,x.v/40*100)+'%" class="'+c+'"></i></span></td></tr>';}).join('')+'</tbody></table></div>'+
   (strong.length?'<p style="margin:6px 0 0"><span class="pill g">追い風の分野</span> '+strong.map(function(x){return HT[x.h-1]+'（'+x.v+'点）';}).join('、')+'</p>':'')+
   (weak.length?'<p style="margin:6px 0 0"><span class="pill b">ていねいに育てる分野</span> '+weak.map(function(x){return HT[x.h-1]+'（'+x.v+'点）';}).join('、')+'</p>':'')+
   '<p class="note">12のハウスが受けている点の合計（全体で337点、平均は約28点）。30点以上の分野は自然に実りやすく、25点未満の分野は時間をかけて育てるとよいとされます。星がその星座を通る時期の吉凶を見るのにも使います。</p></div>';
  return h;}
var MT=['マンガル・ドーシャはありません。','マンガル・ドーシャがありますが、軽めです。','マンガル・ドーシャがあります。','マンガル・ドーシャがはっきり出ています。'];
function mangalText(m){if(!m.has)return MT[0];return (m.cancel?'マンガル・ドーシャがありますが、'+m.cancel+'。':MT[Math.min(3,m.level)])+'（'+m.from.map(function(x){return x.from+'から'+x.house+'番目';}).join('、')+'に火星）';}
function mangal(r,b){var m=JY.mangal(r,!b.unknown);
  return '<div class="card"><span class="eyebrow">マンガル・ドーシャ（火星の配置）</span><h3>'+(m.has?(m.cancel?'あり（穏やかに働く）':m.level>=2?'あり':'あり（軽め）'):'なし')+'</h3><p class="note" style="color:inherit">'+mangalText(m)+'</p>'+
   '<p class="note">インドで結婚の相性を見るとき、必ず確かめる配置です。火星がアセンダント・月・金星から1・2・4・7・8・12番目にあると成り立ち、多くの人が持つよくある配置です。火星の情熱や勢いが、パートナーとの関係で強く出やすいことを表します。二人とも持っていれば釣り合って問題ないとするのが、いまのインドで一般的な見方です。'+(b.unknown?'時刻がわからないため、月と金星からだけ見ています。':'')+'<a href="/aisho/">相性占いで二人分を見る</a></p></div>';}
return {strength:strength,mangal:mangal,mangalText:mangalText};
})();
