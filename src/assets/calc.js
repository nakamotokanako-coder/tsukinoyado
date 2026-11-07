/* インド占星術ナヴァラトナ 計算エンジン（ラーヒリー／ホールサイン）。Astronomy Engine (MIT) を使用 */
var JY = (function(){
  var SIGNS=['牡羊座','牡牛座','双子座','蟹座','獅子座','乙女座','天秤座','蠍座','射手座','山羊座','水瓶座','魚座'];
  var NK=['アシュヴィニー','バラニー','クリッティカー','ローヒニー','ムリガシラー','アールドラー','プナルヴァス','プシュヤ','アーシュレーシャー','マガー','プールヴァ・パールグニー','ウッタラ・パールグニー','ハスタ','チトラー','スワーティ','ヴィシャーカー','アヌラーダー','ジェーシュター','ムーラ','プールヴァ・アーシャーダー','ウッタラ・アーシャーダー','シュラヴァナ','ダニシュター','シャタビシャー','プールヴァ・バードラパダー','ウッタラ・バードラパダー','レーヴァティー'];
  var NKSLUG='ashvini bharani krittika rohini mrigashira ardra punarvasu pushya ashlesha magha purva-phalguni uttara-phalguni hasta chitra swati vishakha anuradha jyeshtha mula purva-ashadha uttara-ashadha shravana dhanishta shatabhisha purva-bhadrapada uttara-bhadrapada revati'.split(' ');
  var DL=['ケートゥ','金星','太陽','月','火星','ラーフ','木星','土星','水星'], DY=[7,20,6,10,7,18,16,19,17];
  var PL=[['太陽','Sun','日'],['月','Moon','月'],['火星','Mars','火'],['水星','Mercury','水'],['木星','Jupiter','木'],['金星','Venus','金'],['土星','Saturn','土']];
  var EX={太陽:0,月:1,火星:9,水星:5,木星:3,金星:11,土星:6};
  var OWN={太陽:[4],月:[3],火星:[0,7],水星:[2,5],木星:[8,11],金星:[1,6],土星:[9,10]};
  var LORD=['火星','金星','水星','月','太陽','水星','金星','火星','木星','土星','土星','木星'];
  function norm(x){return ((x%360)+360)%360;}
  function ayan(T){return 23.856704+1.397238*T+0.0045388*T*T;}
  function Tof(t){return t.tt/36525;}
  function trop(name,t){return Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body[name],t,true)).elon;}
  function sid(name,t){return norm(trop(name,t)-ayan(Tof(t)));}
  function mk(ms){return Astronomy.MakeTime(new Date(ms));}
  function dignity(p,s){ if(!(p in EX))return ''; if(s===EX[p])return '高揚'; if(s===(EX[p]+6)%12)return '減衰'; if(OWN[p].indexOf(s)>=0)return '自室'; return ''; }
  function varga(l,D){ var s=Math.floor(l/30),d=l%30,odd=s%2===0,mod=s%3,f=Math.floor;
    switch(D){
    case 1:return s;
    case 2:return odd?(d<15?4:3):(d<15?3:4);
    case 3:return (s+[0,4,8][f(d/10)])%12;
    case 4:return (s+[0,3,6,9][f(d/7.5)])%12;
    case 7:return ((odd?s:s+6)+f(d/(30/7)))%12;
    case 9:return ([0,9,6,3][s%4]+f(d/(10/3)))%12;
    case 10:return ((odd?s:s+8)+f(d/3))%12;
    case 12:return (s+f(d/2.5))%12;
    case 16:return ([0,4,8][mod]+f(d/1.875))%12;
    case 20:return ([0,8,4][mod]+f(d/1.5))%12;
    case 24:return ((odd?4:3)+f(d/1.25))%12;
    case 27:return ([0,3,6,9][s%4]+f(d/(30/27)))%12;
    case 30:return odd?(d<5?0:d<10?10:d<18?8:d<25?2:6):(d<5?1:d<12?5:d<20?11:d<25?9:7);
    case 40:return ((odd?0:6)+f(d/0.75))%12;
    case 45:return ([0,4,8][mod]+f(d/(2/3)))%12;
    case 60:return (s+f(d*2))%12; } }
  function nak(l){var i=Math.floor(l/(40/3));return {i:i,name:NK[i],slug:NKSLUG[i],pada:Math.floor((l%(40/3))/(10/3))+1};}
  function moonSid(ms){return sid('Moon',mk(ms));}
  function compute(ms,lat,lon){
    var t=mk(ms),T=Tof(t),ay=ayan(T),P={};
    PL.forEach(function(x){ var l=sid(x[1],t),r=false;
      if(x[1]!=='Sun'&&x[1]!=='Moon'){var a=sid(x[1],t.AddDays(-0.5)),b=sid(x[1],t.AddDays(0.5));r=(((b-a+540)%360)-180)<0;}
      P[x[0]]={lon:l,retro:r,ab:x[2]}; });
    var Om=125.0445479-1934.1362891*T+0.0020754*T*T+T*T*T/467441;
    P['ラーフ']={lon:norm(Om-ay),retro:false,ab:'ラ'}; P['ケートゥ']={lon:norm(Om-ay+180),retro:false,ab:'ケ'};
    var gast=Astronomy.SiderealTime(t)*15, ramc=(gast+lon)*Math.PI/180, eps=(23.4392911-0.0130042*T)*Math.PI/180, phi=lat*Math.PI/180;
    var asc=norm(Math.atan2(Math.cos(ramc),-(Math.sin(ramc)*Math.cos(eps)+Math.tan(phi)*Math.sin(eps)))*180/Math.PI-ay), A=Math.floor(asc/30);
    Object.keys(P).forEach(function(k){var p=P[k],s=Math.floor(p.lon/30);p.sign=s;p.deg=p.lon%30;p.house=(s-A+12)%12+1;p.nak=nak(p.lon);p.dig=dignity(k,s);});
    var seven=PL.map(function(x){return x[0];}).sort(function(a,b){return (P[b].lon%30)-(P[a].lon%30);});
    ['AK','AmK','BK','MK','PiK','GK','DK'].forEach(function(k,i){P[seven[i]].karaka=k;});
    return {P:P,asc:asc,ascSign:A,ascNak:nak(asc),ak:seven[0]};
  }
  function dasha(birthMs,moonLon){
    var n=Math.floor(moonLon/(40/3)),frac=(moonLon%(40/3))/(40/3),i=n%9,Y=365.25*864e5,start=birthMs-frac*DY[i]*Y,out=[];
    for(var k=0;k<18;k++){var L=(i+k)%9,dur=DY[L]*Y,subs=[],s2=start;
      for(var j=0;j<9;j++){var L2=(L+j)%9,d2=dur*DY[L2]/120;subs.push({lord:DL[L2],start:s2,end:s2+d2});s2+=d2;}
      out.push({lord:DL[L],start:start,end:start+dur,subs:subs});start+=dur; if(start>birthMs+110*Y)break;}
    return out;
  }
  function satSign(ms){return Math.floor(sid('Saturn',mk(ms))/30);}
  function sadeSati(fromMs,moonSign,years){
    var zone=[(moonSign+11)%12,moonSign,(moonSign+1)%12],DAY=864e5,step=4*DAY,end=fromMs+years*365.25*DAY,per=[],inside=false,st=null,lastOut=null;
    function inz(ms){return zone.indexOf(satSign(ms))>=0;}
    var prev=inz(fromMs); if(prev){inside=true;st=fromMs;}
    for(var ms=fromMs+step;ms<=end;ms+=step){var cur=inz(ms);
      if(cur!==prev){var x=ms-step;while(inz(x)===prev&&x<ms)x+=DAY;
        if(cur){ if(lastOut!==null&&x-lastOut<400*DAY){per.pop();} else {st=x;} inside=true; }
        else {inside=false;lastOut=x;per.push({start:st,end:x,fromStart:st===fromMs});}
        prev=cur;}}
    if(inside)per.push({start:st,end:null,fromStart:st===fromMs});
    return per;
  }
  /* ---- 今日の運勢：ターラ ---- */
  var TARA=[['ジャンマ','命'],['サンパット','栄'],['ヴィパット','衰'],['クシェーマ','安'],['プラティヤク','危'],['サーダナ','成'],['ナイダナ','壊'],['ミトラ','友'],['パラマ・ミトラ','親']];
  function tara(birthNak,todayNak){var n=((todayNak-birthNak+27)%27);return n%9;}
  /* ---- 暦 ---- */
  var TITHI=['プラティパダー','ドゥヴィティーヤー','トリティーヤー','チャトゥルティー','パンチャミー','シャシュティー','サプタミー','アシュタミー','ナヴァミー','ダシャミー','エーカーダシー','ドゥヴァーダシー','トラヨーダシー','チャトゥルダシー'];
  var YOGA=['ヴィシュカンバ','プリーティ','アーユシュマーン','サウバーギャ','ショーバナ','アティガンダ','スカルマ','ドゥリティ','シューラ','ガンダ','ヴリッディ','ドゥルヴァ','ヴィヤーガータ','ハルシャナ','ヴァジュラ','シッディ','ヴィヤティーパータ','ヴァリーヤーン','パリガ','シヴァ','シッダ','サーディヤ','シュバ','シュクラ','ブラフマ','インドラ','ヴァイドゥリティ'];
  var VARA=[['日曜日','太陽'],['月曜日','月'],['火曜日','火星'],['水曜日','水星'],['木曜日','木星'],['金曜日','金星'],['土曜日','土星']];
  var RAHU_SEG=[8,2,7,5,6,4,3];
  function nextChange(ms,fn,maxH){ // fn(ms)->int ; find time when it changes (minute precision)
    var v=fn(ms),H=36e5,t=ms;for(var h=1;h<=maxH;h++){if(fn(ms+h*H)!==v){var lo=ms+(h-1)*H,hi=ms+h*H;while(hi-lo>6e4){var mid=(lo+hi)/2;if(fn(mid)===v)lo=mid;else hi=mid;}return hi;}}return null;}
  function panchang(ms,lat,lon,tzHours){
    var t=mk(ms),sun=trop('Sun',t),moon=trop('Moon',t),el=norm(moon-sun),ti=Math.floor(el/12);
    var T=Tof(t),ay=ayan(T),ys=norm(sun-ay+moon-ay),yo=Math.floor(ys/(40/3));
    var mnak=nak(norm(moon-ay));
    var local=new Date(ms+tzHours*36e5),wd=local.getUTCDay();
    var dayStart=Date.UTC(local.getUTCFullYear(),local.getUTCMonth(),local.getUTCDate())-tzHours*36e5;
    var obs=new Astronomy.Observer(lat,lon,0),rise=null,set=null;
    try{var r=Astronomy.SearchRiseSet(Astronomy.Body.Sun,obs,+1,mk(dayStart),1);if(r){rise=r.date.getTime();var s=Astronomy.SearchRiseSet(Astronomy.Body.Sun,obs,-1,r,1);if(s)set=s.date.getTime();}}catch(e){}
    var rahu=null;if(rise&&set){var seg=(set-rise)/8,k=RAHU_SEG[wd]-1;rahu={start:rise+seg*k,end:rise+seg*(k+1)};}
    var tithiName=ti===14?'プールニマー（満月）':ti===29?'アマーヴァーシャー（新月）':TITHI[ti%15];
    return {tithi:ti+1,paksha:ti<15?'シュクラ・パクシャ（満ちていく月）':'クリシュナ・パクシャ（欠けていく月）',tithiName:tithiName,
      tithiEnd:nextChange(ms,function(m){var tt=mk(m);return Math.floor(norm(trop('Moon',tt)-trop('Sun',tt))/12);},30),
      nak:mnak,nakEnd:nextChange(ms,function(m){return Math.floor(moonSid(m)/(40/3));},30),
      yoga:YOGA[yo],vara:VARA[wd],rise:rise,set:set,rahu:rahu,moonSign:Math.floor(norm(moon-ay)/30),elong:el};
  }
  /* ---- 相性：アシュタクータ ---- */
  var GANA=[0,1,2,1,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0]; // 0神 1人 2羅刹
  var NADI=[0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2];
  var YONI=[[0,1],[1,1],[2,0],[3,1],[3,0],[4,0],[5,0],[2,1],[5,1],[6,1],[6,0],[7,1],[8,0],[9,0],[8,1],[9,1],[10,0],[10,1],[4,1],[11,1],[12,1],[11,0],[13,0],[0,0],[13,1],[7,0],[1,0]];
  var YONI_N=['馬','象','羊','蛇','犬','猫','鼠','牛','水牛','虎','鹿','猿','マングース','獅子'];
  var YM=[[4,2,2,3,2,2,2,1,0,1,3,3,2,1],[2,4,3,3,2,2,2,2,3,1,2,3,2,0],[2,3,4,2,1,2,1,3,3,1,2,0,3,1],[3,3,2,4,2,1,1,1,1,2,2,2,0,2],[2,2,1,2,4,2,1,2,2,1,0,2,1,1],[2,2,2,1,2,4,0,2,2,1,3,3,2,1],[2,2,1,1,1,0,4,2,2,2,2,2,1,2],[1,2,3,1,2,2,2,4,3,0,3,2,2,1],[0,3,3,1,2,2,2,3,4,1,2,2,2,1],[1,1,1,2,1,1,2,0,1,4,1,1,2,1],[3,2,2,2,0,3,2,3,2,1,4,2,2,1],[3,3,0,2,2,3,2,2,2,1,2,4,3,2],[2,2,3,0,1,2,1,2,2,2,2,3,4,2],[1,0,1,2,1,1,2,1,1,1,1,2,2,4]];
  var VARNA=[1,2,3,0,1,2,3,0,1,2,3,0]; // 0バラモン 1クシャトリヤ 2ヴァイシャ 3シュードラ（牡羊から）
  var VARNA_N=['ブラーフマナ','クシャトリヤ','ヴァイシャ','シュードラ'];
  function vashyaGroup(lon){var s=Math.floor(lon/30),d=lon%30;
    if(s===0||s===1)return 0; if(s===8)return d<15?1:0; if(s===9)return d<15?0:2;
    if(s===2||s===5||s===6||s===10)return 1; if(s===3||s===11)return 2; if(s===4)return 3; return 4;}
  var VASHYA_N=['四足獣','人間','水生','野生','虫'];
  var VM=[[2,1,1,0.5,1],[1,2,0.5,0,1],[1,0.5,2,1,1],[0,0,0,2,0],[1,1,1,0,2]]; // [男][女]
  var NF={太陽:[['月','火星','木星'],['金星','土星']],月:[['太陽','水星'],[]],火星:[['太陽','月','木星'],['水星']],水星:[['太陽','金星'],['月']],木星:[['太陽','月','火星'],['水星','金星']],金星:[['水星','土星'],['太陽','月']],土星:[['水星','金星'],['太陽','月','火星']]};
  function rel(a,b){if(a===b)return 1;return NF[a][0].indexOf(b)>=0?1:NF[a][1].indexOf(b)>=0?-1:0;}
  function koota(mLon,fLon){ // m=男性側, f=女性側の月の恒星黄経
    var mN=Math.floor(mLon/(40/3)),fN=Math.floor(fLon/(40/3)),mS=Math.floor(mLon/30),fS=Math.floor(fLon/30),R=[];
    R.push({k:'ヴァルナ',max:1,v:VARNA[mS]<=VARNA[fS]?1:0,note:'心の格の釣り合い（'+VARNA_N[VARNA[mS]]+'／'+VARNA_N[VARNA[fS]]+'）'});
    R.push({k:'ヴァシャ',max:2,v:VM[vashyaGroup(mLon)][vashyaGroup(fLon)],note:'惹きつけ合う力（'+VASHYA_N[vashyaGroup(mLon)]+'／'+VASHYA_N[vashyaGroup(fLon)]+'）'});
    var t1=((mN-fN+27)%27)%9,t2=((fN-mN+27)%27)%9,bad=[2,4,6];
    R.push({k:'ターラ',max:3,v:(bad.indexOf(t1)>=0?0:1.5)+(bad.indexOf(t2)>=0?0:1.5),note:'運の巡りの相性'});
    var ym=YONI[mN],yf=YONI[fN];R.push({k:'ヨーニ',max:4,v:YM[ym[0]][yf[0]],note:'本能・からだの相性（'+YONI_N[ym[0]]+'／'+YONI_N[yf[0]]+'）'});
    var a=LORD[mS],b=LORD[fS],ra=rel(a,b),rb=rel(b,a),gm=a===b?5:(ra+rb===2?5:ra+rb===1?4:(ra===0&&rb===0)?3:ra+rb===0?1:ra+rb===-1?0.5:0);
    R.push({k:'グラハ・マイトリ',max:5,v:gm,note:'心の友好度（月星座の支配星 '+a+'／'+b+'）'});
    var gM=GANA[mN],gF=GANA[fN],GT=[[6,6,1],[5,6,0],[0,0,6]],GN=['神','人','羅刹'];
    R.push({k:'ガナ',max:6,v:GT[gM][gF],note:'気質の相性（'+GN[gM]+'／'+GN[gF]+'）'});
    var dd=((mS-fS+12)%12)+1,bh=[2,12,5,9,6,8].indexOf(dd)>=0||[2,12,5,9,6,8].indexOf(((fS-mS+12)%12)+1)>=0?0:7;
    R.push({k:'バクート',max:7,v:bh,note:'暮らしと幸福の相性（月星座の位置関係）'});
    var nd=NADI[mN]===NADI[fN]?0:8;R.push({k:'ナーディ',max:8,v:nd,note:'体質・生命力の相性'});
    var total=R.reduce(function(s,x){return s+x.v;},0);
    return {items:R,total:total,mN:mN,fN:fN};
  }
  
  /* ---- ヨーガ判定 ---- */
  function yogas(r){
    var P=r.P,A=r.ascSign,out=[],M=P['月'].sign,SU=P['太陽'].sign,SEV=['太陽','月','火星','水星','木星','金星','土星'],BEN=['木星','金星','水星'];
    function rel(s,from){return (s-from+12)%12;} function kendra(s,from){return [0,3,6,9].indexOf(rel(s,from))>=0;}
    function lordOf(h){return LORD[(A+h-1)%12];} function owns(p,h){return lordOf(h)===p;}
    function add(id,detail,lagna){out.push({id:id,detail:detail,lagna:!!lagna});}
    [['火星','ruchaka'],['水星','bhadra'],['木星','hamsa'],['金星','malavya'],['土星','shasha']].forEach(function(x){var p=P[x[0]];if((p.dig==='高揚'||p.dig==='自室')&&[1,4,7,10].indexOf(p.house)>=0)add(x[1],x[0]+'が'+SIGNS[p.sign]+'（'+p.dig+'）で'+p.house+'室',true);});
    if(kendra(P['木星'].sign,M))add('gajakesari','木星が月から'+(rel(P['木星'].sign,M)+1)+'番目');
    if(P['太陽'].sign===P['水星'].sign)add('budhaditya','太陽と水星が'+SIGNS[SU]);
    if(P['月'].sign===P['火星'].sign)add('chandramangala','月と火星が'+SIGNS[M]);
    BEN.forEach(function(b){if(P[b].house===10)add('amala',b+'がアセンダントから10室',true);else if(rel(P[b].sign,M)===9)add('amala',b+'が月から10番目');});
    var adh=BEN.filter(function(b){return [5,6,7].indexOf(rel(P[b].sign,M))>=0;});if(adh.length>=2)add('adhi',adh.join('・')+'が月から6〜8番目'+(adh.length===3?'（完全形）':''));
    var mo=SEV.filter(function(k){return k!=='太陽'&&k!=='月';}),s2=mo.filter(function(k){return rel(P[k].sign,M)===1;}),s12=mo.filter(function(k){return rel(P[k].sign,M)===11;});
    if(s2.length&&s12.length)add('durudhara','月の前後に'+s12.concat(s2).join('・'));else if(s2.length)add('sunapha',s2.join('・')+'が月から2番目');else if(s12.length)add('anapha',s12.join('・')+'が月から12番目');
    else{var canc=SEV.some(function(k){return k!=='月'&&kendra(P[k].sign,M);})||[1,4,7,10].indexOf(P['月'].house)>=0;if(!canc)add('kemadruma','月の前後に星がない');}
    var so=SEV.filter(function(k){return k!=='太陽'&&k!=='月';}),v2=so.filter(function(k){return rel(P[k].sign,SU)===1;}),v12=so.filter(function(k){return rel(P[k].sign,SU)===11;});
    if(v2.length&&v12.length)add('ubhayachari','太陽の前後に'+v12.concat(v2).join('・'));else if(v2.length)add('vesi',v2.join('・')+'が太陽から2番目');else if(v12.length)add('vasi',v12.join('・')+'が太陽から12番目');
    function link(a,b){if(a===b)return '';if(P[a].sign===P[b].sign)return '同じ星座（'+SIGNS[P[a].sign]+'）';if(OWN[a].indexOf(P[b].sign)>=0&&OWN[b].indexOf(P[a].sign)>=0)return '星座を交換';return '';}
    var seen={};
    [1,4,7,10].forEach(function(k){[1,5,9].forEach(function(t){var a=lordOf(k),b=lordOf(t),l=link(a,b),key='r'+[a,b].sort().join();if(l&&!seen[key]){seen[key]=1;add('rajayoga',k+'室の支配星'+a+'と'+t+'室の支配星'+b+'が'+l,true);}});});
    SEV.forEach(function(p){if(p==='太陽'||p==='月')return;var kk=[4,7,10].filter(function(h){return owns(p,h);}),tt=[5,9].filter(function(h){return owns(p,h);});if(kk.length&&tt.length)add('yogakaraka',p+'が'+kk.concat(tt).join('・')+'室を支配',true);});
    [2,11].forEach(function(w){[1,5,9].forEach(function(t){var a=lordOf(w),b=lordOf(t),l=link(a,b),key='d'+[a,b].sort().join();if(l&&!seen[key]){seen[key]=1;add('dhana',w+'室の支配星'+a+'と'+t+'室の支配星'+b+'が'+l,true);}});});
    for(var i=0;i<7;i++)for(var j=i+1;j<7;j++){var a=SEV[i],b=SEV[j];if(OWN[a].indexOf(P[b].sign)>=0&&OWN[b].indexOf(P[a].sign)>=0)add('parivartana',a+'と'+b+'が星座を交換（'+P[a].house+'室と'+P[b].house+'室）',true);}
    [[6,'harsha'],[8,'sarala'],[12,'vimala']].forEach(function(x){var l=lordOf(x[0]);if([6,8,12].indexOf(P[l].house)>=0)add(x[1],x[0]+'室の支配星'+l+'が'+P[l].house+'室',true);});
    SEV.forEach(function(p){var q=P[p];if(q.dig!=='減衰')return;var disp=LORD[q.sign],exl=LORD[EX[p]],why=[];
      [disp,exl].forEach(function(h){if(!P[h]||h===p)return;if([1,4,7,10].indexOf(P[h].house)>=0)why.push(h+'がアセンダントからケンドラ');else if(kendra(P[h].sign,M))why.push(h+'が月からケンドラ');});
      if(why.length)add('neechabhanga',p+'の減衰を、'+why.join('、')+'で打ち消し');});
    var vg=SEV.concat(['ラーフ','ケートゥ']).filter(function(k){return P[k].sign===varga(P[k].lon,9);});if(vg.length)add('vargottama',vg.join('・')+'がD1とD9で同じ星座');
    var ra=P['ラーフ'].lon,side=SEV.map(function(k){return norm(P[k].lon-ra)<180;});if(side.every(function(x){return x;})||side.every(function(x){return !x;}))add('kalasarpa','7つの星がラーフ・ケートゥ軸の片側');
    return out;
  }

  
  /* ---- 星宿どうしの関係（宿曜の三九の秘法と同じ構造） ---- */
  var ROLE=['命','栄','衰','安','危','成','壊','友','親'];
  function relation(a,b){var d=(b-a+27)%27,t=d%9,u=(27-d)%27%9,type;
    if(d===0)type='命';else if(t===0)type='業胎';else if(t===1||t===8)type='栄親';else if(t===2||t===7)type='友衰';else if(t===3||t===6)type='安壊';else type='危成';
    var aSees=d===0?'命':t===0?(d===9?'業':'胎'):ROLE[t],bSees=d===0?'命':u===0?(d===9?'胎':'業'):ROLE[u];
    return {type:type,aSees:aSees,bSees:bSees,sep:Math.min(d,27-d)};}

  /* ---- 暦・運行のための軽い関数 ---- */
  function sidOf(body,ms){return sid(body,mk(ms));}
  function elong(ms){var t=mk(ms);return norm(trop('Moon',t)-trop('Sun',t));}
  function rahuSid(ms){var T=Tof(mk(ms));return norm(125.0445479-1934.1362891*T+0.0020754*T*T+T*T*T/467441-ayan(T));}
  function signsAt(ms){var o={};PL.forEach(function(x){o[x[0]]=Math.floor(sid(x[1],mk(ms))/30);});var r=Math.floor(rahuSid(ms)/30);o['ラーフ']=r;o['ケートゥ']=(r+6)%12;return o;}
  function sunrise(dayStartUtc,lat,lon){try{var r=Astronomy.SearchRiseSet(Astronomy.Body.Sun,new Astronomy.Observer(lat,lon,0),+1,mk(dayStartUtc),1);return r?r.date.getTime():null;}catch(e){return null;}}
  /* 指定の星が次に星座を移る時刻（逆行の出入りも含む）。stepは日数 */
  function nextIngress(name,ms,maxDays,step){var f=name==='ラーフ'?function(m){return Math.floor(rahuSid(m)/30);}:function(m){return Math.floor(sid(name==='木星'?'Jupiter':name==='土星'?'Saturn':name==='火星'?'Mars':name==='金星'?'Venus':name==='水星'?'Mercury':'Sun',mk(m))/30);};
    var v=f(ms),D=864e5;step=step||2;for(var d=step;d<=maxDays;d+=step){if(f(ms+d*D)!==v){var lo=ms+(d-step)*D,hi=ms+d*D;while(hi-lo>36e5){var mid=(lo+hi)/2;if(f(mid)===v)lo=mid;else hi=mid;}return {ms:hi,to:f(hi)};}}return null;}

  /* ---- アシュタカヴァルガ（パラーシャラの表） 参照順：太陽,月,火星,水星,木星,金星,土星,ラグナ ---- */
  var BAV={
   太陽:[[1,2,4,7,8,9,10,11],[3,6,10,11],[1,2,4,7,8,9,10,11],[3,5,6,9,10,11,12],[5,6,9,11],[6,7,12],[1,2,4,7,8,9,10,11],[3,4,6,10,11,12]],
   月:[[3,6,7,8,10,11],[1,3,6,7,10,11],[2,3,5,6,9,10,11],[1,3,4,5,7,8,10,11],[1,4,7,8,10,11,12],[3,4,5,7,9,10,11],[3,5,6,11],[3,6,10,11]],
   火星:[[3,5,6,10,11],[3,6,11],[1,2,4,7,8,10,11],[3,5,6,11],[6,10,11,12],[6,8,11,12],[1,4,7,8,9,10,11],[1,3,6,10,11]],
   水星:[[5,6,9,11,12],[2,4,6,8,10,11],[1,2,4,7,8,9,10,11],[1,3,5,6,9,10,11,12],[6,8,11,12],[1,2,3,4,5,8,9,11],[1,2,4,7,8,9,10,11],[1,2,4,6,8,10,11]],
   木星:[[1,2,3,4,7,8,9,10,11],[2,5,7,9,11],[1,2,4,7,8,10,11],[1,2,4,5,6,9,10,11],[1,2,3,4,7,8,10,11],[2,5,6,9,10,11],[3,5,6,12],[1,2,4,5,6,7,9,10,11]],
   金星:[[8,11,12],[1,2,3,4,5,8,9,11,12],[3,5,6,9,11,12],[3,5,6,9,11],[5,8,9,10,11],[1,2,3,4,5,8,9,10,11],[3,4,5,8,9,10,11],[1,2,3,4,5,8,9,11]],
   土星:[[1,2,4,7,8,10,11],[3,6,11],[3,5,6,10,11,12],[6,8,9,10,11,12],[5,6,11,12],[6,11,12],[3,5,6,11],[1,3,4,6,10,11]]};
  function ashtakavarga(r){var refs=PL.map(function(x){return r.P[x[0]].sign;}).concat([r.ascSign]),bav={},sav=[0,0,0,0,0,0,0,0,0,0,0,0];
    Object.keys(BAV).forEach(function(p){var row=[0,0,0,0,0,0,0,0,0,0,0,0];BAV[p].forEach(function(hs,k){hs.forEach(function(h){row[(refs[k]+h-1)%12]++;});});bav[p]=row;row.forEach(function(v,i){sav[i]+=v;});});
    return {bav:bav,sav:sav};}
  /* ---- マンガル・ドーシャ ---- */
  function mangal(r,useLagna){var M=r.P['火星'].sign,out=[],H=[1,2,4,7,8,12];
    [['アセンダント',useLagna?r.ascSign:null],['月',r.P['月'].sign],['金星',r.P['金星'].sign]].forEach(function(x){if(x[1]===null)return;var h=(M-x[1]+12)%12+1;if(H.indexOf(h)>=0)out.push({from:x[0],house:h});});
    var cancel=[0,7,9].indexOf(M)>=0?'火星が'+SIGNS[M]+'（'+(M===9?'高揚':'自分の星座')+'）にあり、力が穏やかに働くとされます':'';
    return {has:out.length>0,from:out,cancel:cancel,level:out.length===0?0:cancel?1:out.length};}

  /* ---- ホーラーとチョーガディヤ ---- */
  var CHAL=['太陽','金星','水星','月','土星','木星','火星'],WKL=[0,3,6,2,5,1,4];/* 曜日→CHALの位置 */
  var CHO={太陽:['ウドヴェーガ','不安',0],金星:['チャラ','動き',1],水星:['ラーバ','利益',2],月:['アムリタ','甘露',2],土星:['カーラ','停滞',0],木星:['シュバ','吉祥',2],火星:['ローガ','病',0]};
  function setRise(dayStartUtc,lat,lon){var o=new Astronomy.Observer(lat,lon,0),r=Astronomy.SearchRiseSet(Astronomy.Body.Sun,o,+1,mk(dayStartUtc),1),s=r?Astronomy.SearchRiseSet(Astronomy.Body.Sun,o,-1,r,1):null,n=s?Astronomy.SearchRiseSet(Astronomy.Body.Sun,o,+1,s,1):null;
    return r&&s&&n?{rise:r.date.getTime(),set:s.date.getTime(),next:n.date.getTime()}:null;}
  function timeSlots(dayStartUtc,wd,lat,lon){var t=setRise(dayStartUtc,lat,lon);if(!t)return null;var w=WKL[wd],hora=[],cho=[],i,dl=(t.set-t.rise),nl=(t.next-t.set);
    for(i=0;i<24;i++){var day=i<12,st=day?t.rise+dl/12*i:t.set+nl/12*(i-12);hora.push({lord:CHAL[(w+i)%7],start:st,end:st+(day?dl:nl)/12,day:day});}
    for(i=0;i<16;i++){var d2=i<8,lord=d2?CHAL[(w+i)%7]:CHAL[(w+5+(i-8)*5)%7],s2=d2?t.rise+dl/8*i:t.set+nl/8*(i-8),c=CHO[lord];cho.push({lord:lord,name:c[0],mean:c[1],q:c[2],start:s2,end:s2+(d2?dl:nl)/8,day:d2});}
    return {rise:t.rise,set:t.set,next:t.next,hora:hora,cho:cho};}

  /* ---- シャドバラ（パラーシャラの6種の強さ）。単位はヴィルーパ（60で1ルーパ） ---- */
  var SB7=['太陽','月','火星','水星','木星','金星','土星'],SBEN={太陽:'Sun',月:'Moon',火星:'Mars',水星:'Mercury',木星:'Jupiter',金星:'Venus',土星:'Saturn'};
  var LORD=['火星','金星','水星','月','太陽','水星','金星','火星','木星','土星','土星','木星'];
  var DEB={太陽:190,月:213,火星:118,水星:345,木星:275,金星:177,土星:20};
  var NF={太陽:[['月','火星','木星'],['金星','土星']],月:[['太陽','水星'],[]],火星:[['太陽','月','木星'],['水星']],水星:[['太陽','金星'],['月']],木星:[['太陽','月','火星'],['水星','金星']],金星:[['水星','土星'],['太陽','月']],土星:[['水星','金星'],['太陽','月','火星']]};
  var MT={太陽:[4,0,20],月:[1,3,30],火星:[0,0,12],水星:[5,15,20],木星:[8,0,10],金星:[6,0,15],土星:[10,0,20]};
  var OWN={太陽:[4],月:[3],火星:[0,7],水星:[2,5],木星:[8,11],金星:[1,6],土星:[9,10]};
  var NAIS={太陽:60,月:51.43,金星:42.85,木星:34.28,水星:25.7,火星:17.14,土星:8.57};
  var REQ={太陽:390,月:360,火星:300,水星:420,木星:390,金星:330,土星:300};
  var MEAN={火星:0.524,水星:0.9856,木星:0.0831,金星:0.9856,土星:0.0335};
  function nat(a,b){var f=NF[a];return f[0].indexOf(b)>=0?1:f[1].indexOf(b)>=0?-1:0;}
  function compound(r,a,b){var d=(r.P[b].sign-r.P[a].sign+12)%12+1,t=[2,3,4,10,11,12].indexOf(d)>=0?1:-1,s=nat(a,b)+t;return s;}/* 2大親友 1友 0中立 -1敵 -2大敵 */
  function sputa(d){d=norm(d);if(d<30)return 0;if(d<60)return (d-30)/2;if(d<90)return d-60+15;if(d<120)return (120-d)/2+30;if(d<150)return 150-d;if(d<180)return (d-150)*2;if(d<300)return (300-d)/2;return 0;}
  function special(k,d){d=norm(d);if(k==='火星'&&((d>=90&&d<120)||(d>=210&&d<240)))return 15;if(k==='木星'&&((d>=120&&d<150)||(d>=240&&d<270)))return 30;if(k==='土星'&&((d>=60&&d<90)||(d>=270&&d<300)))return 45;return 0;}
  function shadbala(r,ms,lat,lon){var t=mk(ms),obs=new Astronomy.Observer(lat,lon,0),out={},el=elong(ms),waxing=el<180;
    var ha=Astronomy.HourAngle(Astronomy.Body.Sun,t,obs),fromMid=Math.abs(ha-12)/12;/* 0=真夜中 1=正午 */
    var ds=ms-((ms+9*36e5)%864e5),sl=timeSlotsAt(ms,lat,lon),day=sl&&ms>=sl.rise&&ms<sl.set;
    var JD=ms/864e5+2440587.5,N=Math.floor(JD-588465.5),wdOf=function(n){var jd=588465.5+n;return (Math.floor(jd+1.5))%7;},WL=['太陽','月','火星','水星','木星','金星','土星'];
    var abda=WL[wdOf(N-N%360)],masa=WL[wdOf(N-N%30)],vara=sl?WL[sl.wd]:WL[new Date(ms).getUTCDay()],hora=sl?sl.hora:null;
    var tri=sl?(day?['水星','太陽','土星'][Math.min(2,Math.floor((ms-sl.rise)/((sl.set-sl.rise)/3)))]:['月','金星','火星'][Math.min(2,Math.floor((ms-sl.set)/((sl.next-sl.set)/3)))]):null;
    var pk=(el>180?360-el:el)/3;
    SB7.forEach(function(k){var p=r.P[k],L=p.lon,c={};
      /* 1 位置の強さ */
      var dd=Math.abs(norm(L-DEB[k]));if(dd>180)dd=360-dd;var uc=dd/3,sv=0;
      [1,2,3,7,9,12,30].forEach(function(D){var s=D===1?p.sign:varga(L,D),v;
        if(D===1&&s===MT[k][0]&&p.deg>=MT[k][1]&&p.deg<MT[k][2])v=45;else if(OWN[k].indexOf(s)>=0)v=30;
        else{var lord=LORD[s],cp=lord===k?2:compound(r,k,lord);v=[1.875,3.75,7.5,15,22.5][cp+2];}sv+=v;});
      var odd=function(s){return s%2===0;},fem=(k==='月'||k==='金星'),oj=((fem?!odd(p.sign):odd(p.sign))?15:0)+((fem?!odd(varga(L,9)):odd(varga(L,9)))?15:0);
      var kb=[1,4,7,10].indexOf(p.house)>=0?60:[2,5,8,11].indexOf(p.house)>=0?30:15;
      var dk=Math.floor(p.deg/10),dr=(['太陽','火星','木星'].indexOf(k)>=0&&dk===0)||(['水星','土星'].indexOf(k)>=0&&dk===1)||(fem&&dk===2)?15:0;
      c.sthana=uc+sv+oj+kb+dr;
      /* 2 方角の強さ */
      var weak={太陽:r.asc+90,火星:r.asc+90,木星:r.asc+180,水星:r.asc+180,月:r.asc+270,金星:r.asc+270,土星:r.asc}[k],dg=Math.abs(norm(L-weak));if(dg>180)dg=360-dg;c.dig=dg/3;
      /* 3 時間の強さ */
      var no=k==='水星'?60:(['月','火星','土星'].indexOf(k)>=0?60*(1-fromMid):60*fromMid);
      var ben=['木星','金星','水星'].indexOf(k)>=0||(k==='月'),pb=ben?pk:60-pk;if(k==='月')pb*=2;
      var tb=(k==='木星'||tri===k)?60:0,avm=(abda===k?15:0)+(masa===k?30:0)+(vara===k?45:0)+(hora===k?60:0);
      var eq=Astronomy.Equator(Astronomy.Body[SBEN[k]],t,obs,true,true),dec=eq.dec,ay=(k==='月'||k==='土星')?(24-dec)*60/48:k==='水星'?(24+Math.abs(dec))*60/48:(24+dec)*60/48;if(k==='太陽')ay*=2;
      c.kala=no+pb+tb+avm+ay;
      /* 4 動きの強さ */
      if(k==='太陽')c.chesta=ay/2;else if(k==='月')c.chesta=pk;else{var sp=norm(sid(SBEN[k],t.AddDays(0.5))-sid(SBEN[k],t.AddDays(-0.5))+180)-180,m=MEAN[k],q=sp/m;
        c.chesta=sp<0?60:q<0.1?15:q<0.5?15:q<0.9?30:q<=1.1?7.5:q<1.5?45:30;}
      /* 5 生まれつきの強さ */
      c.nais=NAIS[k];
      /* 6 アスペクトの強さ */
      var dr2=0;SB7.forEach(function(o){if(o===k)return;var d=r.P[k].lon-r.P[o].lon,v=sputa(d)+special(o,d),good=['木星','金星','水星'].indexOf(o)>=0||(o==='月'&&waxing);dr2+=good?v:-v;});c.drik=dr2/4;
      var tot=c.sthana+c.dig+c.kala+c.chesta+c.nais+c.drik;out[k]={c:c,total:tot,rupa:tot/60,ratio:tot/REQ[k]};});
    return out;}
  function timeSlotsAt(ms,lat,lon){var d=new Date(ms+9*36e5),ds=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-9*36e5,wd=d.getUTCDay(),T=timeSlots(ds,wd,lat,lon);
    if(T&&ms<T.rise){ds-=864e5;wd=(wd+6)%7;T=timeSlots(ds,wd,lat,lon);}if(!T)return null;var h=T.hora.filter(function(x){return x.start<=ms&&ms<x.end;})[0];return {rise:T.rise,set:T.set,next:T.next,wd:wd,hora:h?h.lord:null};}

  /* ---- 旧暦（天保暦の方式：朔の日が1日、中気を含む月で月名を決める）と宿曜の本命宿 ---- */
  var SKY=['昴宿','畢宿','觜宿','参宿','井宿','鬼宿','柳宿','星宿','張宿','翼宿','軫宿','角宿','亢宿','氐宿','房宿','心宿','尾宿','箕宿','斗宿','女宿','虚宿','危宿','室宿','壁宿','奎宿','婁宿','胃宿'];
  var SKM=[22,24,26,1,3,5,8,11,13,15,18,20];/* 旧暦1〜12月の1日の宿 */
  function jday(ms){return Math.floor((ms+9*36e5)/864e5);}/* 日本時間の通し日 */
  function newMoonOnOrBefore(ms){var r=Astronomy.SearchMoonPhase(0,mk(ms-31*864e5),35);while(true){var n=Astronomy.SearchMoonPhase(0,r.AddDays(1),35);if(jday(n.date.getTime())>jday(ms))return r.date.getTime();r=n;}}
  function sunTrop(ms){return trop('Sun',mk(ms));}
  function kyureki(y,m,d){var ms=Date.UTC(y,m-1,d,3),J=jday(ms),D=864e5;
    function sol(from){var r=Astronomy.SearchSunLongitude(270,mk(from),190)||Astronomy.SearchSunLongitude(270,mk(from+185*D),200);return r.date.getTime();}
    var S=[sol(ms-385*D)];S.push(sol(S[0]+D));S.push(sol(S[1]+D));
    var a=null;for(var q=0;q<2;q++){var st=newMoonOnOrBefore(S[q]);if(jday(st)<=J)a={st:st,ws:S[q]};}
    var wsN=sol(a.ws+D),endN=jday(newMoonOnOrBefore(wsN)),starts=[jday(a.st)],t=a.st;
    while(true){var n=Astronomy.SearchMoonPhase(0,mk(t+D),35).date.getTime();if(jday(n)>=endN)break;starts.push(jday(n));t=n;}starts.push(endN);
    var cnt=starts.length-1,leapI=-1;
    if(cnt===13){for(var i=1;i<cnt;i++){var la=sunTrop(starts[i]*D-9*36e5),lb=sunTrop(starts[i+1]*D-9*36e5);if(Math.floor(norm(la)/30)===Math.floor(norm(lb)/30)){leapI=i;break;}}}
    var num=11,res=null;for(var k=0;k<cnt;k++){var leap=(k===leapI);if(k>0&&!leap)num=num%12+1;if(J>=starts[k]&&J<starts[k+1])res={m:num,d:J-starts[k]+1,leap:leap};}
    return res||{m:1,d:1,leap:false};}
  function honmei(y,m,d){var k=kyureki(y,m,d),i=(SKM[k.m-1]+k.d-1)%27;return {i:i,name:SKY[i],kyu:k};}

  return {SKY:SKY,kyureki:kyureki,honmei:honmei,shadbala:shadbala,timeSlots:timeSlots,ashtakavarga:ashtakavarga,mangal:mangal,sidOf:sidOf,elong:elong,rahuSid:rahuSid,signsAt:signsAt,sunrise:sunrise,nextIngress:nextIngress,relation:relation,yogas:yogas,SIGNS:SIGNS,NK:NK,NKSLUG:NKSLUG,DL:DL,compute:compute,dasha:dasha,sadeSati:sadeSati,varga:varga,dignity:dignity,nak:nak,moonSid:moonSid,tara:tara,TARA:TARA,panchang:panchang,koota:koota,norm:norm};
})();
if(typeof module!=='undefined')module.exports=JY;
