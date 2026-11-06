/* 月の宿 計算エンジン（ラーヒリー／ホールサイン）。Astronomy Engine (MIT) を使用 */
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

  return {relation:relation,yogas:yogas,SIGNS:SIGNS,NK:NK,NKSLUG:NKSLUG,DL:DL,compute:compute,dasha:dasha,sadeSati:sadeSati,varga:varga,dignity:dignity,nak:nak,moonSid:moonSid,tara:tara,TARA:TARA,panchang:panchang,koota:koota,norm:norm};
})();
if(typeof module!=='undefined')module.exports=JY;
