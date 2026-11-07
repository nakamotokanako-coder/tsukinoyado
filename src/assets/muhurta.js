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
var WKP=['日曜日（太陽の日）','月曜日（月の日）','火曜日','水曜日（水星の日）','木曜日（木星の日）','金曜日（金星の日）','土曜日'];
var last=null;
function fmt(x){return x.y+'年'+x.m+'月'+x.d+'日（'+WK[x.wd]+'）';}
function run(e){if(e)e.preventDefault();var k=$('mp').value,R=P[k],mine=$('mn').value===''?null:+$('mn').value,months=+$('mr').value,out=[];
  if(mine!==null&&TK.loadNak()===null)TK.saveNak(mine);
  var n=new Date(Date.now()+9*H),ds=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate())-9*H,end=ds+months*30.5*D;
  for(var t=ds;t<end;t+=D){var x=day(t),pk=x.ti%15;
    if(R.nk.indexOf(x.nk)<0||R.wd.indexOf(x.wd)<0||GOODT.indexOf(pk)<0)continue;
    if(x.ti>=15&&pk>=12&&k!=='travel')continue; /* 欠けていく月の終わりは避ける */
    var r=mine===null?null:JY.tara(mine,x.nk);if(r!==null&&[0,2,4,6].indexOf(r)>=0)continue;
    var sc=(x.ti<15?2:1)+(r!==null&&[1,5,8].indexOf(r)>=0?2:0)+(x.nk===7&&x.wd===4?3:0)+(x.wd===4||x.wd===5||x.wd===1?1:0);
    out.push({x:x,r:r,sc:sc});}
  var best=out.slice().sort(function(a,b){return b.sc-a.sc;}).slice(0,3).map(function(o){return o.x.ds;});
  var d0=day(ds),d1=day(end-D);last={k:k,R:R};$('mres').classList.remove('stale');
  var cond='<dl class="mcond"><div><dt>目的</dt><dd>'+R.n+'</dd></div><div><dt>対象期間</dt><dd>'+fmt(d0)+'〜'+fmt(d1)+'（'+months+'か月）</dd></div><div><dt>本人の星宿</dt><dd>'+(mine===null?'考慮していません':JY.NK[mine]+'を考慮（合わない巡りの日を除外）')+'</dd></div><div><dt>判定の基準</dt><dd>東京の日の出の時点の、月の星宿・ティティ（月齢日）・曜日</dd></div></dl>';
  $('mres').innerHTML='<div class="mhead"><span class="eyebrow">検索条件</span>'+cond+'<p class="mcount"><b>'+out.length+'日</b>の候補が見つかりました</p><p class="mstale" id="mstale" hidden>条件が変更されています。下の結果は<b>変更前の条件</b>によるものです。「吉日を探す」で更新してください。</p></div>'+
   (out.length?'<div class="mtools"><button type="button" class="ghost" id="mcopy" disabled>選んだ日をまとめてコピー</button><span class="note" id="mmsg" aria-live="polite">候補の □ にチェックを入れると、まとめてコピーできます。</span></div><ol class="mlist2">'+out.map(function(o,ix){var x=o.x,top=best.indexOf(x.ds)>=0,pk=x.ti%15;
     var why=['「'+R.n+'」に伝統的に選ばれる星宿（'+JY.NK[x.nk]+'）の日','月齢日がよい日（'+(x.ti<15?'満ちていく月':'欠けていく月')+'の'+(pk+1)+'日目）','曜日：'+WKP[x.wd]];
     if(x.nk===7&&x.wd===4)why.unshift('グル・プシュヤ（木曜日と星宿プシュヤが重なる大吉日）');
     if(o.r!==null)why.push('あなたにとって「'+JY.TARA[o.r][0]+'」の日'+([1,5,8].indexOf(o.r)>=0?'（実り・達成・最良の縁の巡り）':''));
     var txt=fmt(x)+' '+R.n;
     return '<li class="mc'+(top?' top':'')+'"><label class="mck"><input type="checkbox" data-pick="'+ix+'" data-t="'+txt+'"><span class="sr-only">この日を選ぶ</span></label><div class="mc-b"><div class="mc-h"><b class="mc-d">'+x.m+'月'+x.d+'日<small>（'+WK[x.wd]+'）'+x.y+'年</small></b>'+(top?'<span class="pill g">特におすすめ</span>':'<span class="pill">候補</span>')+'</div>'+
       '<ul class="mc-why">'+why.map(function(w){return '<li>'+w+'</li>';}).join('')+'</ul>'+
       '<details class="mc-det"><summary>詳しい根拠</summary><p>月の星宿：<a href="/nakshatra/'+JY.NKSLUG[x.nk]+'/">'+JY.NK[x.nk]+'</a>／ティティ：第'+(x.ti+1)+'ティティ'+(TT[pk]?'（'+TT[pk]+'）':'')+'／東京の日の出 '+TK.jst(x.sr)+' 時点'+(o.r!==null?'／ターラ：'+(o.r+1)+'番目 '+JY.TARA[o.r][0]:'')+'</p></details>'+
       '<button type="button" class="ghost mc-cp" data-copy="'+txt+'">この日をコピー</button></div></li>';}).join('')+'</ol>':
     '<div class="card"><p style="margin:0"><b>この条件では、候補日が見つかりませんでした。</b></p><ul class="mc-why"><li>探す期間を長くする（6か月まで）</li>'+(mine!==null?'<li>「あなたの星宿」を「選ばない」にする（合わない巡りの日の除外がなくなります）</li>':'')+'<li>近い目的（例：開業と契約）で探してみる</li></ul></div>')+
   '<p class="note">'+R.note+'あわせて、曜日（月・水・木・金'+(k==='travel'?'・日':'')+'）、ティティ（月齢日）の吉日、欠けていく月の終わりを避ける、という伝統的な条件で選んでいます。</p>'+
   TK.shareHTML('インド占星術の吉日選びで、'+R.n+'によい日を調べました。 #ナヴァラトナ #インド占星術',location.origin+'/muhurta/');
  wire();}
function copy(t,msg){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){$('mmsg').textContent=msg;}).catch(function(){window.prompt('コピーしてください',t);});}
function wire(){var picks=[].slice.call(document.querySelectorAll('[data-pick]')),btn=$('mcopy');if(!btn)return;
  picks.forEach(function(c){c.addEventListener('change',function(){var n=picks.filter(function(p){return p.checked;}).length;btn.disabled=!n;btn.textContent=n?'選んだ'+n+'日をまとめてコピー':'選んだ日をまとめてコピー';});});
  btn.addEventListener('click',function(){var L=picks.filter(function(p){return p.checked;}).map(function(p){return '・'+p.dataset.t;});copy(last.R.n+'の候補日（インド占星術ナヴァラトナ）\n'+L.join('\n'),L.length+'日分をコピーしました。');});
  document.querySelectorAll('.mc-cp').forEach(function(b){b.addEventListener('click',function(){copy(b.dataset.copy,'「'+b.dataset.copy+'」をコピーしました。');});});}
TK.ready(function(){var s=$('mn'),mine=TK.loadNak(),o='<option value="">選ばない</option>';for(var i=0;i<27;i++)o+='<option value="'+i+'"'+(mine===i?' selected':'')+'>'+JY.NK[i]+'</option>';s.innerHTML=o;
  $('mp').innerHTML=Object.keys(P).map(function(k){return '<option value="'+k+'">'+P[k].n+'</option>';}).join('');
  $('mf').addEventListener('submit',function(e){run(e);$('mres').scrollIntoView({behavior:'smooth',block:'start'});});
  ['mp','mn','mr'].forEach(function(id){$(id).addEventListener('change',function(){var st=$('mstale');if(st){st.hidden=false;$('mres').classList.add('stale');}});});
  run();});
})();
