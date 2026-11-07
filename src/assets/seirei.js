/* 宝石の精（9つの星の精）。ブラウザとビルドの両方で使う */
var SR=(function(){
var L=[
 {id:'mani',pl:'太陽',name:'マニ',gem:'ルビー',color:'#C8102E',mark:'太陽の玉',catch:'まっすぐな、みんなのまとめ役',
  char:'まっすぐで、うそがつけない誇り高い精。面倒見がよく、困っている子を放っておけません。ほめられると、光が少し強くなってしまう照れ屋さん。',weak:'がんばりすぎて燃え尽きやすく、人に頼るのが苦手',word:'だいじょうぶ、ここにいるよ'},
 {id:'moti',pl:'月',name:'モティ',gem:'真珠',color:'#C9B8A6',mark:'三日月',catch:'やさしい、甘えん坊の癒し係',
  char:'やさしく、人の気持ちにすぐ気づく精。気分が月のように満ち欠けして、さみしがりなところもあります。',weak:'気分屋で、不安になると丸まってしまう',word:'ぎゅってしていい？'},
 {id:'prava',pl:'火星',name:'プラヴァ',gem:'赤珊瑚',color:'#E0401C',mark:'炎のしずく',catch:'元気いっぱいの切り込み隊長',
  char:'思い立ったらすぐ走り出す、元気な精。負けず嫌いだけど、仲間のためならいちばんに飛び出します。',weak:'せっかちで、よくつまずく',word:'よーし、いってくる！'},
 {id:'panna',pl:'水星',name:'パンナ',gem:'エメラルド',color:'#1E8C45',mark:'若葉',catch:'おしゃべりな物知り',
  char:'頭の回転が速く、おしゃべりで、いたずら好きな精。何でも知りたがり、知ったことはすぐ誰かに話したくなります。',weak:'口がすべって、余計なことまで言ってしまう',word:'ねえねえ、知ってた？'},
 {id:'pushpa',pl:'木星',name:'プシュパ',gem:'イエローサファイア',color:'#D9A400',mark:'空に浮かぶ雲',catch:'おおらかな、みんなの先生',
  char:'おおらかで、みんなの相談役になる精。物知りだけど、えらぶりません。そばにいると、なんとかなる気がしてきます。',weak:'楽天的すぎて、つい食べすぎる',word:'なんとかなるよ、ほんとうに'},
 {id:'hira',pl:'金星',name:'ヒーラ',gem:'ダイヤモンド',color:'#B9A6D8',mark:'明けの明星',catch:'おしゃれな人気者',
  char:'おしゃれで、楽しいことが大好きな精。誰とでもすぐ仲よくなり、まわりをぱっと明るくします。',weak:'ちょっとわがままで、ぜいたく好き',word:'きれいでしょ？'},
 {id:'nila',pl:'土星',name:'ニーラ',gem:'ブルーサファイア',color:'#1F3FA8',mark:'体をめぐる土星の輪',catch:'無口な職人',
  char:'無口でまじめな精。ゆっくりだけど、決めたことは必ずやり遂げます。めったに笑わないぶん、笑うとすごくかわいい。',weak:'心配性で、笑うのが苦手',word:'……だいじょうぶ。時間はある'},
 {id:'gome',pl:'ラーフ',name:'ゴメ',gem:'ヘソナイト',color:'#B5521B',mark:'小さな日食',catch:'好奇心のかたまり',
  char:'新しいもの、見たことのないものに目がない精。形も少しいびつで、型にはまらない生き方をしています。',weak:'あれもこれも欲しくなって、落ち着きがない',word:'それ、もっと見せて！'},
 {id:'duri',pl:'ケートゥ',name:'ドゥーリ',gem:'キャッツアイ',color:'#8C8A4E',mark:'流れ星の尾',catch:'ふしぎな夢見る子',
  char:'ぼんやりしているようで、本当のことを見抜く、ふしぎな精。欲がなく、目に見えないものの声を聞いています。',weak:'ぼーっとして、置いていかれる',word:'……いま、なにか聞こえた？'}];
var BY={};L.forEach(function(s){BY[s.pl]=s;});
/* 五大偉人ヨーガの特別な姿（画像がそろったものから） */
var KING={ruchaka:'prava',bhadra:'panna',hamsa:'pushpa',malavya:'hira',shasha:'nila'},KIMG={prava:1,nila:1,panna:1,hira:1,pushpa:1};
function img(id,small){return '/assets/seirei/'+id+(small?'-s':'')+'.webp';}
function king(yid){var id=KING[yid];return id&&KIMG[id]?id+'_k':null;}
function card(pl,opt){opt=opt||{};var s=BY[pl];if(!s)return '';
  return '<div class="card seirei"><img src="'+img(opt.k||s.id,true)+'" alt="'+s.gem+'の精 '+s.name+'" width="128" height="128" loading="lazy"><div><span class="eyebrow">'+(opt.label||'あなたを守る宝石の精')+'</span><b class="sname">'+s.name+'</b><span class="note">'+s.gem+'の精・'+s.pl+'</span><p class="note" style="color:inherit;margin:4px 0 0">'+(opt.text||s.catch+'。'+s.char)+'</p><a href="/seirei/#'+s.id+'" class="note">ナヴァラトナ →</a></div></div>';}
return {L:L,BY:BY,KING:KING,img:img,king:king,card:card};
})();
if(typeof module!=='undefined')module.exports=SR;
