(function(){var $=TK.$;TK.ready(function(){var el=$('ftn');if(!el)return;var M=+el.dataset.s,now=Date.now(),off=0;
 function draw(){$('fy').innerHTML=FD.year(M,now);$('fm').innerHTML=FD.month(M,now,off);
  document.querySelectorAll('[data-off]').forEach(function(b){b.setAttribute('aria-pressed',+b.dataset.off===off?'true':'false');});}
 document.querySelectorAll('[data-off]').forEach(function(b){b.addEventListener('click',function(){off=+b.dataset.off;draw();});});
 try{draw();}catch(e){}
 $('shr').innerHTML=TK.shareHTML(JY.SIGNS[M]+'（月の星座）の今月の運勢を、インド占星術で見ました。 #月の宿 #インド占星術',location.origin+'/fortune/'+FD.SL[M]+'/');});})();
