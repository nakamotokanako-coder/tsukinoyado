/* 吉日選び（ムフールタ・簡易版）：日の出（東京）時点の星宿・ティティ・曜日で判定 */
(function(){var $=TK.$,H=36e5,D=864e5,WK=['日','月','火','水','木','金','土'];
var P={
 marriage:{n:'入籍・結婚式',nk:[3,4,9,11,12,14,16,18,20,25,26],wd:[1,3,4,5],note:'インドの結婚のムフールタで伝統的に選ばれる星宿（ローヒニー、マガー、ハスタ、アヌラーダー、レーヴァティーなど）の日。'},
 move:{n:'引っ越し・新居に入る',nk:[3,4,11,13,16,20,22,23,25,26],wd:[1,3,4,5],note:'家に入る儀式（グリハ・プラヴェーシャ）で選ばれる、安定の星宿の日。'},
 business:{n:'開業・契約・新しい仕事',nk:[0,3,7,11,12,13,16,20,21,25,26],wd:[1,3,4,5],note:'商いの始まりによいとされる星宿（アシュヴィニー、プシュヤ、ハスタ、シュラヴァナなど）の日。'},
 travel:{n:'旅行・出発',nk:[0,4,6,7,12,16,21,22,26],wd:[1,3,4,5,0],note:'旅立ちによいとされる、動きのある星宿の日。'},
 buy:{n:'大きな買いもの（車・宝飾・家電）',nk:[0,3,7,12,13,14,16,21,22,26],wd:[1,3,4,5],note:'ものを手に入れるのによいとされる星宿の日。'},
 study:{n:'習いごと・勉強を始める',nk:[0,4,6,7,12,13,14,21,22,26],wd:[1,3,4,5],note:'学びの始まり（ヴィディヤーランバ）によいとされる星宿の日。'}};
var GOODT=[1,2,4,6,9,10,11,12],TT=['','ドゥヴィティーヤー','トリティーヤー','','パンチャミー','','サプタミー','','','ダシャミー','エーカーダシー','ドゥヴァーダシー','トラヨーダシー'];

function day(ds){var sr=JY.sunrise(ds,35.69,139.69)||ds+6*H,ti=Math.floor(JY.elong(sr)/12),nk=JY.nak(JY.moonSid(sr)).i,d=new Date(ds+9*H),wd=d.getUTCDay();return {ds:ds,sr:sr,ti:ti,nk:nk,wd:wd,m:d.getUTCMonth()+1,d:d.getUTCDate(),y:d.getUTCFullYear()};}
function run(e){if(e)e.preventDefault();var k=$('mp').value,R=P[k],mine=$('mn').value===''?null:+$('mn').value,months=+$('mr').value,out=[];
  if(mine!==null)TK.saveNak(mine);
  var n=new Date(Date.now()+9*H),ds=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate())-9*H,end=ds+months*30.5*D;
  for(var t=ds;t<end;t+=D){var x=day(t),pk=x.ti%15;
    if(R.nk.indexOf(x.nk)<0||R.wd.indexOf(x.wd)<0||GOODT.indexOf(pk)<0)continue;
    if(x.ti>=15&&pk>=12&&k!=='travel')continue; /* 欠けていく月の終わりは避ける */
    var r=mine===null?null:JY.tara(mine,x.nk);if(r!==null&&[0,2,4,6].indexOf(r)>=0)continue;
    var sc=(x.ti<15?2:1)+(r!==null&&[1,5,8].indexOf(r)>=0?2:0)+(x.nk===7&&x.wd===4?3:0)+(x.wd===4||x.wd===5||x.wd===1?1:0);
    out.push({x:x,r:r,sc:sc});}
  var best=out.slice().sort(function(a,b){return b.sc-a.sc;}).slice(0,3).map(function(o){return o.x.ds;});
  $('mres').innerHTML='<div class="card now"><span class="eyebrow">'+R.n+'によい日</span><span class="big">'+out.length+'日</span><p style="margin:0">これから'+months+'か月のうち、条件がそろう日です。'+(mine===null?'あなたの星宿を選ぶと、あなたにとって相性の悪い日を除き、特によい日に印がつきます。':'')+'</p></div>'+
   (out.length?'<div class="mlist">'+out.map(function(o){var x=o.x,top=best.indexOf(x.ds)>=0;return '<div class="mrow'+(top?' top':'')+'"><b class="num">'+x.y+'/'+x.m+'/'+x.d+'（'+WK[x.wd]+'）</b>'+(top?'<span class="pill g">特におすすめ</span>':'')+
     '<span>月の星宿：<a href="/nakshatra/'+JY.NKSLUG[x.nk]+'/">'+JY.NK[x.nk]+'</a>・'+(x.ti<15?'満ちていく月':'欠けていく月')+'の'+(x.ti%15+1)+'日目'+(x.nk===7&&x.wd===4?'・<b>グル・プシュヤ</b>':'')+(o.r!==null?'・あなたにとって「'+JY.TARA[o.r][0]+'」':'')+'</span></div>';}).join('')+'</div>':'<p class="note">この期間には、条件がそろう日がありませんでした。期間を延ばしてみてください。</p>')+
   '<p class="note">'+R.note+'あわせて、曜日（月・水・木・金'+(k==='travel'?'・日':'')+'）、ティティ（月齢日）の吉日、欠けていく月の終わりを避ける、という伝統的な条件で選んでいます。日の判定は日の出（東京）の時点です。</p>'+
   TK.shareHTML('インド占星術の吉日選びで、'+R.n+'によい日を調べました。 #月の宿 #インド占星術',location.origin+'/muhurta/');}
TK.ready(function(){var s=$('mn'),mine=TK.loadNak(),o='<option value="">選ばない</option>';for(var i=0;i<27;i++)o+='<option value="'+i+'"'+(mine===i?' selected':'')+'>'+JY.NK[i]+'</option>';s.innerHTML=o;
  $('mp').innerHTML=Object.keys(P).map(function(k){return '<option value="'+k+'">'+P[k].n+'</option>';}).join('');
  $('mf').addEventListener('submit',run);run();});
})();
