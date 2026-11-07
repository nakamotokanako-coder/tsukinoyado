/* 吉日カレンダー：日の出（東京）時点の月の星宿・ティティで、その日を見る */
(function(){var $=TK.$,LAT=35.69,LON=139.69,D=864e5,H=36e5;
var WK=['日','月','火','水','木','金','土'];
/* アムリタ・シッディ・ヨーガ：曜日と星宿の組み合わせ（日:ハスタ 月:ムリガシラー 火:アシュヴィニー 水:アヌラーダー 木:プシュヤ 金:レーヴァティー 土:ローヒニー） */
var AMRITA=[12,4,0,16,7,26,3];
var TAG={guru:['グル・プシュヤ','木曜日に月がプシュヤにある日。インドで一年でも指折りの吉日とされ、学びや買いもの、始めごとに最適です。','g'],
 ravi:['ラヴィ・プシュヤ','日曜日に月がプシュヤにある日。名誉や健康に関わる始めごとによい吉日です。','g'],
 amrita:['アムリタ・シッディ','曜日と星宿がよい組み合わせになる日。「甘露の成就」という名のとおり、物事がなめらかに進むとされます。','g'],
 ekadashi:['エーカーダシー','満ちていく月・欠けていく月の11日目。断食や祈り、心身を清めるのに向く日です。','s'],
 purnima:['満月（プールニマー）','月が満ちる日。祈りや感謝、物事の仕上げに向くとされます。','s'],
 amavasya:['新月（アマーヴァーシャー）','月が隠れる日。先祖を思い、静かに過ごす日。新しい始めごとは、新月の翌日からが伝統的です。','s'],
 sankranti:['サンクラーンティ','太陽が次の星座に移る日。季節の節目で、祈りや施しの日とされます。','s']};
var ROLE=['・','◎','△','◎','△','◎','△','◎','◎'],GOOD=[0,1,0,1,0,1,0,1,1],BAD=[0,0,1,0,1,0,1,0,0];
var cur=null,mine=TK.loadNak(),sel=null;
function jstParts(ms){var d=new Date(ms+9*H);return [d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate(),d.getUTCDay()];}
function hm(ms){var d=new Date(ms+9*H);return String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');}
function month(y,m){var n=new Date(Date.UTC(y,m+1,0)).getUTCDate(),days=[],cache=[];
  for(var d=1;d<=n;d++){var ds=Date.UTC(y,m,d)-9*H,sr=JY.sunrise(ds,LAT,LON)||ds+6*H,el=JY.elong(sr),ti=Math.floor(el/12),nk=JY.nak(JY.moonSid(sr)).i,wd=new Date(Date.UTC(y,m,d)).getUTCDay(),
    sun0=Math.floor(JY.sidOf('Sun',ds)/30),sun1=Math.floor(JY.sidOf('Sun',ds+D)/30),tags=[];
    if(nk===7&&wd===4)tags.push('guru');if(nk===7&&wd===0)tags.push('ravi');if(AMRITA[wd]===nk&&!(nk===7&&(wd===4)))tags.push('amrita');
    if(ti===10||ti===25)tags.push('ekadashi');if(ti===14)tags.push('purnima');if(ti===29)tags.push('amavasya');if(sun0!==sun1)tags.push('sankranti');
    days.push({d:d,wd:wd,ds:ds,sr:sr,ti:ti,nk:nk,tags:tags,sun:sun1});}
  /* 満月・新月の正確な時刻 */
  var ph=[],t=Astronomy.MakeTime(new Date(Date.UTC(y,m,1)-9*H)),end=Date.UTC(y,m+1,1)-9*H;
  [0,180].forEach(function(a){var s=t;for(var k=0;k<3;k++){var r=Astronomy.SearchMoonPhase(a,s,40);if(!r||r.date.getTime()>=end)break;ph.push({a:a,ms:r.date.getTime()});s=r.AddDays(1);}});
  return {y:y,m:m,days:days,phases:ph.sort(function(a,b){return a.ms-b.ms;})};}
function cell(x){var r=mine===null?null:JY.tara(mine,x.nk),cls='cd'+(x.tags.some(function(t){return TAG[t][2]==='g';})?' lucky':'')+(r!==null&&GOOD[r]?' pg':'')+(r!==null&&BAD[r]?' pb':'')+(sel===x.d?' on':'')+(isToday(x)?' today':'');
  var moon=x.tags.indexOf('purnima')>=0?'<i class="mo f" title="満月"></i>':x.tags.indexOf('amavasya')>=0?'<i class="mo n" title="新月"></i>':'';
  return '<button type="button" class="'+cls+'" data-d="'+x.d+'"><span class="dn">'+x.d+moon+'</span><span class="nk">'+JY.NK[x.nk].replace('・','').slice(0,4)+'</span>'+(r!==null?'<span class="rl">'+ROLE[r]+'</span>':'')+(x.tags.length?'<span class="dots">'+x.tags.map(function(t){return '<i class="'+TAG[t][2]+'"></i>';}).join('')+'</span>':'')+'</button>';}
function isToday(x){var p=jstParts(Date.now());return p[0]===cur.y&&p[1]===cur.m&&p[2]===x.d;}
function detail(x){var r=mine===null?null:JY.tara(mine,x.nk),T=r===null?null:TK.TARA_T[r];
  return '<div class="card"><span class="eyebrow">'+(cur.m+1)+'月'+x.d+'日（'+WK[x.wd]+'）</span><h3>月の星宿：<a href="/nakshatra/'+JY.NKSLUG[x.nk]+'/">'+JY.NK[x.nk]+'</a></h3><p class="note" style="margin:0">ティティ '+(x.ti+1)+'日目（'+(x.ti<15?'満ちていく月':'欠けていく月')+'）・日の出 '+hm(x.sr)+'（東京）</p>'+
   (T?'<p style="margin:8px 0 0"><span class="pill '+(GOOD[r]?'g':BAD[r]?'b':'')+'">'+JY.TARA[r][0]+'</span> <b>'+T.tag+'</b>　'+T.all+'</p>':'<p class="note">下で「あなたの星宿」を選ぶと、あなたにとっての運勢も出ます。</p>')+
   x.tags.map(function(t){return '<p style="margin:8px 0 0"><span class="pill '+TAG[t][2]+'">'+TAG[t][0]+'</span> '+TAG[t][1]+'</p>';}).join('')+'</div>';}
function draw(){var M=cur,first=M.days[0].wd,h='<div class="cal">'+WK.map(function(w,i){return '<span class="wh'+(i===0?' su':i===6?' sa':'')+'">'+w+'</span>';}).join('');
  for(var i=0;i<first;i++)h+='<span></span>';M.days.forEach(function(x){h+=cell(x);});$('cal').innerHTML=h+'</div>';
  $('mtitle').textContent=M.y+'年'+(M.m+1)+'月';
  $('cal').querySelectorAll('[data-d]').forEach(function(b){b.addEventListener('click',function(){sel=+b.dataset.d;draw();});});
  var x=M.days.find(function(z){return z.d===sel;})||M.days.find(isToday)||null;$('det').innerHTML=x?detail(x):'<p class="note">日付を押すと、その日のくわしい内容が出ます。</p>';
  /* 今月の吉日リスト */
  var L=[];M.days.forEach(function(z){z.tags.forEach(function(t){L.push('<li><span class="num">'+(M.m+1)+'/'+z.d+'（'+WK[z.wd]+'）</span> <span class="pill '+TAG[t][2]+'">'+TAG[t][0]+'</span>'+(t==='sankranti'?' 太陽が'+JY.SIGNS[z.sun]+'へ':'')+'</li>');});});
  M.phases.forEach(function(p){L.push('<li><span class="num">'+(new Date(p.ms+9*H).getUTCMonth()+1)+'/'+new Date(p.ms+9*H).getUTCDate()+' '+hm(p.ms)+'</span> '+(p.a===180?'満月の瞬間':'新月の瞬間')+'</li>');});
  $('list').innerHTML='<ul class="clist">'+L.join('')+'</ul>';
  if(mine!==null){var g=M.days.filter(function(z){var r=JY.tara(mine,z.nk);return r===5||r===8||r===1;}).map(function(z){return (M.m+1)+'/'+z.d+'（'+JY.TARA[JY.tara(mine,z.nk)][0]+'）';}),
    b=M.days.filter(function(z){return JY.tara(mine,z.nk)===6;}).map(function(z){return (M.m+1)+'/'+z.d;});
    $('mylist').innerHTML='<div class="grid"><div class="card"><span class="eyebrow">'+JY.NK[mine]+'のあなたの好調日</span><b>'+g.join('　')+'</b><p class="note">サンパット（実り）・サーダナ（達成）・パラマ・ミトラ（最良の縁）の日。始めごとや大切な約束に。</p></div><div class="card"><span class="eyebrow">休息を大切にしたい日</span><b>'+(b.join('　')||'今月はありません')+'</b><p class="note">ナイダナ（破壊）の日。大きな決断は別の日に。</p></div></div>';}
  else $('mylist').innerHTML='';
}
function go(y,m){if(m<0){y--;m=11;}if(m>11){y++;m=0;}sel=null;$('cal').innerHTML='<p class="note">計算中…</p>';setTimeout(function(){cur=month(y,m);draw();},10);}
TK.ready(function(){var p=jstParts(Date.now()),s=$('mynk');
  var o='<option value="">選ばない</option>';for(var i=0;i<27;i++)o+='<option value="'+i+'"'+(mine===i?' selected':'')+'>'+JY.NK[i]+'</option>';s.innerHTML=o;
  s.addEventListener('change',function(){mine=s.value===''?null:+s.value;if(mine!==null)TK.saveNak(mine);draw();});
  $('prev').addEventListener('click',function(){go(cur.y,cur.m-1);});$('next').addEventListener('click',function(){go(cur.y,cur.m+1);});
  var q=location.hash.match(/^#(\d{4})-(\d{1,2})$/);go(q?+q[1]:p[0],q?+q[2]-1:p[1]);
  $('shr').innerHTML=TK.shareHTML('インド占星術の吉日カレンダー。グル・プシュヤや満月の日がひと目でわかります。 #月の宿',location.origin+'/calendar/');});
})();
