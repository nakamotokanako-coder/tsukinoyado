(function(){var $=TK.$;
function draw(){var now=Date.now(),p=JY.panchang(now,35.69,139.69,9),today=p.nak.i,mine=TK.loadNak();
  if($('pc')){$('pc').innerHTML=
   '<div><span>曜日（支配星）</span><b>'+p.vara[0]+'（'+p.vara[1]+'）</b></div>'+
   '<div><span>月の星宿</span><b><a href="/nakshatra/'+p.nak.slug+'/">'+p.nak.name+'</a></b><small class="note">'+(p.nakEnd?TK.jst(p.nakEnd,true)+'まで':'')+'</small></div>'+
   '<div><span>ティティ（月齢日）</span><b>'+p.tithi+'日目 '+p.tithiName+'</b><small class="note">'+p.paksha+'</small></div>'+
   '<div><span>ヨーガ</span><b>'+p.yoga+'</b></div>'+
   '<div><span>日の出／日の入り（東京）</span><b class="num">'+(p.rise?TK.jst(p.rise):'—')+' ／ '+(p.set?TK.jst(p.set):'—')+'</b></div>'+
   '<div><span>ラーフ・カーラ（東京）</span><b class="num">'+(p.rahu?TK.jst(p.rahu.start)+'〜'+TK.jst(p.rahu.end):'—')+'</b><small class="note">大事な始めごとを避ける時間帯</small></div>';}
  if($('tara')){var html='';for(var i=0;i<27;i++){var t=JY.tara(i,today),T=TK.TARA_T[t],nm=JY.TARA[t];html+='<a href="/nakshatra/'+JY.NKSLUG[i]+'/"'+(mine===i?' style="border-color:var(--accent);background:var(--accent-soft)"':'')+'><b>'+JY.NK[i]+'</b><span class="t t-'+T.r+'">'+nm[0]+'・'+T.tag+'</span></a>';}$('tara').innerHTML=html;
}
  var good=[],bad=[];for(var j=0;j<27;j++){var tt=JY.tara(j,today);if(tt===8||tt===5)good.push(JY.NK[j]);if(tt===6)bad.push(JY.NK[j]);}
  if($('pick'))$('pick').innerHTML='<div class="card"><span class="eyebrow">今日とくに運のいい星宿</span><b class="nmlist">'+good.map(function(x){return '<span class="nobr">'+x+'</span>';}).join('、')+'</b></div><div class="card"><span class="eyebrow">今日は休息を大切に</span><b class="nmlist">'+bad.map(function(x){return '<span class="nobr">'+x+'</span>';}).join('、')+'</b></div>';
  if($('mine')){if(mine===null){$('mine').innerHTML='<p style="margin:0">あなたの星宿（生まれたときの月の星宿）がわかると、ここに今日の運勢が出ます。</p><p class="note"><a href="/chart/">魂の星図</a>で一度計算すると、このブラウザに記録されて自動で表示されます。</p>';}
   else{var t2=JY.tara(mine,today),T2=TK.TARA_T[t2],n2=JY.TARA[t2];$('mine').innerHTML='<span class="eyebrow">あなたの星宿：'+JY.NK[mine]+'　いまの運勢</span><span class="big">'+n2[0]+'の日</span><h3 class="t-'+T2.r+'">'+T2.tag+'</h3><p style="margin:0">'+T2.all+'</p><p class="note" style="color:inherit"><b>恋愛</b>　'+T2.love+'</p><p class="note" style="color:inherit"><b>仕事</b>　'+T2.work+'</p><p class="note">現在時刻の月の星宿（'+p.nak.name+'）で判定しています。'+(p.nakEnd?'次の切替：'+TK.jst(p.nakEnd,true)+'（日本時間）':'')+'</p>';}}
  if($('today-date')){var d=new Date(now+9*36e5);$('today-date').textContent=d.getUTCFullYear()+'年'+(d.getUTCMonth()+1)+'月'+d.getUTCDate()+'日（'+p.vara[0].charAt(0)+'）';}
}
TK.ready(function(){try{draw();}catch(e){}});
})();
/* チョーガディヤとホーラー（東京） */
(function(){var $=TK.$,HM={太陽:'公的な用事、目上の人との面会',月:'人に会う、家族や家のこと',火星:'体を動かす、決断する',水星:'勉強、連絡、書類や契約の確認',木星:'学び、相談、お祈り、大事な始めごと',金星:'恋愛、買いもの、美容、楽しみ',土星:'片づけ、地道な作業'};
function hm(ms){return TK.jst(ms);}
function draw(){var now=Date.now(),d=new Date(now+9*36e5),ds=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-9*36e5,wd=d.getUTCDay(),T=JY.timeSlots(ds,wd,35.69,139.69);
  if(T&&now<T.rise){T=JY.timeSlots(ds-864e5,(wd+6)%7,35.69,139.69);}if(!T)return;
  var c=T.cho.filter(function(x){return x.start<=now&&now<x.end;})[0],h=T.hora.filter(function(x){return x.start<=now&&now<x.end;})[0],cls=['b','','g'];
  var nowHtml=(c?'<span class="eyebrow">いまの時間帯（東京）</span><span class="big">'+c.name+'<small style="font-size:.5em">（'+c.mean+'）</small></span><p style="margin:0">'+hm(c.start)+'〜'+hm(c.end)+'。'+(c.q===2?'物事を始めるのによい時間です。':c.q===1?'移動や外出によい、ふつうの時間です。':'大事な始めごとは、次のよい時間を待つのがおすすめです。')+'</p>':'')+
   (h?'<p class="note" style="color:inherit">いまは<b>'+h.lord+'のホーラー</b>（'+hm(h.start)+'〜'+hm(h.end)+'）：'+HM[h.lord]+'に向く時間。</p>':'');
  if($('nowslot'))$('nowslot').innerHTML=nowHtml+'<p class="note"><a href="/today/#cho">今日の時間帯をすべて見る →</a></p>';
  if($('cho')){function row(x){var on=x.start<=now&&now<x.end;return '<tr'+(on?' class="cur"':'')+'><td class="num">'+hm(x.start)+'〜'+hm(x.end)+'</td><td><span class="pill '+cls[x.q]+'">'+x.name+'</span> <small class="mut">'+x.mean+'</small></td></tr>';}
    function hrow(x){var on=x.start<=now&&now<x.end;return '<tr'+(on?' class="cur"':'')+'><td class="num">'+hm(x.start)+'〜'+hm(x.end)+'</td><td><b>'+x.lord+'</b></td><td>'+HM[x.lord]+'</td></tr>';}
    $('cho').innerHTML='<div class="card now">'+nowHtml+'</div>'+
     '<div class="grid"><div class="card"><h3>昼（日の出 '+hm(T.rise)+'〜）</h3><div class="tbl"><table><tbody>'+T.cho.slice(0,8).map(row).join('')+'</tbody></table></div></div><div class="card"><h3>夜（日の入り '+hm(T.set)+'〜）</h3><div class="tbl"><table><tbody>'+T.cho.slice(8).map(row).join('')+'</tbody></table></div></div></div>'+
     '<details class="card"><summary><b>ホーラー（1時間ごとの星の支配）を見る</b></summary><div class="tbl"><table><tbody>'+T.hora.map(hrow).join('')+'</tbody></table></div></details>';}}
TK.ready(function(){try{draw();}catch(e){}});})();
