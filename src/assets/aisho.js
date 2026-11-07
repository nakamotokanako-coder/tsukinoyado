(function(){var $=TK.$;
var NOTE={ヴァルナ:'精神的な成熟度や価値観の格が釣り合っているか。',ヴァシャ:'お互いを惹きつけ、影響し合う力。',ターラ:'二人の運の巡りが、お互いを助け合う関係か。',ヨーニ:'本能的な相性や、からだのリズムの合い方。',グラハ・マイトリ:'心の友好度。考え方や感じ方が通じ合うか。',ガナ:'生まれ持った気質（神・人・羅刹）の組み合わせ。',バクート:'暮らし・お金・家庭の幸福に関わる、月星座同士の位置関係。',ナーディ:'体質や生命力のタイプ。同じだと注意点とされます。'};

var MT={1:['鏡の関係','心の星座が同じ二人。感じ方や反応が似ていて、言わなくても通じ合う安心感があります。似ているからこそ同じところでつまずきやすいので、ときどき違う視点を取り入れると関係が深まります。'],
2:['二人三脚の関係','隣り合う星座の二人。一方が先に進み、もう一方が支える関係です。お金や時間の使い方に違いが出やすく、伝統的にはここが注意点とされます。役割と財布の線引きをはっきりさせると安定します。'],
3:['仲間の関係','刺激し合い、一緒に挑戦できる二人。友人や仕事の仲間として特に力を発揮します。ときどき競争心が顔を出すので、同じ目標を持つと強いチームになります。'],
4:['役割分担の関係','家を守る力と外で活躍する力を分け合える二人。お互いの持ち場を尊重するほど安定します。相手のやり方に口を出しすぎないことがコツです。'],
5:['信頼と創造の関係','心の星座が調和の角度にある、気の合う二人。考え方や理想が通じやすく、一緒に何かを生み出せます。伝統的な相性点では、家族や子どもについての考えをすり合わせることが大切とされます。'],
6:['深い縁の関係','強く惹かれ合う一方で、摩擦も生まれやすい二人。お互いを大きく変える力があり、伝統的には注意点とされる組み合わせです。相手を変えようとせず、時間をかけて信頼を積むと、深い絆になります。'],
7:['引き合う正反対の関係','真向かいの星座の二人。自分にないものを相手が持っていて、強く惹かれ合います。違いが魅力にも衝突にもなるので、話し合う習慣が鍵です。']};

var STR={ヴァルナ:'価値観や精神的な歩調がそろっています。',ヴァシャ:'自然に惹きつけ合い、影響し合える二人です。',ターラ:'運の巡りが、お互いを助け合う関係です。',ヨーニ:'本能的なリズムや、心地よい距離感が合っています。',グラハ・マイトリ:'考え方や感じ方が通じ合い、話していて楽な二人です。',ガナ:'気質が似ていて、ペースを合わせやすい二人です。',バクート:'暮らしやお金、家庭の幸福の面で調和しやすい組み合わせです。',ナーディ:'体質や生命力のタイプが、お互いを補い合っています。'};
var ADV={ヴァルナ:'精神的なペースや価値観の違いを、上下ではなく「違い」として尊重し合いましょう。',ヴァシャ:'どちらかが引っ張りすぎないように、主導権を交代で持つと心地よくなります。',ターラ:'運の波がずれやすいので、大事な決断はお互いに相談してから。',ヨーニ:'生活リズムや、心地よい距離感の違いを認め合うことが大切です。',グラハ・マイトリ:'考え方の違いは、察してもらうより言葉にして確かめると、すれ違いが減ります。',ガナ:'気質の違いがあるので、相手のペースを急かさないことがコツです。',バクート:'お金や暮らしのルールを、早めに二人で決めておくと安心です。',ナーディ:'体調や生活習慣のタイプが似ているので、二人とも同じところで無理をしないように。'};
var TM=['同じ星宿どうし。考え方や感じ方が似ていて、分身のように通じ合う相手です。','あなたに豊かさや実りを運んでくれる相手です。','すれ違いや行き違いが起きやすい相手。確認をていねいに。','そばにいると安心できる、心の安らぎをくれる相手です。','張り合いやすく、ぶつかりやすい相手。譲り合いが鍵です。','目標をかなえる力を貸してくれる、心強い相手です。','強く揺さぶられ、大きく変わるきっかけをくれる相手。距離感が大切です。','気楽につき合える、友だちのような相手です。','最良の味方になってくれる、深い縁の相手です。'];
function theme(ma,mb,r,na,nb){var sa=Math.floor(ma/30),sb=Math.floor(mb/30),k=(sb-sa+12)%12+1,key=Math.min(k,14-k);if(k===1)key=1;
 var m=MT[key],t1=JY.tara(na.i,nb.i),t2=JY.tara(nb.i,na.i),strong=r.items.filter(function(x){return x.v>=x.max*0.75;}).map(function(x){return x.k;}),weak=r.items.filter(function(x){return x.v<=x.max*0.25;});
 return '<section style="display:flex;flex-direction:column;gap:14px"><div class="sec-head"><h2>二人の関係のテーマ</h2><p>点数の内訳から読む、二人の関係のかたち</p></div><div class="grid">'+
  '<div class="card ak"><span class="eyebrow">心の星座の関係</span><b style="font-size:18px">'+m[0]+'</b><p class="note" style="color:inherit">'+m[1]+'</p></div>'+
  '<div class="card"><span class="eyebrow">ターラ（星宿の巡り）で見た二人</span><b style="font-size:18px">'+JY.TARA[t1][0]+' と '+JY.TARA[t2][0]+'</b><p class="note" style="color:inherit"><b>あなたから見たお相手（'+JY.TARA[t1][0]+'）：</b>'+TM[t1]+'<br><b>お相手から見たあなた（'+JY.TARA[t2][0]+'）：</b>'+TM[t2]+'</p></div></div>'+
  '<div class="grid"><div class="card"><h3>二人の強み</h3><p class="note" style="color:inherit">'+(strong.length?strong.map(function(k){return '<b>'+k+'</b>：'+STR[k];}).join('<br>'):'突出した項目はありませんが、大きな弱点もないバランス型です。')+'</p></div>'+
  '<div class="card"><h3>うまくいくコツ</h3><p class="note" style="color:inherit">'+(weak.length?weak.map(function(x){return '<b>'+x.k+'</b>：'+ADV[x.k];}).join('<br>'):'目立った注意点はありません。今の関係を大切に育ててください。')+'</p></div></div>'+
  '<p class="note">ターラは、自分の星宿から相手の星宿までを数えて、9つの巡りのどこにあたるかを見る方法です。36点の相性の「ターラ」の項目も、この巡りから点数を出しています。</p></section>';}

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
   theme(ma,mb,r,na,nb)+'<div class="grid"><a class="card tool" href="/nakshatra/'+na.slug+'/"><span class="k">あなたの星宿</span><b>'+na.name+'</b><p>性格・恋愛・仕事を読む</p></a><a class="card tool" href="/nakshatra/'+nb.slug+'/"><span class="k">お相手の星宿</span><b>'+nb.name+'</b><p>性格・恋愛・仕事を読む</p></a></div>';
  var mA=JY.mangal(JY.compute(a.ms,a.lat,a.lon),!a.unknown),mB=JY.mangal(JY.compute(b.ms,b.lat,b.lon),!b.unknown),hA=mA.has&&!mA.cancel,hB=mB.has&&!mB.cancel,
    mv=hA&&hB?['よい組み合わせ（釣り合っている）','g','二人ともマンガル・ドーシャを持っています。いまのインドの相性鑑定では、二人とも持っていれば火星の強さが釣り合うため、問題のない組み合わせとして扱うのが一般的です（パラーシャラの古典に書かれた決まりではなく、後の時代に広まった考え方です）。']:
      (hA||hB)?['少し注意の組み合わせ','b',(hA?'あなた':'お相手')+'にだけマンガル・ドーシャがあります。火星の情熱や勢いが、関係の中で強く出やすい組み合わせです。ぶつかったときの冷まし方を二人で決めておくと安心です。ほかの項目の相性がよければ大きな問題ではないとする占い師も多くいます。']:
      ['よい組み合わせ','g',(mA.has||mB.has)?'マンガル・ドーシャはありますが、火星が穏やかに働く位置にあるため、気にしなくてよい組み合わせです。':'二人ともマンガル・ドーシャはありません。'];
  $('res').insertAdjacentHTML('beforeend','<div class="card"><span class="eyebrow">マンガル・ドーシャ（火星の配置）</span><h3><span class="pill '+mv[1]+'">'+mv[0]+'</span></h3><p style="margin:0">'+mv[2]+'</p><p class="note" style="color:inherit"><b>あなた：</b>'+CX.mangalText(mA)+'<br><b>お相手：</b>'+CX.mangalText(mB)+'</p><p class="note">インドで結婚の相性を見るとき、36点の相性とあわせて必ず確かめる配置です。'+((a.unknown||b.unknown)?'時刻がわからない人は、月と金星からだけ見ています。':'')+'</p></div>');
  $('res').insertAdjacentHTML('beforeend',TK.shareHTML('インド式の相性占いで、二人の相性は36点中'+(Math.round(r.total*10)/10)+'点でした。 #月の宿 #インド占星術',location.origin+'/aisho/'));
  st.textContent='相性を表示しています';return true;}
TK.initPlace('a-');TK.initPlace('b-');
$('f').addEventListener('submit',function(e){e.preventDefault();try{if(run())$('res').scrollIntoView({behavior:'smooth'});}catch(err){$('status').textContent='計算できませんでした。入力を確認してください。';}});
TK.ready(function(){try{run();$('status').textContent='サンプル表示中';}catch(e){}});
})();
