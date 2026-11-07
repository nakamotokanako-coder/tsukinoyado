/* 今日の運勢ページ：朝30秒で「自分の運勢」と「いまの時間帯」がわかる構成。計算は JY・TK の既存関数とデータだけを使う */
(function(){var $=TK.$,LAT=35.69,LON=139.69;
var CJ={アムリタ:'何を始めるにもよい、いちばんよい時間',シュバ:'お祝いごとや、大切な始めごとによい時間',ラーバ:'仕事・商い・学びを進めるのによい時間',チャラ:'移動や外出によい、ふつうの時間',ウドヴェーガ:'大事な始めごとは避けたい時間',カーラ:'新しいことを始めるのは避けたい時間',ローガ:'大事な始めごとは避け、無理をしない時間'};
var QL=[['注意','b'],['ふつう',''],['よい時間','g']];
var HM={太陽:'公的な用事、目上の人との面会',月:'人に会う、家族や家のこと',火星:'体を動かす、決断する',水星:'勉強、連絡、書類や契約の確認',木星:'学び、相談、お祈り、大事な始めごと',金星:'恋愛、買いもの、美容、楽しみ',土星:'片づけ、地道な作業'};
var TM=['自分を整える','実り・豊かさ','つまずきに注意','穏やか・安定','無理をしない','願いが形になる','休息を大切に','人の縁','最良の縁'];
var st={sel:null,tab:null,userTab:false,lastMin:-1,msg:''};
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function hm(ms){return TK.jst(ms);}
function dkey(ms){var d=new Date(ms+9*36e5);return d.getUTCFullYear()*1e4+(d.getUTCMonth()+1)*100+d.getUTCDate();}
function md(ms){var d=new Date(ms+9*36e5);return (d.getUTCMonth()+1)+'月'+d.getUTCDate()+'日';}
function slotsAt(ms){var d=new Date(ms+9*36e5),ds=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-9*36e5,wd=d.getUTCDay(),T=JY.timeSlots(ds,wd,LAT,LON);if(T&&ms<T.rise)T=JY.timeSlots(ds-864e5,(wd+6)%7,LAT,LON);return T;}
function nextSlots(T){var ms=T.next+60e3,d=new Date(ms+9*36e5),ds=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-9*36e5;return JY.timeSlots(ds,d.getUTCDay(),LAT,LON);}

/* ① 主役カード */
function card(now,p){var el=$('tcard'),mine=TK.loadNak(),i=st.sel;
  if(i===null){el.innerHTML='<div class="tc-empty"><span class="eyebrow">あなたの今日の運勢</span><p class="tc-lead">あなたの星宿（生まれたときの月の星宿）がわかると、ここに今日の運勢が出ます。</p><div class="tc-btns"><a class="btn" href="/#quick">自分の星宿を調べる</a><button type="button" class="ghost" data-pick-open>星宿を選ぶ</button></div><p class="note">生年月日だけで調べられます。一度調べると、このブラウザに記録されます。</p></div>';return;}
  var t=JY.tara(i,p.nak.i),T=TK.TARA_T[t],n=JY.TARA[t],isMine=mine===i;
  el.innerHTML='<div class="tc-head"><img src="/assets/sym/'+JY.NKSLUG[i]+'-s.webp" alt="" width="56" height="56"><div><span class="tc-who">'+(isMine?'あなたの星宿':'選択中の星宿')+'</span><b class="tc-nk">'+JY.NK[i]+'</b></div><button type="button" class="ghost tc-chg" data-pick-open>変更する</button></div>'+
   '<p class="tc-basis">いまの運勢（現在時刻 '+TK.jst(now)+' の月の星宿「'+p.nak.name+'」で判定）</p><h2 class="tc-theme t-'+T.r+'">'+T.tag+'</h2><p class="tc-all">'+T.all+'</p>'+
   '<div class="tc-lw"><div><b>恋愛</b><p>'+T.love+'</p></div><div><b>仕事</b><p>'+T.work+'</p></div></div>'+
   '<details class="tc-tara"><summary>今日は「'+n[0]+'（'+n[1]+'）」の日　<span>くわしく</span></summary><p>生まれた星宿（'+JY.NK[i]+'）から、今日の月の星宿（'+p.nak.name+'）まで数えると'+(t+1)+'番目。9つの巡り（ターラ）のうち「'+n[0]+'」にあたり、「'+TM[t]+'」の日とされます。<a href="#tara-how">ターラのしくみ</a></p></details>'+
   '<p class="tc-next">'+(p.nakEnd?'次の切替：<b>'+TK.jst(p.nakEnd,true)+'</b>（日本時間）。月が次の星宿へ移ると、運勢も変わります。':'')+'</p>'+
   (!isMine&&mine!==null?'<div class="tc-btns"><button type="button" class="ghost" data-show="'+mine+'">あなたの星宿（'+JY.NK[mine]+'）に戻す</button><button type="button" class="ghost" data-save="'+i+'">'+JY.NK[i]+'を私の星宿にする</button></div>':'')+
   (!isMine&&mine===null?'<div class="tc-btns"><button type="button" class="ghost" data-save="'+i+'">'+JY.NK[i]+'を私の星宿にする</button></div>':'')+
   '<p class="tc-link"><a href="/nakshatra/'+JY.NKSLUG[i]+'/">'+JY.NK[i]+'の性格を読む →</a></p>';}

/* ② いまの時間帯 */
function nowSlot(now,T){var el=$('tnow');if(!T){el.innerHTML='<p class="note">時間帯を計算できませんでした。</p>';return;}
  var c=T.cho.filter(function(x){return x.start<=now&&now<x.end;})[0],h=T.hora.filter(function(x){return x.start<=now&&now<x.end;})[0];
  var nx=T.cho.filter(function(x){return x.q===2&&x.start>now;})[0];if(!nx){var T2=nextSlots(T);if(T2)nx=T2.cho.filter(function(x){return x.q===2&&x.start>now;})[0];}
  var same=nx&&dkey(nx.start)===dkey(now);
  el.innerHTML=(c?'<span class="tn-k">いまの時間帯</span><p class="tn-j">'+CJ[c.name]+'</p><p class="tn-t"><b class="num">'+hm(c.start)+'〜'+hm(c.end)+'</b><span>東京基準</span><span class="pill '+QL[c.q][1]+'">'+QL[c.q][0]+'</span></p><p class="tn-n">チョーガディヤ：'+c.name+'（'+c.mean+'）</p>':'')+
   (nx&&(!c||c.q!==2||nx.start>c.end-1)?'<p class="tn-nx">次によい時間帯：<b class="num">'+(same?'':md(nx.start)+' ')+hm(nx.start)+'〜'+hm(nx.end)+'</b>　<small>'+nx.name+'</small></p>':'')+
   (h?'<p class="tn-h"><span class="tn-hk">ホーラー（1時間ごとの星）</span>いまは<b>'+h.lord+'</b>の時間（'+hm(h.start)+'〜'+hm(h.end)+'）：'+HM[h.lord]+'に向きます。</p>':'');}

/* ③ 時間帯一覧（昼／夜の切替） */
function list(now,T){var el=$('tlist');if(!T)return;var isDay=now<T.set;if(!st.userTab)st.tab=isDay?'d':'n';
  var L=T.cho.filter(function(x){return st.tab==='d'?x.day:!x.day;});
  $('tl-d').setAttribute('aria-pressed',st.tab==='d');$('tl-n').setAttribute('aria-pressed',st.tab==='n');
  $('tl-d').textContent='昼（日の出 '+hm(T.rise)+'〜）';$('tl-n').textContent='夜（日の入り '+hm(T.set)+'〜）';
  el.innerHTML=L.map(function(x){var on=x.start<=now&&now<x.end,past=x.end<=now;
    return '<li class="'+(on?'cur':past?'past':'')+'"><span class="tq-t num">'+hm(x.start)+'〜'+(dkey(x.end)!==dkey(x.start)?md(x.end)+' ':'')+hm(x.end)+'</span><span class="tq-j">'+CJ[x.name]+'</span><span class="tq-m"><span class="pill '+QL[x.q][1]+'">'+QL[x.q][0]+'</span><small>'+x.name+'（'+x.mean+'）</small>'+(on?'<span class="pill now">いま</span>':past?'<small class="mut">終了</small>':'')+'</span></li>';}).join('');
  $('thora').innerHTML=T.hora.map(function(x){var on=x.start<=now&&now<x.end;return '<li class="'+(on?'cur':x.end<=now?'past':'')+'"><span class="tq-t num">'+hm(x.start)+'〜'+hm(x.end)+'</span><span class="tq-j"><b>'+x.lord+'</b>：'+HM[x.lord]+'</span>'+(on?'<span class="tq-m"><span class="pill now">いま</span></span>':'')+'</li>';}).join('');}

/* ④ ほかの星宿 */
function others(p){var mine=TK.loadNak(),q=($('nkq').value||'').trim(),n=0,html='';
  for(var i=0;i<27;i++){if(q&&JY.NK[i].indexOf(q)<0)continue;n++;var t=JY.tara(i,p.nak.i),T=TK.TARA_T[t];
    html+='<li class="'+(i===st.sel?'on':'')+'"><div class="ol-n"><b>'+JY.NK[i]+'</b>'+(i===mine?'<span class="pill now">あなた</span>':'')+(i===st.sel&&i!==mine?'<span class="pill">選択中</span>':'')+'</div><span class="ol-t t-'+T.r+'">'+T.tag+'</span><small class="mut">'+JY.TARA[t][0]+'の日</small><div class="ol-a"><button type="button" class="ghost" data-show="'+i+'">今日の運勢を表示</button><a href="/nakshatra/'+JY.NKSLUG[i]+'/">星宿の性格を読む</a></div></li>';}
  $('olist').innerHTML=html;$('oempty').hidden=n>0;}
function pick(p){var good=[],bad=[];for(var j=0;j<27;j++){var tt=JY.tara(j,p.nak.i);if(tt===8||tt===5)good.push(j);if(tt===6)bad.push(j);}
  function chips(a){return a.map(function(j){return '<button type="button" class="chipb" data-show="'+j+'">'+JY.NK[j]+'</button>';}).join('');}
  $('tpick').innerHTML='<div><span class="tp-k">今日とくに運のいい星宿</span><div class="chipw">'+chips(good)+'</div></div><div><span class="tp-k">今日は休息を大切に</span><div class="chipw">'+chips(bad)+'</div></div>';}

/* ⑤ 暦 */
function panch(p){var X=[['曜日','その日を受け持つ星',p.vara[0]+'（'+p.vara[1]+'）'],['月の星宿','月がいま泊まっている星宿','<a href="/nakshatra/'+p.nak.slug+'/">'+p.nak.name+'</a>'+(p.nakEnd?'<small>'+TK.jst(p.nakEnd,true)+'まで</small>':'')],['ティティ','月の満ち欠けで数える日付',p.tithi+'日目・'+p.tithiName+'<small>'+p.paksha+'</small>'],['ヨーガ（暦）','太陽と月の位置から決まる、その日の性質。出生図の「ヨーガ」とは別のものです',p.yoga],['日の出・日の入り','東京基準',(p.rise?hm(p.rise):'—')+' ／ '+(p.set?hm(p.set):'—')],['ラーフ・カーラ','大事な始めごとを避ける時間帯（東京基準）',p.rahu?hm(p.rahu.start)+'〜'+hm(p.rahu.end):'—']];
  var VL=['太陽','月','火星','水星','木星','金星','土星'][new Date(Date.now()+9*36e5).getUTCDay()];X.push(['今日の色と宝石','曜日を受け持つ星（'+VL+'）の伝統的な色と宝石',SR.LUCK[VL].c+'／'+SR.BY[VL].gem]);
  $('tpc').innerHTML=X.map(function(x){return '<div><dt>'+x[0]+'<small>'+x[1]+'</small></dt><dd>'+x[2]+'</dd></div>';}).join('');}

function draw(force){var now=Date.now(),m=Math.floor(now/6e4);if(!force&&m===st.lastMin)return;st.lastMin=m;
  var p=JY.panchang(now,LAT,LON,9),T=slotsAt(now),d=new Date(now+9*36e5);
  $('tdate').textContent=d.getUTCFullYear()+'年'+(d.getUTCMonth()+1)+'月'+d.getUTCDate()+'日（'+p.vara[0].charAt(0)+'）';
  card(now,p);nowSlot(now,T);list(now,T);others(p);pick(p);panch(p);}

function show(i,announce){st.sel=i;draw(true);var c=$('tcard-wrap');c.classList.remove('flash');void c.offsetWidth;c.classList.add('flash');
  if(announce){$('tlive').textContent=JY.NK[i]+'の今日の運勢を表示しました。';c.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){try{c.focus({preventScroll:true});}catch(e){}},400);}}
TK.ready(function(){st.sel=TK.loadNak();draw(true);setInterval(function(){draw(false);},15e3);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)draw(true);});
  $('nkq').addEventListener('input',function(){others(JY.panchang(Date.now(),LAT,LON,9));});
  $('tl-d').addEventListener('click',function(){st.tab='d';st.userTab=true;draw(true);});
  $('tl-n').addEventListener('click',function(){st.tab='n';st.userTab=true;draw(true);});
  document.addEventListener('click',function(e){var t=e.target.closest?e.target:null;if(!t)return;
    var s=t.closest('[data-show]');if(s){show(+s.dataset.show,true);return;}
    var sv=t.closest('[data-save]');if(sv){TK.saveNak(+sv.dataset.save);$('tlive').textContent=JY.NK[+sv.dataset.save]+'をあなたの星宿として記録しました。';draw(true);return;}
    if(t.closest('[data-pick-open]')){var o=$('others');o.open=true;o.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){$('nkq').focus({preventScroll:true});},350);return;}
    if(t.closest('[data-q-clear]')){$('nkq').value='';others(JY.panchang(Date.now(),LAT,LON,9));$('nkq').focus();}});});
})();
