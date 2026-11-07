/* 宝石の精霊（9つの星の精霊）。ブラウザとビルドの両方で使う */
var SR=(function(){
var L=[
 {id:'mani',pl:'太陽',name:'マニ',gem:'ルビー',color:'#C8102E',mark:'太陽の玉',catch:'まっすぐな、みんなのまとめ役',
  char:'まっすぐで、うそがつけない誇り高い精霊。面倒見がよく、困っている子を放っておけません。ほめられると、光が少し強くなってしまう照れ屋さん。',weak:'がんばりすぎて燃え尽きやすく、人に頼るのが苦手',word:'だいじょうぶ、ここにいるよ'},
 {id:'moti',pl:'月',name:'モティ',gem:'真珠',color:'#C9B8A6',mark:'三日月',catch:'やさしい、甘えん坊の癒し係',
  char:'やさしく、人の気持ちにすぐ気づく精霊。気分が月のように満ち欠けして、さみしがりなところもあります。',weak:'気分屋で、不安になると丸まってしまう',word:'ぎゅってしていい？'},
 {id:'prava',pl:'火星',name:'プラヴァ',gem:'赤珊瑚',color:'#E0401C',mark:'炎のしずく',catch:'元気いっぱいの切り込み隊長',
  char:'思い立ったらすぐ走り出す、元気な精霊。負けず嫌いだけど、仲間のためならいちばんに飛び出します。',weak:'せっかちで、よくつまずく',word:'よーし、いってくる！'},
 {id:'panna',pl:'水星',name:'パンナ',gem:'エメラルド',color:'#1E8C45',mark:'若葉',catch:'おしゃべりな物知り',
  char:'頭の回転が速く、おしゃべりで、いたずら好きな精霊。何でも知りたがり、知ったことはすぐ誰かに話したくなります。',weak:'口がすべって、余計なことまで言ってしまう',word:'ねえねえ、知ってた？'},
 {id:'pushpa',pl:'木星',name:'プシュパ',gem:'イエローサファイア',color:'#D9A400',mark:'空に浮かぶ雲',catch:'おおらかな、みんなの先生',
  char:'おおらかで、みんなの相談役になる精霊。物知りだけど、えらぶりません。そばにいると、なんとかなる気がしてきます。',weak:'楽天的すぎて、つい食べすぎる',word:'なんとかなるよ、ほんとうに'},
 {id:'hira',pl:'金星',name:'ヒーラ',gem:'ダイヤモンド',color:'#B9A6D8',mark:'明けの明星',catch:'おしゃれな人気者',
  char:'おしゃれで、楽しいことが大好きな精霊。誰とでもすぐ仲よくなり、まわりをぱっと明るくします。',weak:'ちょっとわがままで、ぜいたく好き',word:'きれいでしょ？'},
 {id:'nila',pl:'土星',name:'ニーラ',gem:'ブルーサファイア',color:'#1F3FA8',mark:'体をめぐる土星の輪',catch:'無口な職人',
  char:'無口でまじめな精霊。ゆっくりだけど、決めたことは必ずやり遂げます。めったに笑わないぶん、笑うとすごくかわいい。',weak:'心配性で、笑うのが苦手',word:'……だいじょうぶ。時間はある'},
 {id:'gome',pl:'ラーフ',name:'ゴメ',gem:'ヘソナイト',color:'#B5521B',mark:'小さな日食',catch:'好奇心のかたまり',
  char:'新しいもの、見たことのないものに目がない精霊。形も少しいびつで、型にはまらない生き方をしています。',weak:'あれもこれも欲しくなって、落ち着きがない',word:'それ、もっと見せて！'},
 {id:'duri',pl:'ケートゥ',name:'ドゥーリ',gem:'キャッツアイ',color:'#8C8A4E',mark:'流れ星の尾',catch:'ふしぎな夢見る子',
  char:'ぼんやりしているようで、本当のことを見抜く、ふしぎな精霊。欲がなく、目に見えないものの声を聞いています。',weak:'ぼーっとして、置いていかれる',word:'……いま、なにか聞こえた？'}];
var BY={};L.forEach(function(s){BY[s.pl]=s;});
/* 9つの星の伝統的な対応：色（パラーシャラの古典に描かれる星の色）・曜日・宝石（ナヴァラトナ） */
var LUCK={太陽:{c:'赤・銅色',hex:['#B23A2B','#B87333'],d:'日曜日'},月:{c:'白',hex:['#F4F1EA'],d:'月曜日'},火星:{c:'赤',hex:['#C8102E'],d:'火曜日'},水星:{c:'緑',hex:['#2E8B57'],d:'水曜日'},木星:{c:'黄・金色',hex:['#E0B21B','#C9A227'],d:'木曜日'},金星:{c:'白・淡い色',hex:['#F7F3F0','#E9D9EE'],d:'金曜日'},土星:{c:'黒・濃い青',hex:['#1F2340','#1F3FA8'],d:'土曜日'},ラーフ:{c:'煙のような灰色',hex:['#7C7A80'],d:''},ケートゥ:{c:'まだらの灰色',hex:['#9A9580','#6E6A5C'],d:''}};
function luck(pl,opt){opt=opt||{};var s=BY[pl],k=LUCK[pl];if(!s||!k)return '';
  return '<div class="luck" style="--sc:'+s.color+'"><span class="luck-sw">'+k.hex.map(function(h){return '<i style="background:'+h+'"></i>';}).join('')+'</span><div class="luck-b">'+(opt.role?'<span class="luck-r">'+opt.role+'</span>':'')+'<b>'+pl+'</b><dl><div><dt>色</dt><dd>'+k.c+'</dd></div><div><dt>宝石</dt><dd>'+s.gem+'</dd></div>'+(k.d?'<div><dt>曜日</dt><dd>'+k.d+'</dd></div>':'')+'</dl></div></div>';}
/* 星を大切にする過ごし方：インドで伝統的に行われてきた星の習慣（ウパーヤ：施し・敬う相手・心がけ）をもとに、日常の言葉にしたもの */
var ACT={太陽:['朝日を浴びて、一日を始める','父や目上の人に、感謝を伝える','日曜日に、小麦や赤いものを人に分ける'],
 月:['母や、家族に連絡をする','月曜日に、お米や白いものを人に分ける','水辺や夜空を眺めて、心を静める'],
 火星:['体を動かして、汗をかく','兄弟姉妹や仲間の力になる','火曜日に、赤い豆などを人に分ける'],
 水星:['本を読む・書く・学ぶ時間をとる','年下の人や学生の手助けをする','水曜日に、緑の野菜や豆を人に分ける。植物を育てる'],
 木星:['先生や恩人に、感謝を伝える','学んだことを、人に分かち合う','木曜日に、黄色いもの（豆・ターメリックなど）を人に分ける'],
 金星:['身の回りや部屋を、美しく整える','パートナーや身近な女性を大切にする','金曜日に、お砂糖やお米など白いものを人に分ける'],
 土星:['年配の人や、働く人の手助けをする','約束と時間を守り、こつこつ続ける','土曜日に、黒ごまなど黒いものを人に分ける'],
 ラーフ:['習慣を見直し、やめたいことを一つ減らす','困っている人や、弱い立場の人を助ける','思い込みを手放し、新しい人の話を聞く'],
 ケートゥ:['静かな時間をとり、心を落ち着ける','いらなくなったものを手放す','動物、とくに犬を大切にする']};
function acts(pl,opt){opt=opt||{};var s=BY[pl],a=ACT[pl];if(!s||!a)return '';
  return '<div class="luck" style="--sc:'+s.color+'"><img class="luck-im" src="'+img(s.id,true)+'" alt="" width="56" height="56" loading="lazy"><div class="luck-b">'+(opt.role?'<span class="luck-r">'+opt.role+'</span>':'')+'<b>'+pl+'の過ごし方</b><ul>'+a.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'+(opt.full?'<p class="luck-m">ゆかりの宝石：'+s.gem+(LUCK[pl].d?'／'+LUCK[pl].d+'の星':'')+'</p>':'')+'</div></div>';}
var ACTNOTE='インドでは、星を味方につけるために、その星ゆかりの曜日に施しをしたり、星が表す人を敬ったりする習慣（ウパーヤ）が伝えられてきました。ここでは、その伝統を日常で取り入れやすい形にしています。効果をうたうものではありません。';
var LUCKNOTE='色・宝石・曜日は、インド占星術で9つの星に伝統的に結びつけられてきたものです。伝統では、宝石を身につけるかどうかは出生図全体を見て判断するもので、このサイトでは宝石の効果をうたっていません。好きな色や小物を選ぶときの、星との縁として楽しんでください。';
/* 五大偉人ヨーガの特別な姿（画像がそろったものから） */
var KING={ruchaka:'prava',bhadra:'panna',hamsa:'pushpa',malavya:'hira',shasha:'nila'},KIMG={prava:1,nila:1,panna:1,hira:1,pushpa:1};
function img(id,small){return '/assets/seirei/'+id+(small?'-s':'')+'.webp';}
function king(yid){var id=KING[yid];return id&&KIMG[id]?id+'_k':null;}
function card(pl,opt){opt=opt||{};var s=BY[pl];if(!s)return '';
  return '<div class="card seirei"><img src="'+img(opt.k||s.id,true)+'" alt="'+s.gem+'の精霊 '+s.name+'" width="128" height="128" loading="lazy"><div><span class="eyebrow">'+(opt.label||'あなたを守る宝石の精霊')+'</span><b class="sname">'+s.name+'</b><span class="note">'+s.gem+'の精霊・'+s.pl+'</span><p class="note" style="color:inherit;margin:4px 0 0">'+(opt.text||s.catch+'。'+s.char)+'</p><a href="/seirei/#'+s.id+'" class="note">ナヴァラトナ →</a></div></div>';}
/* トップの9人：タップで紹介を出す */
function lineup(){var box=document.querySelector('.sr-line[data-tap]');if(!box)return;var pane=document.getElementById('srd');
  box.querySelectorAll('button[data-id]').forEach(function(bt){bt.addEventListener('click',function(){var open=bt.getAttribute('aria-expanded')==='true';
    box.querySelectorAll('button[data-id]').forEach(function(x){x.setAttribute('aria-expanded','false');});
    if(open){pane.hidden=true;return;}bt.setAttribute('aria-expanded','true');var s=L.filter(function(x){return x.id===bt.dataset.id;})[0];
    pane.style.setProperty('--sc',s.color);pane.innerHTML='<img src="'+img(s.id,true)+'" alt="" width="96" height="96"><div><b class="sname">'+s.name+'</b><span class="note">'+s.gem+'の精霊・受け持つ星は'+s.pl+'</span><p style="margin:4px 0 0">'+s.catch+'。「'+s.word+'」</p><a href="/seirei/#'+s.id+'">'+s.name+'のくわしい紹介 →</a></div>';pane.hidden=false;});});}
if(typeof document!=='undefined')(document.readyState==='loading'?document.addEventListener('DOMContentLoaded',lineup):lineup());
return {ACT:ACT,acts:acts,ACTNOTE:ACTNOTE,LUCK:LUCK,luck:luck,LUCKNOTE:LUCKNOTE,L:L,BY:BY,KING:KING,img:img,king:king,card:card};
})();
if(typeof module!=='undefined')module.exports=SR;
