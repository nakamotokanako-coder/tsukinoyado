(function(){var $=TK.$;
function phases(moonSign,from,to){/* 区間内の段階 */return [(moonSign+11)%12,moonSign,(moonSign+1)%12];}
function run(){var b=TK.readBirth('a-'),st=$('status');if(b.err){st.textContent=b.err;return false;}
  var ml=JY.moonSid(b.ms),ms=Math.floor(ml/30),now=Date.now(),per=JY.sadeSati(b.ms,ms,90),cur=null;
  per.forEach(function(p){if(p.start<=now&&(p.end===null||now<p.end))cur=p;});
  var Z=phases(ms),sat=Math.floor(JY.moonSid&&0||0);
  var sNow=null;try{sNow=Math.floor(((Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Saturn,Astronomy.MakeTime(new Date()),true)).elon-(23.856704+1.397238*((Astronomy.MakeTime(new Date()).tt)/36525)))%360+360)%360/30);}catch(e){}
  var ph=cur&&sNow!==null?(sNow===Z[0]?'第1段階（月の一つ手前の星座を土星が通過中）':sNow===Z[1]?'ピーク（月の星座そのものを土星が通過中）':'最終段階（月の次の星座を土星が通過中）'):'';
  var warn=b.unknown&&Math.floor(JY.moonSid(b.dayStart)/30)!==Math.floor(JY.moonSid(b.dayStart+864e5-6e4)/30)?'<p class="warn">生まれた日に月の星座が切り替わっています。時刻がわかると確定できます。</p>':'';
  $('res').innerHTML='<div class="card now"><span class="eyebrow">あなたの月の星座</span><span class="big">'+JY.SIGNS[ms]+'</span><h3>'+(cur?'いまはサディサティの時期です':'いまはサディサティの時期ではありません')+'</h3>'+(ph?'<p style="margin:0">'+ph+'</p>':'')+'<p class="note">対象になる星座：'+JY.SIGNS[Z[0]]+'・'+JY.SIGNS[Z[1]]+'・'+JY.SIGNS[Z[2]]+'</p>'+warn+'</div>'+
   '<div class="card"><h3>生涯のサディサティ</h3><ul style="margin:0;padding-left:1.2em">'+per.map(function(p){var live=p===cur,past=p.end!==null&&p.end<=now;return '<li><span class="num">'+(p.fromStart?'誕生時':TK.ymd(p.start))+' 〜 '+(p.end?TK.ymd(p.end):'')+'</span> '+(live?'<span class="pill b">いまこの時期</span>':past?'<span class="pill r">終了</span>':'<span class="pill own">これから</span>')+'</li>';}).join('')+'</ul><p class="note">土星の逆行で短く行き来する期間は、一続きの時期としてまとめています。</p></div>';
  $('res').insertAdjacentHTML('beforeend',TK.shareHTML('土星の7年半「サディサティ」の時期を調べました。 #ナヴァラトナ #インド占星術',location.origin+'/sadesati/'));
  st.textContent='結果を表示しています';return true;}
function nowList(){try{var t=Astronomy.MakeTime(new Date()),s=Math.floor(((Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Saturn,t,true)).elon-(23.856704+1.397238*(t.tt/36525)))%360+360)%360/30);
  var a=(s+1)%12,b=s,c=(s+11)%12;$('nowlist').innerHTML='<li><b>'+JY.SIGNS[a]+'</b>：第1段階</li><li><b>'+JY.SIGNS[b]+'</b>：ピーク</li><li><b>'+JY.SIGNS[c]+'</b>：最終段階</li>';$('satnow').textContent=JY.SIGNS[s];}catch(e){}}
TK.initPlace('a-');
$('f').addEventListener('submit',function(e){e.preventDefault();try{if(run())$('res').scrollIntoView({behavior:'smooth'});}catch(err){$('status').textContent='計算できませんでした。入力を確認してください。';}});
TK.ready(function(){nowList();try{run();$('status').textContent='サンプル表示中（1990年5月15日 10:30 東京生まれ）';}catch(e){}});
})();
