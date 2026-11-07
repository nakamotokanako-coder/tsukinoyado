/* 読みもの一覧：カテゴリーで絞り込み */
(function(){var B=[].slice.call(document.querySelectorAll('.afil [data-cat]')),L=[].slice.call(document.querySelectorAll('#alist>li')),C=document.getElementById('acount');if(!B.length)return;
B.forEach(function(b){b.addEventListener('click',function(){var c=b.dataset.cat,n=0;B.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});
  L.forEach(function(li){var on=c==='all'||li.dataset.cat===c;li.hidden=!on;if(on)n++;});C.textContent=(c==='all'?'':b.textContent+'：')+n+'本の記事';});});})();
