/* 27星宿の円盤：A＝自分の星宿（数え始める基準）は固定。B＝調べる星宿だけを、回転・タップ・前後・選択欄で動かす */
(function(){var $=TK.$,NS='http://www.w3.org/2000/svg',R=200,C=220,W=360/27;
var GOOD=[0,1,0,1,0,1,0,1,1];function col(k){return k===0?'var(--accent)':GOOD[k]?'#3E9B6B':'#C9584A';}
var MEAN=['自分を整える巡り','実りと豊かさの巡り','つまずきに注意の巡り','穏やかな安らぎの巡り','無理をしない巡り','願いが形になる巡り','休息を大切にする巡り','人の縁に恵まれる巡り','最良の縁の巡り'];
var TXT=['自分と同じ星宿。心と体を整える巡り','実りと豊かさの巡り','つまずきやすい巡り','安らぎの巡り','障害にあいやすい巡り','願いが形になる巡り','休息を大切にする巡り','人の縁に恵まれる巡り','最良の縁の巡り'];
var st={base:null,trial:false,tg:0,tgMoon:true,moon:0,rot:0,planets:false};
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
function pt(deg,r){var a=(deg-90)*Math.PI/180;return [C+r*Math.cos(a),C+r*Math.sin(a)];}
function sector(i,r0,r1){var a0=i*W,a1=(i+1)*W,p0=pt(a0,r1),p1=pt(a1,r1),p2=pt(a1,r0),p3=pt(a0,r0);return 'M'+p0+' A'+r1+' '+r1+' 0 0 1 '+p1+' L'+p2+' A'+r0+' '+r0+' 0 0 0 '+p3+'Z';}
function short(n){return n.replace('プールヴァ・','前').replace('ウッタラ・','後');}
function moonNow(){return JY.nak(JY.moonSid(Date.now())).i;}
function tag(g,i,r,txt,cls){var a=(i+.5)*W,p=pt(a,r),t=el('text',{x:p[0],y:p[1],'class':cls,transform:'rotate('+a+' '+p[0]+' '+p[1]+')'});t.textContent=txt;g.appendChild(t);}
function build(){var svg=$('wheel');svg.innerHTML='';svg.setAttribute('viewBox','-30 -44 500 514');
  var g=el('g',{id:'wg'});svg.appendChild(g);var b=st.base;
  for(var i=0;i<27;i++){var tk=JY.tara(b,i);g.appendChild(el('path',{d:sector(i,112,R),'class':'ws','fill':col(tk),'data-i':i}));
    var m=pt((i+.5)*W,166);var t=el('text',{x:m[0],y:m[1],'class':'wt',transform:'rotate('+((i+.5)*W-90)+' '+m[0]+' '+m[1]+')'});t.textContent=short(JY.NK[i]).slice(0,6);g.appendChild(t);
    var n=pt((i+.5)*W,121),tn=el('text',{x:n[0],y:n[1],'class':'wn',transform:'rotate('+((i+.5)*W-90)+' '+n[0]+' '+n[1]+')'});tn.textContent=String(tk+1);g.appendChild(tn);}
  for(var k=0;k<12;k++){var a=k*30,p=pt(a,R),q=pt(a,R+18);g.appendChild(el('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],'class':'wl'}));var mm=pt(a+15,R+10),ts=el('text',{x:mm[0],y:mm[1],'class':'wz',transform:'rotate('+(a+15)+' '+mm[0]+' '+mm[1]+')'});ts.textContent=JY.SIGNS[k].replace('座','');g.appendChild(ts);}
  g.appendChild(el('circle',{cx:C,cy:C,r:R+18,'class':'wo'}));
  /* 選択枠（調べている星宿） */
  g.appendChild(el('path',{d:sector(st.tg,110,R+2),'class':'wsel'}));
  /* 自分の星宿の目印（★＋あなた） */
  if(b!==st.tg){var ba=(b+.5)*W,bp=pt(ba,R+30);g.appendChild(el('path',{d:star(bp[0],bp[1],8),'class':'wmk-me'}));tag(g,b,R+45,st.trial?'お試し':'あなた','wml');}
  /* 今日の月（☾＋今日の月） */
  var ml=JY.moonSid(Date.now()),mp=pt(ml,100);g.appendChild(el('circle',{cx:mp[0],cy:mp[1],r:10,'class':'wp moon'}));var mt=el('text',{x:mp[0],y:mp[1]+4,'class':'wpt'});mt.textContent='☾';g.appendChild(mt);
  if(st.moon!==st.tg){var mb=st.moon===b&&b!==st.tg;var cp=pt((st.moon+.5)*W,mb?R+48:R+30),c0=el('text',{x:cp[0],y:cp[1]+5,'class':'wmk-moon',transform:'rotate('+((st.moon+.5)*W)+' '+cp[0]+' '+cp[1]+')'});c0.textContent='☾';g.appendChild(c0);tag(g,st.moon,mb?R+60:R+45,'今日の月','wml moon');}
  /* 惑星（切り替え） */
  if(st.planets){var now=Date.now();[['太陽','Sun','日'],['火星','Mars','火'],['水星','Mercury','水'],['木星','Jupiter','木'],['金星','Venus','金'],['土星','Saturn','土']].forEach(function(x,j){var p=pt(JY.sidOf(x[1],now),86-(j%3)*14);g.appendChild(el('circle',{cx:p[0],cy:p[1],r:7,'class':'wp'}));var t=el('text',{x:p[0],y:p[1]+3.5,'class':'wpt'});t.textContent=x[2];g.appendChild(t);});
    var rl=JY.rahuSid(now);[[rl,'ラ'],[(rl+180)%360,'ケ']].forEach(function(x){var p=pt(x[0],50);g.appendChild(el('circle',{cx:p[0],cy:p[1],r:7,'class':'wp'}));var t=el('text',{x:p[0],y:p[1]+3.5,'class':'wpt'});t.textContent=x[1];g.appendChild(t);});}
  /* 中央と上部ポインター（回らない） */
  var nm=JY.NK[b],ctr=el('text',{x:C,y:C-6,'class':'wc',style:'font-size:'+(nm.length>8?11:nm.length>5?13:16)+'px'});ctr.textContent=nm;svg.appendChild(ctr);
  var c2=el('text',{x:C,y:C+14,'class':'wc2'});c2.textContent=st.trial?'お試し表示の基準':'あなたの星宿から数える';svg.appendChild(c2);
  svg.appendChild(el('path',{d:'M'+(C-10)+' -14 L'+(C+10)+' -14 L'+C+' 2Z','class':'wm'}));
  var pl=el('text',{x:C,y:-24,'class':'wptr'});pl.textContent='調べている星宿'+(st.tg===st.moon&&st.tg===b?'（今日の月・あなた）':st.tg===st.moon?'（今日の月）':st.tg===b?'（'+(st.trial?'お試しの基準':'あなたの星宿')+'）':'');svg.appendChild(pl);
  setRot(-(st.tg+.5)*W,false);}
function star(x,y,r){var s='';for(var k=0;k<10;k++){var rr=k%2?r*.45:r,a=(k*36-90)*Math.PI/180;s+=(k?'L':'M')+(x+rr*Math.cos(a)).toFixed(1)+' '+(y+rr*Math.sin(a)).toFixed(1);}return s+'Z';}
function setRot(d,anim){st.rot=d;var g=$('wg');if(!g)return;g.style.transition=anim?'transform .5s cubic-bezier(.3,.8,.3,1)':'none';g.style.transform='rotate('+d+'deg)';g.style.transformOrigin=C+'px '+C+'px';}
function info(){var b=st.base,i=st.tg,tk=JY.tara(b,i),isMoon=i===st.moon;
  var head=isMoon?(st.trial?'お試し：'+JY.NK[b]+'の人の、今日の巡り':'あなたの今日の巡り'):JY.NK[b]+'から見た、'+JY.NK[i];
  $('winfo').innerHTML='<div class="wr"><span class="eyebrow">'+head+'</span><p class="wr-path"><b>'+JY.NK[b]+'</b><span>→</span><b>'+JY.NK[i]+'</b>'+(isMoon?'<span class="pill now">今日の月</span>':'')+'</p>'+
   '<h2 class="wr-m" style="color:'+col(tk)+'">'+MEAN[tk]+'</h2><p class="wr-n">'+(tk+1)+'番目・'+JY.TARA[tk][0]+'（'+JY.TARA[tk][1]+'）</p>'+
   '<p>'+TXT[tk]+'です。'+(isMoon?'今日の月は'+JY.NK[i]+'にあるので、'+JY.NK[b]+'の人にとって今日はこの巡りの日です。':'これは今日の運勢ではありません。月が'+JY.NK[i]+'にある日が、'+JY.NK[b]+'の人にとってこの巡りの日になります。')+'</p>'+
   (st.trial?'<p class="warn">お試し表示です。自分の星宿を選ぶと、あなたの巡りになります。</p>':'')+
   '<p class="note"><a href="/nakshatra/'+JY.NKSLUG[i]+'/">'+JY.NK[i]+'の解説 →</a>　<a href="/today/">今日の運勢と時間帯</a></p></div>';
  $('wtg').value=st.tg;$('wme').value=st.trial?'':st.base;
  document.querySelectorAll('#wg .ws').forEach(function(z){z.setAttribute('aria-current',+z.dataset.i===i?'true':'false');});}
function setTarget(i,anim,fromMoon){st.tg=(i+27)%27;st.tgMoon=!!fromMoon||st.tg===st.moon&&fromMoon!==false;build();if(anim){setRot(st.rot-0,false);}info();}
function snapTo(i){var cur=st.rot,target=-(i+.5)*W;var diff=((target-cur)%360+540)%360-180;setRot(cur+diff,true);setTimeout(function(){st.tg=i;st.tgMoon=(i===st.moon);build();info();},520);}
function ang(ev){var r=$('wheel').getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*500-30-C,y=(ev.clientY-r.top)/r.height*514-44-C;return Math.atan2(y,x)*180/Math.PI;}
TK.ready(function(){var o='';for(var i=0;i<27;i++)o+='<option value="'+i+'">'+JY.NK[i]+'</option>';
  $('wme').innerHTML='<option value="">選んでください</option>'+o;$('wtg').innerHTML=o;
  st.moon=moonNow();var saved=TK.loadNak();if(saved===null){st.base=st.moon;st.trial=true;}else st.base=saved;st.tg=st.moon;st.tgMoon=true;
  $('wnote').hidden=!st.trial;
  $('wme').addEventListener('change',function(){var v=$('wme').value;if(v==='')return;st.base=+v;st.trial=false;TK.saveNak(st.base);$('wnote').hidden=true;build();info();});
  $('wtg').addEventListener('change',function(){st.tg=+$('wtg').value;st.tgMoon=st.tg===st.moon;build();info();});
  $('wprev').addEventListener('click',function(){snapTo((st.tg+26)%27);});$('wnext').addEventListener('click',function(){snapTo((st.tg+1)%27);});
  $('wtoday').addEventListener('click',function(){st.moon=moonNow();snapTo(st.moon);});
  $('wpl').addEventListener('change',function(){st.planets=$('wpl').checked;$('wpleg').hidden=!st.planets;build();info();});
  var svg=$('wheel'),drag=null;
  svg.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();snapTo((st.tg+1)%27);}else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();snapTo((st.tg+26)%27);}});
  svg.addEventListener('pointerdown',function(ev){drag={a:ang(ev),r:st.rot,x:ev.clientX,y:ev.clientY,moved:false,id:ev.pointerId};});
  svg.addEventListener('pointermove',function(ev){if(!drag)return;if(!drag.moved&&Math.hypot(ev.clientX-drag.x,ev.clientY-drag.y)>8){drag.moved=true;try{svg.setPointerCapture(drag.id);}catch(e){}}if(drag.moved){var d=ang(ev)-drag.a;setRot(drag.r+d,false);}});
  function end(ev){if(!drag)return;var dd=drag;drag=null;if(!dd.moved){var t=document.elementFromPoint(ev.clientX,ev.clientY);if(t&&t.dataset&&t.dataset.i!==undefined)snapTo(+t.dataset.i);return;}
    var top=Math.round(((-st.rot/W-.5)%27+27)%27)%27;snapTo(top);}
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',function(){drag=null;snapTo(st.tg);});
  build();info();
  setInterval(function(){var m=moonNow();if(m!==st.moon){var follow=st.tgMoon;st.moon=m;if(follow)st.tg=m;if(st.trial)st.base=m;build();info();}},60e3);
  $('shr').innerHTML=TK.shareHTML('27星宿の円盤で、今日の星の巡り（ターラ）を見てみました。 #ナヴァラトナ #インド占星術',location.origin+'/wheel/');});
})();
