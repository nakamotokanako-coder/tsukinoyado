/* 星宿ページ：コンパクトな今日の運勢。開くと恋愛・仕事、その下にターラ一覧への入口 */
(function(){TK.ready(function(){var el=document.getElementById('nk-today');if(!el)return;var i=+el.dataset.i,now=Date.now(),today=JY.nak(JY.moonSid(now)).i,t=JY.tara(i,today),T=TK.TARA_T[t],n=JY.TARA[t];
 el.innerHTML='<details class="nkt-d"><summary><span class="nkt-k">今日の'+JY.NK[i]+'</span><b class="t-'+T.r+'">'+T.tag+'</b><span class="nkt-o">今日の過ごし方を見る</span></summary>'+
  '<div class="nkt-b"><p class="note" style="margin:0">今日は「'+n[0]+'」の日（今の月の星宿：'+JY.NK[today]+'）</p><p style="margin:6px 0 0">'+T.all+'</p><p style="margin:6px 0 0"><b>恋愛</b>　'+T.love+'</p><p style="margin:4px 0 0"><b>仕事</b>　'+T.work+'</p>'+
  '<p style="margin:8px 0 0"><a href="#nk-tara" data-open-tara>ターラの9つの巡りを詳しく見る →</a>　<a href="/today/">27星宿すべての今日の運勢</a></p></div></details>';
 el.querySelector('[data-open-tara]').addEventListener('click',function(e){e.preventDefault();var d=document.getElementById('nk-tara');if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});}});});})();
