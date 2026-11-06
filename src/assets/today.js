(function(){var $=TK.$;
function draw(){var now=Date.now(),p=JY.panchang(now,35.69,139.69,9),today=p.nak.i,mine=TK.loadNak();
  if($('pc')){$('pc').innerHTML=
   '<div><span>曜日（支配星）</span><b>'+p.vara[0]+'（'+p.vara[1]+'）</b></div>'+
   '<div><span>月の星宿</span><b><a href="/nakshatra/'+p.nak.slug+'/">'+p.nak.name+'</a></b><small class="note">'+(p.nakEnd?TK.jst(p.nakEnd,true)+'まで':'')+'</small></div>'+
   '<div><span>ティティ（月齢日）</span><b>'+p.tithi+'日目 '+p.tithiName+'</b><small class="note">'+p.paksha+'</small></div>'+
   '<div><span>ヨーガ</span><b>'+p.yoga+'</b></div>'+
   '<div><span>日の出／日の入り（東京）</span><b class="num">'+(p.rise?TK.jst(p.rise):'—')+' ／ '+(p.set?TK.jst(p.set):'—')+'</b></div>'+
   '<div><span>ラーフ・カーラ（東京）</span><b class="num">'+(p.rahu?TK.jst(p.rahu.start)+'〜'+TK.jst(p.rahu.end):'—')+'</b><small class="note">大事な始めごとを避ける時間帯</small></div>';}
  if($('tara')){var html='';for(var i=0;i<27;i++){var t=JY.tara(i,today),T=TK.TARA_T[t],nm=JY.TARA[t];html+='<a href="/nakshatra/'+JY.NKSLUG[i]+'/"'+(mine===i?' style="border-color:var(--accent);background:var(--accent-soft)"':'')+'><b>'+JY.NK[i]+'</b><span class="t t-'+T.r+'">'+nm[0]+'（'+nm[1]+'）'+T.tag+'</span></a>';}$('tara').innerHTML=html;
}
  var good=[],bad=[];for(var j=0;j<27;j++){var tt=JY.tara(j,today);if(tt===8||tt===5)good.push(JY.NK[j]);if(tt===6)bad.push(JY.NK[j]);}
  if($('pick'))$('pick').innerHTML='<div class="card"><span class="eyebrow">今日とくに運のいい星宿</span><b>'+good.join('・')+'</b></div><div class="card"><span class="eyebrow">今日は休息を大切に</span><b>'+bad.join('・')+'</b></div>';
  if($('mine')){if(mine===null){$('mine').innerHTML='<p style="margin:0">あなたの星宿（生まれたときの月の星宿）がわかると、ここに今日の運勢が出ます。</p><p class="note"><a href="/chart/">魂の星図</a>で一度計算すると、このブラウザに記録されて自動で表示されます。</p>';}
   else{var t2=JY.tara(mine,today),T2=TK.TARA_T[t2],n2=JY.TARA[t2];$('mine').innerHTML='<span class="eyebrow">あなたの星宿：'+JY.NK[mine]+'</span><span class="big">'+n2[0]+'（'+n2[1]+'）の日</span><h3 class="t-'+T2.r+'">'+T2.tag+'</h3><p style="margin:0">'+T2.all+'</p><p class="note" style="color:inherit"><b>恋愛</b>　'+T2.love+'</p><p class="note" style="color:inherit"><b>仕事</b>　'+T2.work+'</p><p class="note">月の星宿は約1日で移ります。'+(p.nakEnd?TK.jst(p.nakEnd,true)+'からは次の運勢に切り替わります。':'')+'</p>';}}
  if($('today-date')){var d=new Date(now+9*36e5);$('today-date').textContent=d.getUTCFullYear()+'年'+(d.getUTCMonth()+1)+'月'+d.getUTCDate()+'日（'+p.vara[0].charAt(0)+'）';}
}
TK.ready(function(){try{draw();}catch(e){}});
})();
