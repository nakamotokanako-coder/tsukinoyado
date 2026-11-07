/* 27星宿の円盤：基準の星宿を上に回し、ほかの星宿との関係を色で見る */
(function(){var $=TK.$,NS='http://www.w3.org/2000/svg',R=200,C=220,W=360/27;
var GOOD=[0,1,0,1,0,1,0,1,1];function col(k){return k===0?'var(--accent)':GOOD[k]?'#3E9B6B':'#C9584A';}
var TXT=['自分と同じ星宿。心と体を整える巡り','実りと豊かさの巡り','つまずきやすい巡り','安らぎの巡り','障害にあいやすい巡り','願いが形になる巡り','休息を大切にする巡り','人の縁に恵まれる巡り','最良の縁の巡り'];
var base=TK.loadNak();if(base===null)base=0;var rot=0,pick=null,drag=null;
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e;}
function pt(deg,r){var a=(deg-90)*Math.PI/180;return [C+r*Math.cos(a),C+r*Math.sin(a)];}
function sector(i,r0,r1){var a0=i*W,a1=(i+1)*W,p0=pt(a0,r1),p1=pt(a1,r1),p2=pt(a1,r0),p3=pt(a0,r0);
  return 'M'+p0+' A'+r1+' '+r1+' 0 0 1 '+p1+' L'+p2+' A'+r0+' '+r0+' 0 0 0 '+p3+'Z';}
function build(){var svg=$('wheel');svg.innerHTML='';svg.setAttribute('viewBox','0 0 440 440');
  var g=el('g',{id:'wg'});svg.appendChild(g);
  for(var i=0;i<27;i++){var tk=JY.tara(base,i),s=el('path',{d:sector(i,112,R),'class':'ws'+(pick===i?' on':''),fill:col(tk),'data-i':i});g.appendChild(s);
    var m=pt((i+.5)*W,166),t=el('text',{x:m[0],y:m[1],'class':'wt',transform:'rotate('+((i+.5)*W-90)+' '+m[0]+' '+m[1]+')'});t.textContent=JY.NK[i].replace('プールヴァ・','前').replace('ウッタラ・','後').slice(0,6);g.appendChild(t);
    var n=pt((i+.5)*W,119),tn=el('text',{x:n[0],y:n[1],'class':'wn',transform:'rotate('+((i+.5)*W-90)+' '+n[0]+' '+n[1]+')'});tn.textContent=String(tk+1);g.appendChild(tn);}
  /* 12星座の外周 */
  for(var k=0;k<12;k++){var a=k*30,p=pt(a,R),q=pt(a,R+18);g.appendChild(el('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],'class':'wl'}));var mm=pt(a+15,R+10),ts=el('text',{x:mm[0],y:mm[1],'class':'wz',transform:'rotate('+(a+15)+' '+mm[0]+' '+mm[1]+')'});ts.textContent=JY.SIGNS[k].replace('座','');g.appendChild(ts);}
  g.appendChild(el('circle',{cx:C,cy:C,r:R+18,'class':'wo'}));
  /* 今日の星の位置 */
  var now=Date.now(),PL=[['月','Moon'],['太陽','Sun'],['火星','Mars'],['水星','Mercury'],['木星','Jupiter'],['金星','Venus'],['土星','Saturn']];
  PL.forEach(function(x,j){var l=JY.sidOf(x[1],now),p=pt(l,100-(j%3)*14),c=el('circle',{cx:p[0],cy:p[1],r:x[0]==='月'?9:7,'class':'wp'+(x[0]==='月'?' moon':'')});g.appendChild(c);var t=el('text',{x:p[0],y:p[1]+3.5,'class':'wpt'});t.textContent=x[0].charAt(0);g.appendChild(t);});
  var rl=JY.rahuSid(now);[[rl,'ラ'],[(rl+180)%360,'ケ']].forEach(function(x){var p=pt(x[0],58);g.appendChild(el('circle',{cx:p[0],cy:p[1],r:7,'class':'wp'}));var t=el('text',{x:p[0],y:p[1]+3.5,'class':'wpt'});t.textContent=x[1];g.appendChild(t);});
  var ctr=el('text',{x:C,y:C-4,'class':'wc',style:'font-size:'+(JY.NK[base].length>8?11:JY.NK[base].length>5?13:16)+'px'});ctr.textContent=JY.NK[base];svg.appendChild(ctr);var c2=el('text',{x:C,y:C+16,'class':'wc2'});c2.textContent='から数えたターラ';svg.appendChild(c2);
  svg.appendChild(el('path',{d:'M'+(C-8)+' 4 L'+(C+8)+' 4 L'+C+' 18Z','class':'wm'}));
  setRot(-(base+.5)*W,true);
  info();}
function setRot(d,anim){rot=d;var g=$('wg');g.style.transition=anim?'transform .6s cubic-bezier(.3,.8,.3,1)':'none';g.style.transform='rotate('+d+'deg)';g.style.transformOrigin=C+'px '+C+'px';}
function info(){var i=pick===null?base:pick,tk=JY.tara(base,i);
  $('winfo').innerHTML='<div class="card now"><span class="eyebrow">'+JY.NK[base]+'から見た '+JY.NK[i]+'</span><span class="big" style="color:'+col(tk)+'">'+(tk+1)+'. '+JY.TARA[tk][0]+'</span><p style="margin:0">'+TXT[tk]+'です。今日の月が'+JY.NK[i]+'にある日は、'+JY.NK[base]+'の人にとってこの巡りの日になります。</p><p class="note"><a href="/nakshatra/'+JY.NKSLUG[i]+'/">'+JY.NK[i]+'の解説</a>　<a href="/aisho/">二人の相性を36点でくわしく見る</a></p></div>';
  $('wsel').value=base;}
var moved=false;
function ang(ev){var r=$('wheel').getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*440-C,y=(ev.clientY-r.top)/r.height*440-C;return Math.atan2(y,x)*180/Math.PI;}
TK.ready(function(){var s=$('wsel'),o='';for(var i=0;i<27;i++)o+='<option value="'+i+'">'+JY.NK[i]+'</option>';s.innerHTML=o;
  s.addEventListener('change',function(){base=+s.value;pick=null;build();});
  $('wprev').addEventListener('click',function(){base=(base+26)%27;pick=null;build();});$('wnext').addEventListener('click',function(){base=(base+1)%27;pick=null;build();});
  $('wtoday').addEventListener('click',function(){base=JY.nak(JY.moonSid(Date.now())).i;pick=null;build();});
  var svg=$('wheel');
  svg.addEventListener('pointerdown',function(ev){drag={a:ang(ev),r:rot};moved=false;svg.setPointerCapture(ev.pointerId);});
  svg.addEventListener('pointermove',function(ev){if(!drag)return;var d=ang(ev)-drag.a;if(Math.abs(d)>3)moved=true;if(moved)setRot(drag.r+d,false);});
  svg.addEventListener('pointerup',function(ev){if(!drag)return;drag=null;if(!moved){var t=document.elementFromPoint(ev.clientX,ev.clientY);if(t&&t.dataset&&t.dataset.i!==undefined){pick=+t.dataset.i;info();$('wg').querySelectorAll('.ws').forEach(function(z){z.classList.toggle('on',+z.dataset.i===pick);});}return;}var top=((-rot/W-.5)%27+27)%27;base=Math.round(top)%27;pick=null;build();setTimeout(function(){moved=false;},50);});
  build();$('shr').innerHTML=TK.shareHTML('27星宿の円盤を回して、星の巡り（ターラ）を見てみました。 #月の宿 #インド占星術',location.origin+'/wheel/');});
})();
