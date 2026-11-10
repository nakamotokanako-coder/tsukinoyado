/* 星宿診断：生年月日だけで月の星宿と宝石の精霊を出す（日本時間） */
(function(){var $=TK.$,SL='aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces'.split(' ');
var SM=window.NKSUM||[],CT=window.NKCATCH||[],SITE='インド占星術ナヴァラトナ';
function find(ds,fn){var v0=fn(ds),lo=ds,hi=ds+864e5-6e4;if(fn(hi)===v0)return null;while(hi-lo>6e4){var m=(lo+hi)/2;if(fn(m)===v0)lo=m;else hi=m;}return hi;}
function sp(i){return window.SR?SR.BY[JY.DL[i%9]]:null;}
/* 魂の星（アートマカラカ）は時刻で変わることがあるので、その日の0時・正午・23時59分で確かめる */
function akOf(ds){var L=[ds,ds+432e5,ds+864e5-6e4].map(function(m){return JY.compute(m,35.69,139.69).ak;}),u=L.filter(function(x,k){return L.indexOf(x)===k;});return {ak:L[1],list:u,sure:u.length===1};}
var AKT=window.AKT||{},BD='';
function akHtml(a){if(!a)return '';var t=AKT[a.ak]||['','','',''];
  return '<span class="rc-ak"><small>魂の星</small>'+(a.sure?a.ak:a.list.join(' か '))+'</span>'+(a.sure?'<span class="rc-akt">'+t[0]+'</span>':'<span class="rc-akt">生まれた時刻で決まります</span>');}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

/* 結果カード（保存・シェアしたくなる1枚） */
function card(i,sign,extra,ak){var slug=JY.NKSLUG[i],s=sp(i),url=location.origin+'/nakshatra/'+slug+'/';
  var h='<div class="rcard" style="--sc:'+(s?s.color:'#4B2E73')+'" id="rcard"><div class="rc-in">'+
    '<span class="rc-label">あなたの宝石の精霊</span>'+
    (s?'<img class="rc-img" src="'+SR.img(s.id)+'" alt="'+s.gem+'の精霊 '+s.name+'" width="320" height="320">':'')+
    '<b class="rc-name">'+(s?s.name:'')+'</b><span class="rc-gem">'+(s?s.gem+'の精霊・'+s.pl:'')+'</span>'+
    '<span class="rc-nak"><small>星宿</small>'+JY.NK[i]+'</span>'+((window.NKLAB||[])[i]?'<span class="rc-lab"><img src="/assets/sym/'+slug+'-s.webp" alt="" width="28" height="28">'+NKLAB[i]+'</span>':'')+
    '<p class="rc-catch">'+esc(CT[i]||'')+'</p>'+akHtml(ak)+
    '<span class="rc-site">'+SITE+'</span></div></div>'+
    '<div class="rc-actions"><a class="btn" href="/nakshatra/'+slug+'/">詳しく読む</a><button type="button" class="ghost" data-act="save">画像を保存</button><button type="button" class="ghost" data-act="share">シェアする</button></div>'+
    '<p class="note rc-msg" aria-live="polite"></p>'+
    '<div class="rc-next"><p class="rc-nh">もっとくわしく見る</p><a class="nx" href="/chart/" data-hand="/chart/"><span class="nx-k">読み解き</span><b>読み解きを見る</b><span>魂の星図：本質・才能・人生の時期を、言葉で</span></a><a class="nx" href="/horoscope/" data-hand="/horoscope/"><span class="nx-k">チャート</span><b>チャートを見る</b><span>ホロスコープ（チャート）作成：出生図・度数・ダシャーの一覧</span></a><p class="note">生年月日を引き継ぎます。出生時刻と出生地を足すと、アセンダントや分割図まで出ます。</p></div>'+
    '<div class="rc-sharebox" hidden>'+TK.shareHTML('インド占星術で調べたら、私の星宿は「'+JY.NK[i]+'」、宝石の精霊は「'+(s?s.name:'')+'」でした！ #ナヴァラトナ #インド占星術',url)+'</div>'+
    '<div class="card rc-detail"><span class="eyebrow">あなたの星宿</span><h3 class="rc-dh">'+JY.NK[i]+(sign!==null&&sign!==undefined?'<small>（月の星座：'+JY.SIGNS[sign]+'）</small>':'')+'</h3>'+
    '<p style="margin:0">'+(SM[i]||'')+'</p>'+(extra||'')+
    (s?'<p class="note" style="color:inherit"><b>'+s.name+'</b>は、'+s.catch+'。'+s.char+'</p>':'')+
    (ak&&AKT[ak.ak]?'<h3 class="rc-dh" style="margin-top:14px">魂の星：'+(ak.sure?ak.ak:ak.list.join(' か '))+'<small>（アートマカラカ＝人生を通して育てていくテーマ）</small></h3>'+(ak.sure?'<p style="margin:0"><b>'+AKT[ak.ak][0]+'。</b>'+AKT[ak.ak][1]+'</p><p class="ess-g"><b>育てたいこと</b>'+AKT[ak.ak][3].replace(/^育てたいのは、/,'')+'</p>':'<p style="margin:0">この日は、生まれた時刻によって魂の星が「'+ak.list.join('」か「')+'」に分かれます。出生時刻を入れて<a href="/chart/" data-hand="/chart/">魂の星図</a>で確かめてください。</p>'):'')+
    '<div class="qbtn"><a class="btn ghost" href="/nakshatra/'+slug+'/">'+JY.NK[i]+'の性格・恋愛・仕事</a>'+(sign!==null&&sign!==undefined?'<a class="btn ghost" href="/fortune/'+SL[sign]+'/">'+JY.SIGNS[sign]+'の今月の運勢</a>':'')+'<a class="btn ghost" href="/today/">今日の運勢</a></div></div>';
  return h;}
function wire(root,i,ak){var s=sp(i),slug=JY.NKSLUG[i],url=location.origin+'/nakshatra/'+slug+'/',msg=root.querySelector('.rc-msg');
  root.querySelectorAll('[data-hand]').forEach(function(a){a.addEventListener('click',function(e){if(!BD)return;e.preventDefault();TK.handTo(a.dataset.hand,{bd:BD});});});
  root.querySelectorAll('[data-act]').forEach(function(b){b.addEventListener('click',function(){
    if(b.dataset.act==='share'){var text='インド占星術で調べたら、私の星宿は「'+JY.NK[i]+'」、宝石の精霊は「'+(s?s.name:'')+'」でした！ #ナヴァラトナ';
      if(navigator.share){navigator.share({title:SITE,text:text,url:url}).catch(function(){});}
      else{var bx=root.querySelector('.rc-sharebox');bx.hidden=!bx.hidden;}}
    else{msg.textContent='画像を作っています…';makeImage(i,ak).then(function(blob){var name='navaratna-'+slug+'.png',file=null;
        try{file=new File([blob],name,{type:'image/png'});}catch(e){}
        if(file&&navigator.canShare&&navigator.canShare({files:[file]})&&/iPhone|iPad|Android/i.test(navigator.userAgent)){navigator.share({files:[file],title:SITE}).then(function(){msg.textContent='';}).catch(function(){msg.textContent='';});}
        else{var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1500);msg.textContent='画像を保存しました。';}
      }).catch(function(){msg.textContent='画像を作れませんでした。お手数ですが、画面のスクリーンショットをご利用ください。';});}
  });});}

/* 保存用の画像（1080×1350）をその場で描く */
function wrap(ctx,t,maxw){var out=[],line='';for(var k=0;k<t.length;k++){var c=t[k],tw=ctx.measureText(line+c).width;if(tw>maxw&&line){out.push(line);line=c;}else line+=c;}if(line)out.push(line);return out;}
function makeImage(i,ak){var s=sp(i);return new Promise(function(res,rej){
  var W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;var x=cv.getContext('2d');if(!x||!s)return rej();
  var img=new Image();img.onload=function(){(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(function(){
    var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#FFFDF8');g.addColorStop(1,'#F6EEDF');x.fillStyle=g;x.fillRect(0,0,W,H);
    var r=x.createRadialGradient(W/2,560,40,W/2,560,520);r.addColorStop(0,s.color+'55');r.addColorStop(1,s.color+'00');x.fillStyle=r;x.fillRect(0,0,W,H);
    x.strokeStyle='#C9A85C';x.lineWidth=3;x.strokeRect(40,40,W-80,H-80);x.lineWidth=1;x.strokeRect(54,54,W-108,H-108);
    var serif='"Shippori Mincho B1","Hiragino Mincho ProN","Yu Mincho",serif',sans='"Zen Kaku Gothic New","Hiragino Sans","Yu Gothic",sans-serif';
    x.textAlign='center';x.fillStyle='#A9822F';x.font='600 34px '+sans;x.fillText('あなたの宝石の精霊',W/2,150);
    x.drawImage(img,W/2-330,180,660,660);
    x.fillStyle='#2B1F45';x.font='800 120px '+serif;x.fillText(s.name,W/2,960);
    x.fillStyle='#584E70';x.font='500 38px '+sans;x.fillText(s.gem+'の精霊・'+s.pl,W/2,1020);
    x.fillStyle='#2B1F45';x.font='700 46px '+serif;x.fillText('星宿　'+JY.NK[i]+(ak&&ak.sure?'　／　魂の星　'+ak.ak:''),W/2,1100);
    x.fillStyle='#584E70';x.font='500 34px '+sans;wrap(x,CT[i]||'',860).slice(0,2).forEach(function(l,k){x.fillText(l,W/2,1160+k*48);});
    x.fillStyle='#A9822F';x.font='600 28px '+sans;x.fillText('インド占星術ナヴァラトナ　9つの宝石の精霊',W/2,1262);
    cv.toBlob(function(b){b?res(b):rej();},'image/png');});};
  img.onerror=rej;img.src=SR.img(s.id);});}

/* 本人の星宿の記録：まだ記録がない（または同じ）ときだけ自動で記録。別の人を調べたときは上書きしない */
function rec(i){var m=TK.loadNak();if(m===null||m===i){TK.saveNak(i);return '<p class="note">あなたの星宿として、このブラウザに記録しました。今日の運勢に、あなたの運勢が出ます。</p>';}
  return '<p class="note">このブラウザには、あなたの星宿として「'+JY.NK[m]+'」が記録されています（上書きしていません）。<button type="button" class="ghost" data-rec="'+i+'" style="margin-left:6px;min-height:36px;padding:4px 12px;font-size:13px">'+JY.NK[i]+'を私の星宿として記録する</button></p>';}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-rec]');if(!b)return;TK.saveNak(+b.dataset.rec);b.parentNode.innerHTML='あなたの星宿として「'+JY.NK[+b.dataset.rec]+'」を記録しました。';welcome();});
function reveal(out){out.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});if(out.hasAttribute('tabindex'))out.focus({preventScroll:true});}
function show(i,sign,extra,ak){var out=$('qres'),w=$('qwelcome');if(w)w.hidden=true;out.innerHTML=card(i,sign,extra,ak);wire(out,i,ak);reveal(out);}
function run(e){if(e)e.preventDefault();var v=$('qbd').value,out=$('qres'),error=$('qerror');
  document.querySelectorAll('#qf select').forEach(function(s){s.removeAttribute('aria-invalid');});
  if(error){error.hidden=true;error.textContent='';}
  if(!v){if(error){error.hidden=false;error.textContent='生まれた年・月・日をすべて選んでください。';var missing=Array.prototype.find.call(document.querySelectorAll('#qf select'),function(s){return !s.value;});if(missing){missing.setAttribute('aria-invalid','true');missing.focus();}}else{out.innerHTML='<p class="warn">生年月日を選んでください。</p>';reveal(out);}return;}
  var a=v.split('-').map(Number),ds=Date.UTC(a[0],a[1]-1,a[2])-9*36e5,
      nk=function(m){return Math.floor(JY.moonSid(m)/(40/3));},sg=function(m){return Math.floor(JY.moonSid(m)/30);};
  var sw=find(ds,nk),ak=akOf(ds);BD=v;
  if(sw===null){var i=nk(ds),s0=sg(ds),s1=sg(ds+864e5-6e4);
    show(i,s0,(s0!==s1?'<p class="warn">この日は月の星座が'+JY.SIGNS[s0]+'から'+JY.SIGNS[s1]+'へ移る日です（'+TK.jst(find(ds,sg))+'ごろ）。運勢は生まれた時刻に近いほうの星座で見てください。</p>':'')+rec(i),ak);}
  else{var i1=nk(ds),i2=nk(ds+864e5-6e4),t=TK.jst(sw);
    out.innerHTML='<div class="card warnbox"><h3>この日は、月の星宿が切り替わる日です</h3><p style="margin:0">日本時間 <b class="num">'+t+'</b> ごろに、月が「'+JY.NK[i1]+'」から「'+JY.NK[i2]+'」へ移りました。生まれた時刻で、どちらかに決まります。</p><div class="qbtn"><button type="button" class="ghost" data-q="0">'+t+'より前に生まれた</button><button type="button" class="ghost" data-q="1">'+t+'より後に生まれた</button></div><p class="note">時刻がわかる方は<a href="/horoscope/">ホロスコープ（チャート）作成</a>や<a href="/chart/">魂の星図</a>で正確に調べられます。</p></div>';
    reveal(out);
    out.querySelectorAll('[data-q]').forEach(function(b){b.addEventListener('click',function(){var k=+b.dataset.q,i=k?i2:i1,ms=k?ds+864e5-6e4:ds;show(i,sg(ms),rec(i),ak);});});}
}
/* 再訪の人：上部にコンパクトなカード（記録された本人の星宿だけを根拠にする） */
function welcome(){var w=$('qwelcome'),top=$('qback'),i=TK.loadNak();if(w)w.hidden=true;if(!top)return;
  if(i===null){top.hidden=true;return;}
  var s=sp(i);top.hidden=false;top.style.setProperty('--sc',s?s.color:'#4B2E73');
  top.innerHTML=(s?'<img src="'+SR.img(s.id,true)+'" alt="" width="72" height="72">':'')+'<div class="qb-b"><span class="eyebrow">おかえりなさい</span><b class="qb-n">'+JY.NK[i]+'</b><span class="note">あなたの宝石の精霊：'+(s?s.name+'（'+s.gem+'）':'')+'</span></div>'+
   '<div class="qb-a"><button type="button" data-act="mine">私の結果を見る</button><a class="btn ghost" href="/today/">今日の運勢を見る</a><button type="button" class="ghost" data-act="other">別の人を調べる</button></div>';
  top.querySelector('[data-act=mine]').addEventListener('click',function(){BD='';show(i,null,'<p class="note">このブラウザに記録されたあなたの星宿から表示しています。生年月日から調べ直すと、月の星座と魂の星も表示されます。</p>');});
  top.querySelector('[data-act=other]').addEventListener('click',function(){var q=$('quick');q.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){var y=$('qbd-y');y&&y.focus({preventScroll:true});},350);});}
TK.ready(function(){var f=$('qf');if(!f)return;f.addEventListener('submit',run);welcome();});
})();
