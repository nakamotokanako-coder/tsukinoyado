(function(){var $=TK.$;
var NOTE={ヴァルナ:'精神的な成熟度や価値観の格が釣り合っているか。',ヴァシャ:'お互いを惹きつけ、影響し合う力。',ターラ:'二人の運の巡りが、お互いを助け合う関係か。',ヨーニ:'本能的な相性や、からだのリズムの合い方。',グラハ・マイトリ:'心の友好度。考え方や感じ方が通じ合うか。',ガナ:'生まれ持った気質（神・人・羅刹）の組み合わせ。',バクート:'暮らし・お金・家庭の幸福に関わる、月星座同士の位置関係。',ナーディ:'体質や生命力のタイプ。同じだと注意点とされます。'};
function verdict(t){return t>=28?['とても良い相性','伝統的な基準で、とても恵まれた組み合わせです。お互いを自然に支え合える関係です。']:t>=24?['良い相性','安定して長く続きやすい組み合わせです。小さな違いを楽しめる関係です。']:t>=18?['標準的な相性','結婚の目安とされる18点を超えています。うまくいくかは、お互いの歩み寄り次第です。']:['工夫が必要な相性','伝統的な目安の18点に届きません。ただし点数は月だけで見た一つの視点です。違いを知って補い合えば、十分に関係は育ちます。'];}
function run(){var a=TK.readBirth('a-'),b=TK.readBirth('b-'),st=$('status');if(a.err||b.err){st.textContent=(a.err?'あなた：'+a.err:'お相手：'+b.err);return false;}
  var ma=JY.moonSid(a.ms),mb=JY.moonSid(b.ms),ga=$('a-g').value,gb=$('b-g').value,r;
  if(ga!==gb){var male=ga==='m'?ma:mb,fem=ga==='m'?mb:ma;r=JY.koota(male,fem);}
  else{var r1=JY.koota(ma,mb),r2=JY.koota(mb,ma);r={items:r1.items.map(function(x,i){return {k:x.k,max:x.max,v:(x.v+r2.items[i].v)/2,note:x.note};}),total:(r1.total+r2.total)/2};}
  var na=JY.nak(ma),nb=JY.nak(mb),v=verdict(r.total),warn=[];
  if(a.unknown&&TK.moonNakRange(a))warn.push('あなたの生まれた日は、月の星宿が切り替わる日です。');
  if(b.unknown&&TK.moonNakRange(b))warn.push('お相手の生まれた日は、月の星宿が切り替わる日です。');
  $('res').innerHTML='<div class="card"><span class="eyebrow">アシュタクータ（36点満点）</span><div class="score"><span class="n num">'+(Math.round(r.total*10)/10)+'</span><span>／ 36点</span><b style="font-size:18px">'+v[0]+'</b></div><div class="meter"><i style="width:'+(r.total/36*100)+'%"></i></div><p style="margin:0">'+v[1]+'</p><p class="note">あなたの月：'+na.name+'（'+JY.SIGNS[Math.floor(ma/30)]+'）／お相手の月：'+nb.name+'（'+JY.SIGNS[Math.floor(mb/30)]+'）'+(ga===gb?'<br>同性どうし、または性別を指定しない場合は、両方向の計算の平均を表示しています。':'')+'</p>'+(warn.length?'<p class="warn">'+warn.join('')+'時刻がわかると結果が確定します。</p>':'')+'</div>'+
   '<div class="tbl"><table style="min-width:520px"><thead><tr><th>項目</th><th>点数</th><th>見ているもの</th></tr></thead><tbody>'+r.items.map(function(x){var c=x.v>=x.max*0.75?'g':x.v<=x.max*0.25?'b':'r';return '<tr><td><b>'+x.k+'</b></td><td class="num"><span class="pill '+c+'">'+(Math.round(x.v*10)/10)+' / '+x.max+'</span></td><td style="white-space:normal">'+NOTE[x.k]+'<br><span class="note">'+x.note+'</span></td></tr>';}).join('')+'</tbody></table></div>'+
   '<p class="note">'+(r.items[7].v===0?'ナーディが同じ組み合わせは、伝統的には注意点とされます。ただし、月星座の支配星が同じ、または友好的な場合などに打ち消されるという考え方もあります。':'')+'</p>'+
   '<div class="grid"><a class="card tool" href="/nakshatra/'+na.slug+'/"><span class="k">あなたの星宿</span><b>'+na.name+'</b><p>性格・恋愛・仕事を読む</p></a><a class="card tool" href="/nakshatra/'+nb.slug+'/"><span class="k">お相手の星宿</span><b>'+nb.name+'</b><p>性格・恋愛・仕事を読む</p></a></div>';
  st.textContent='相性を表示しています';return true;}
TK.initPlace('a-');TK.initPlace('b-');
$('f').addEventListener('submit',function(e){e.preventDefault();try{if(run())$('res').scrollIntoView({behavior:'smooth'});}catch(err){$('status').textContent='計算できませんでした。入力を確認してください。';}});
TK.ready(function(){try{run();$('status').textContent='サンプル表示中';}catch(e){}});
})();
