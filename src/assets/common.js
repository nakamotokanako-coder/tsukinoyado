var TK=(function(){
var PLACES=[['北海道（札幌）',43.06,141.35],['青森',40.82,140.74],['岩手（盛岡）',39.70,141.15],['宮城（仙台）',38.27,140.87],['秋田',39.72,140.10],['山形',38.24,140.36],['福島',37.75,140.47],['茨城（水戸）',36.34,140.45],['栃木（宇都宮）',36.57,139.88],['群馬（前橋）',36.39,139.06],['埼玉（さいたま）',35.86,139.65],['千葉',35.61,140.12],['東京',35.69,139.69],['神奈川（横浜）',35.45,139.64],['新潟',37.90,139.02],['富山',36.70,137.21],['石川（金沢）',36.59,136.63],['福井',36.07,136.22],['山梨（甲府）',35.66,138.57],['長野',36.65,138.18],['岐阜',35.39,136.72],['静岡',34.98,138.38],['愛知（名古屋）',35.18,136.91],['三重（津）',34.73,136.51],['滋賀（大津）',35.00,135.87],['京都',35.02,135.76],['大阪',34.69,135.52],['兵庫（神戸）',34.69,135.18],['奈良',34.69,135.83],['和歌山',34.23,135.17],['鳥取',35.50,134.24],['島根（松江）',35.47,133.05],['岡山',34.66,133.93],['広島',34.40,132.46],['山口',34.19,131.47],['徳島',34.07,134.56],['香川（高松）',34.34,134.04],['愛媛（松山）',33.84,132.77],['高知',33.56,133.53],['福岡',33.61,130.42],['佐賀',33.25,130.30],['長崎',32.74,129.87],['熊本',32.79,130.74],['大分',33.24,131.61],['宮崎',31.91,131.42],['鹿児島',31.56,130.56],['沖縄（那覇）',26.21,127.68]];
function $(id){return document.getElementById(id);}
function initPlace(p){var sel=$(p+'pl');if(!sel)return;PLACES.forEach(function(x,i){var o=document.createElement('option');o.value=i;o.textContent=x[0];if(x[0]==='東京')o.selected=true;sel.appendChild(o);});
  var o=document.createElement('option');o.value='x';o.textContent='海外・その他（緯度経度を入力）';sel.appendChild(o);
  sel.addEventListener('change',function(){$(p+'custom').hidden=sel.value!=='x';});}
function readBirth(p){var bd=$(p+'bd').value,bt=$(p+'bt').value,unk=$(p+'unk')&&$(p+'unk').checked;
  if(!bd)return {err:'生年月日を入力してください。'};if(!bt&&!unk)return {err:'生まれた時刻を入力するか、「時刻がわからない」にチェックしてください。'};
  if(unk)bt='12:00';var a=bd.split('-').map(Number),b=bt.split(':').map(Number),sel=$(p+'pl'),lat,lon,tz=9,place;
  if(sel.value==='x'){lat=+$(p+'la').value;lon=+$(p+'lo').value;tz=+$(p+'tz').value;place='緯度'+lat+'／経度'+lon;if(!isFinite(lat)||!isFinite(lon)||Math.abs(lat)>66)return {err:'緯度・経度を確認してください（緯度は66度以内）。'};}
  else{var x=PLACES[+sel.value];lat=x[1];lon=x[2];place=x[0];}
  return {ms:Date.UTC(a[0],a[1]-1,a[2],b[0],b[1])-tz*36e5,lat:lat,lon:lon,tz:tz,place:place,unknown:!!unk,label:a[0]+'年'+a[1]+'月'+a[2]+'日'+(unk?'（時刻不明）':' '+bt)+' '+place,y:a[0],m:a[1],d:a[2],dayStart:Date.UTC(a[0],a[1]-1,a[2])-tz*36e5};}
function moonNakRange(b){var s=Math.floor(JY.moonSid(b.dayStart)/(40/3)),e=Math.floor(JY.moonSid(b.dayStart+864e5-6e4)/(40/3));return s===e?null:[s,e];}
function jst(ms,withDay){var d=new Date(ms+9*36e5);return (withDay?(d.getUTCMonth()+1)+'月'+d.getUTCDate()+'日 ':'')+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');}
function ym(ms){var d=new Date(ms+9*36e5);return d.getUTCFullYear()+'年'+(d.getUTCMonth()+1)+'月';}
function ymd(ms){var d=new Date(ms+9*36e5);return d.getUTCFullYear()+'年'+(d.getUTCMonth()+1)+'月'+d.getUTCDate()+'日';}
var SHORT=['牡羊','牡牛','双子','蟹','獅子','乙女','天秤','蠍','射手','山羊','水瓶','魚'],LAYOUT=[11,0,1,2,10,null,null,3,9,null,null,4,8,7,6,5];
/* 北インド式（ダイヤ型）：ハウスが固定、星座の番号が回る */
var NC=[[50,24],[25,9],[9,25],[25,50],[9,75],[25,91],[50,76],[75,91],[91,75],[75,50],[91,25],[75,9]];
function getStyle(){try{return localStorage.getItem('tsuki-style')||'s';}catch(e){return 's';}}
function setStyle(v){try{localStorage.setItem('tsuki-style',v);}catch(e){}}
function north(cells,asc,label){var h='<div class="ni"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x=".5" y=".5" width="99" height="99"/><path d="M0 0L100 100M100 0L0 100M50 0L100 50L50 100L0 50Z"/></svg>';
  for(var k=0;k<12;k++){var sg=(asc+k)%12,c=NC[k],tri=[1,2,4,5,7,8,10,11].indexOf(k)>=0;
    h+='<div class="nh'+(tri?' t':'')+(k===0?' lag':'')+'" style="left:'+c[0]+'%;top:'+c[1]+'%"><span class="sg">'+(sg+1)+'</span><span class="pl">'+(cells[sg]||[]).join('')+'</span></div>';}
  return h+'<span class="nlab">'+label.replace(/<br>/g,' ')+'</span></div>';}
function grid(cells,ascSign,label){if(ascSign>=0&&getStyle()==='n')return north(cells,ascSign,label);var h='<div class="si">';LAYOUT.forEach(function(s,i){if(s===null){if(i===5)h+='<div class="ctr">'+label+'</div>';return;}
  h+='<div class="'+(s===ascSign?'lag':'')+'"><span class="sg">'+SHORT[s]+'</span><span class="pl">'+(cells[s]||[]).join('')+'</span></div>';});return h+'</div>';}
var TARA_T=[
 {r:'n',tag:'自分を整える日',all:'意識が自分自身に向かう日です。新しいことを始めるより、心と体を整え、自分の軸を確かめるのに向いています。',love:'自分の本当の気持ちを、ゆっくり見つめてみて。',work:'無理な勝負は避けて、足元を固めましょう。'},
 {r:'g',tag:'実りと豊かさの日',all:'これまでの努力が形になりやすい、豊かさの日です。お金や仕事の流れも上向きです。',love:'うれしい連絡や、楽しい時間に恵まれやすい日。',work:'提案や交渉、売り込みに向いています。'},
 {r:'b',tag:'つまずきに注意の日',all:'小さな行き違いや予定のずれが起きやすい日です。詰め込みすぎず、確認をていねいに。',love:'早合点は禁物。言葉は少しやわらかめに。',work:'見直しと確認でミスを防げます。'},
 {r:'g',tag:'穏やかに満ちる日',all:'安定して、心が落ち着く日です。いつもの暮らしをていねいに過ごすほど、運が整います。',love:'安心できる人と過ごすと、心が満たされます。',work:'コツコツ進める作業がはかどります。'},
 {r:'b',tag:'無理をしない日',all:'反対や障害にあいやすい日です。強引に進めず、相手の立場を考えると流れがよくなります。',love:'張り合わず、一歩引くとうまくいきます。',work:'大きな決断は、別の日に回すのが安心です。'},
 {r:'g',tag:'願いが形になる日',all:'目標に向かって進みやすく、努力が成果につながる日です。やりたかったことに手をつけて。',love:'思いを伝えるなら、今日がチャンス。',work:'仕上げや締め切りに強い一日です。'},
 {r:'b',tag:'休息を大切にする日',all:'疲れがたまりやすく、慎重に過ごしたい日です。大きな出費や新しい契約は控えめにして、心と体を休めましょう。',love:'深刻な話し合いは、また今度に。',work:'守りに徹すると、損をしません。'},
 {r:'g',tag:'人の縁に恵まれる日',all:'友人や仲間からの助けが入りやすい日です。人と会う予定が運を運んできます。',love:'紹介や、思いがけない出会いに期待できます。',work:'チームで動くと成果が上がります。'},
 {r:'g',tag:'最良の縁の日',all:'信頼できる人との絆が深まり、物事がなめらかに進む日です。大切な人に連絡してみて。',love:'関係が一段深まるチャンスです。',work:'協力者を得て、大きく前進できます。'}];
var DT={ケートゥ:'手放しと内省の時期。執着を切り、精神性が深まります。',金星:'愛・豊かさ・美の時期。人間関係や楽しみが広がります。',太陽:'自立と名誉の時期。自分の軸を立て、表に出ていきます。',月:'心と人とのつながりの時期。家庭や感情が中心になります。',火星:'行動と挑戦の時期。エネルギーが高く、勝負に出られます。',ラーフ:'変化と拡大の時期。新しい世界や、予想外の展開が訪れます。',木星:'知恵と幸運の時期。学び、成長し、守られます。',土星:'忍耐と構築の時期。時間をかけて、確かな土台を築きます。',水星:'知性と発信の時期。学び、言葉、商いが動きます。'};
function saveNak(i){try{localStorage.setItem('tsuki-nak',String(i));}catch(e){}}
function loadNak(){try{var v=localStorage.getItem('tsuki-nak');return v===null?null:+v;}catch(e){return null;}}
function shareHTML(text,url){url=url||location.href.split('#')[0];var e=encodeURIComponent,u=e(url),t=e(text);
  return '<div class="share"><span class="share-l">シェアする</span>'+
  '<a class="sh x" href="https://twitter.com/intent/tweet?text='+t+'&url='+u+'" target="_blank" rel="noopener">X</a>'+
  '<a class="sh th" href="https://www.threads.net/intent/post?text='+e(text+' '+url)+'" target="_blank" rel="noopener">Threads</a>'+
  '<a class="sh ln" href="https://social-plugins.line.me/lineit/share?url='+u+'&text='+t+'" target="_blank" rel="noopener">LINE</a>'+
  '<a class="sh fb" href="https://www.facebook.com/sharer/sharer.php?u='+u+'" target="_blank" rel="noopener">Facebook</a>'+
  '<a class="sh hb" href="https://b.hatena.ne.jp/entry/'+url.replace(/^https?:\/\//,'').replace(/^/,url.indexOf('https')===0?'s/':'')+'" target="_blank" rel="noopener">はてブ</a>'+
  '<button type="button" class="sh cp" data-copy="'+(text+' '+url).replace(/"/g,'&quot;')+'">リンクをコピー</button></div>';}
/* 生年月日を「年・月・日」の3つの選択欄にする（カレンダー式は年月を選ぶと閉じてしまうため） */
function enhanceDates(root){(root||document).querySelectorAll('input[type=date]').forEach(function(inp){
  var id=inp.id,v=inp.value,a=v?v.split('-').map(Number):[null,null,null],w=document.createElement('span');w.className='dsel';
  function sel(suf,lab,from,to,cur,desc){var o='<option value="">'+lab+'</option>',i;if(desc){for(i=to;i>=from;i--)o+='<option value="'+i+'"'+(i===cur?' selected':'')+'>'+i+'</option>';}else{for(i=from;i<=to;i++)o+='<option value="'+i+'"'+(i===cur?' selected':'')+'>'+i+'</option>';}
    return '<select id="'+id+suf+'" aria-label="'+lab+'">'+o+'</select><span class="du">'+lab+'</span>';}
  var thisY=new Date().getFullYear();
  w.innerHTML=sel('-y','年',1900,thisY,a[0],true)+sel('-m','月',1,12,a[1])+sel('-d','日',1,31,a[2]);
  inp.type='hidden';inp.parentNode.insertBefore(w,inp.nextSibling);
  var lab=document.querySelector('label[for="'+id+'"]');if(lab)lab.setAttribute('for',id+'-y');
  var Y=w.children[0],M=w.children[2],D=w.children[4];
  function sync(){var y=+Y.value,m=+M.value,n=y&&m?new Date(y,m,0).getDate():31;
    Array.prototype.forEach.call(D.options,function(o){if(o.value)o.disabled=+o.value>n;});if(+D.value>n)D.value=String(n);
    var nv=Y.value&&M.value&&D.value?y+'-'+String(m).padStart(2,'0')+'-'+String(+D.value).padStart(2,'0'):'';
    if(nv!==inp.value){inp.value=nv;inp.dispatchEvent(new Event('change',{bubbles:true}));}}
  [Y,M,D].forEach(function(s){s.addEventListener('change',function(e){e.stopPropagation();sync();});});sync();});}
enhanceDates();
/* ページ間の受け渡し：生年月日などはURLに載せず、このタブの sessionStorage だけで渡す */
function formData(p){var g=function(k){var e=$(p+k);return e?e.value:'';};return {bd:g('bd'),bt:g('bt'),unk:!!($(p+'unk')&&$(p+'unk').checked),pl:g('pl'),la:g('la'),lo:g('lo'),tz:g('tz')};}
function handTo(url,data){try{sessionStorage.setItem('nv-hand',JSON.stringify(data));}catch(e){}location.href=url;}
function takeHand(p){var d=null;try{d=JSON.parse(sessionStorage.getItem('nv-hand')||'null');sessionStorage.removeItem('nv-hand');}catch(e){}if(!d||!d.bd)return null;
  var set=function(k,v){var e=$(p+k);if(e&&v!==undefined&&v!==null&&(v!==''||k==='bt'))e.value=v;};
  set('bd',d.bd);var a=d.bd.split('-').map(Number);if($(p+'bd-y')){$(p+'bd-y').value=String(a[0]);$(p+'bd-m').value=String(a[1]);$(p+'bd-d').value=String(a[2]);$(p+'bd-d').dispatchEvent(new Event('change'));}
  set('bt',d.bt||'');if($(p+'unk'))$(p+'unk').checked=!!d.unk;
  if(d.pl!==undefined&&d.pl!==''&&$(p+'pl')){set('pl',d.pl);$(p+'custom')&&($(p+'custom').hidden=d.pl!=='x');}
  set('la',d.la);set('lo',d.lo);set('tz',d.tz);
  d.complete=!!(d.bd&&(d.bt||d.unk));return d;}
function ready(fn){if(window.Astronomy&&window.JY)fn();else setTimeout(function(){ready(fn);},80);}
return {formData:formData,handTo:handTo,takeHand:takeHand,getStyle:getStyle,setStyle:setStyle,enhanceDates:enhanceDates,shareHTML:shareHTML,PLACES:PLACES,$:$,initPlace:initPlace,readBirth:readBirth,moonNakRange:moonNakRange,jst:jst,ym:ym,ymd:ymd,grid:grid,TARA_T:TARA_T,DT:DT,saveNak:saveNak,loadNak:loadNak,ready:ready};
})();
