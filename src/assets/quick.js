/* 生年月日だけで月の星宿を調べる（日本時間） */
(function(){var $=TK.$,SL='aries taurus gemini cancer leo virgo libra scorpio sagittarius capricorn aquarius pisces'.split(' ');
var SU=window.NKSU||[],SM=window.NKSUM||[],HM=null;
function find(ds,fn){var v0=fn(ds),lo=ds,hi=ds+864e5-6e4;if(fn(hi)===v0)return null;while(hi-lo>6e4){var m=(lo+hi)/2;if(fn(m)===v0)lo=m;else hi=m;}return hi;}
function card(i,sign,extra){var slug=JY.NKSLUG[i];
  return '<div class="card now"><span class="eyebrow">あなたの月の星宿</span><span class="big">'+JY.NK[i]+'</span><h3>月の星座は'+JY.SIGNS[sign]+'</h3>'+
  '<p style="margin:0">'+(SM[i]||'')+'</p>'+(extra||'')+
  (window.SR?SR.card(JY.DL[i%9],{label:JY.NK[i]+'を守る宝石の精'}):'')+'<div class="qbtn"><a class="btn" href="/nakshatra/'+slug+'/">'+JY.NK[i]+'の性格を読む</a><a class="btn ghost" href="/fortune/'+SL[sign]+'/">'+JY.SIGNS[sign]+'の今月の運勢</a><a class="btn ghost" href="/calendar/">吉日カレンダー</a></div>'+
  TK.shareHTML('インド占星術で調べたら、私の月の星宿は「'+JY.NK[i]+'」でした。 #ナヴァラトナ #インド占星術',location.origin+'/nakshatra/'+slug+'/')+'</div>';}
function run(e){if(e)e.preventDefault();var v=$('qbd').value,out=$('qres');if(!v){out.innerHTML='<p class="warn">生年月日を入れてください。</p>';return;}
  var a=v.split('-').map(Number),ds=Date.UTC(a[0],a[1]-1,a[2])-9*36e5;var 
      nk=function(m){return Math.floor(JY.moonSid(m)/(40/3));},sg=function(m){return Math.floor(JY.moonSid(m)/30);};
  var sw=find(ds,nk);
  if(sw===null){var i=nk(ds),s0=sg(ds),s1=sg(ds+864e5-6e4);TK.saveNak(i);
    out.innerHTML=card(i,s0,s0!==s1?'<p class="warn">この日は月の星座が'+JY.SIGNS[s0]+'から'+JY.SIGNS[s1]+'へ移る日です（'+TK.jst(find(ds,sg))+'ごろ）。運勢は生まれた時刻に近いほうの星座で見てください。</p>':'<p class="note">あなたの星宿をこのブラウザに記録しました。トップや今日の運勢に、あなたの運勢が出ます。</p>');}
  else{var i1=nk(ds),i2=nk(ds+864e5-6e4),t=TK.jst(sw);
    out.innerHTML='<div class="card warnbox"><h3>この日は、月の星宿が切り替わる日です</h3><p style="margin:0">日本時間 <b class="num">'+t+'</b> ごろに、月が「'+JY.NK[i1]+'」から「'+JY.NK[i2]+'」へ移りました。生まれた時刻で、どちらかに決まります。</p><div class="qbtn"><button type="button" class="ghost" data-q="0">'+t+'より前に生まれた</button><button type="button" class="ghost" data-q="1">'+t+'より後に生まれた</button></div><p class="note">時刻がわかる方は<a href="/chart/">魂の星図</a>で正確に調べられます。</p></div><div id="qpick"></div>';
    out.querySelectorAll('[data-q]').forEach(function(b){b.addEventListener('click',function(){var k=+b.dataset.q,i=k?i2:i1,ms=k?ds+864e5-6e4:ds;TK.saveNak(i);$('qpick').innerHTML=card(i,sg(ms),'<p class="note">あなたの星宿をこのブラウザに記録しました。</p>');});});}
}
TK.ready(function(){var f=$('qf');if(!f)return;f.addEventListener('submit',run);});
})();
