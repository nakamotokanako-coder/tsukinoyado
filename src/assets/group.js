(function(){var $=TK.$,n=0;
var GN=['神','人','羅刹'],GANA=[0,1,2,1,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0];
function opts(){return TK.PLACES.map(function(p,i){return '<option value="'+i+'"'+(p[0]==='東京'?' selected':'')+'>'+p[0]+'</option>';}).join('');}
function addRow(v){v=v||{};if($('rows').children.length>=10)return;var id='g'+(n++),d=document.createElement('div');d.className='grow';d.id=id;
 d.innerHTML='<label for="'+id+'n">名前<input id="'+id+'n" type="text" value="'+(v.n||'')+'" placeholder="例：Aさん"></label><label for="'+id+'d">生年月日<input id="'+id+'d" type="date" value="'+(v.d||'')+'"></label><label for="'+id+'t">時刻（わかれば）<input id="'+id+'t" type="time" value="'+(v.t||'')+'"></label><label for="'+id+'p">出生地<select id="'+id+'p">'+opts()+'</select></label><button type="button" class="x" aria-label="この人を削除">削除</button>';
 d.querySelector('button').addEventListener('click',function(){d.remove();save();});d.addEventListener('change',save);$('rows').appendChild(d);if(v.p!==undefined)$(id+'p').value=v.p;}
function read(){return Array.prototype.map.call($('rows').children,function(d){var id=d.id;return {n:$(id+'n').value.trim(),d:$(id+'d').value,t:$(id+'t').value,p:$(id+'p').value};});}
function save(){try{localStorage.setItem('tsuki-group',JSON.stringify(read()));}catch(e){}}
function colr(v){return v>=24?'g':v<18?'b':'r';}
function run(){var ppl=read().filter(function(x){return x.d;}),st=$('status');if(ppl.length<2){st.textContent='2人以上の生年月日を入力してください。';return false;}
 ppl.forEach(function(x,i){var a=x.d.split('-').map(Number),t=(x.t||'12:00').split(':').map(Number),pl=TK.PLACES[+x.p]||TK.PLACES[12];x.ms=Date.UTC(a[0],a[1]-1,a[2],t[0],t[1])-9*36e5;x.lon=JY.moonSid(x.ms);x.nk=JY.nak(x.lon);x.name=x.n||('メンバー'+(i+1));
  if(!x.t){var ds=Date.UTC(a[0],a[1]-1,a[2])-9*36e5,s=Math.floor(JY.moonSid(ds)/(40/3)),e=Math.floor(JY.moonSid(ds+864e5-6e4)/(40/3));x.amb=s!==e;}});
 var N=ppl.length,M=[],pairs=[];for(var i=0;i<N;i++){M.push([]);for(var j=0;j<N;j++){if(i===j){M[i].push(null);continue;}var v=(JY.koota(ppl[i].lon,ppl[j].lon).total+JY.koota(ppl[j].lon,ppl[i].lon).total)/2;M[i].push(v);if(i<j)pairs.push({a:i,b:j,v:v});}}
 pairs.sort(function(x,y){return y.v-x.v;});
 var avg=ppl.map(function(x,i){var s=0;for(var j=0;j<N;j++)if(j!==i)s+=M[i][j];return s/(N-1);}),hub=avg.indexOf(Math.max.apply(null,avg));
 var gc=[0,0,0];ppl.forEach(function(x){gc[GANA[x.nk.i]]++;});
 var h='<div class="grid"><div class="card ak"><span class="eyebrow">いちばん相性のいい二人</span><b style="font-size:18px">'+ppl[pairs[0].a].name+' × '+ppl[pairs[0].b].name+'</b><p class="note" style="color:inherit">'+(Math.round(pairs[0].v*10)/10)+'点 ／ 36点</p></div>'+
  '<div class="card"><span class="eyebrow">グループの潤滑油</span><b style="font-size:18px">'+ppl[hub].name+'</b><p class="note" style="color:inherit">みんなとの相性の平均が一番高い人（平均'+(Math.round(avg[hub]*10)/10)+'点）。輪をつなぐ役割です。</p></div>'+
  '<div class="card"><span class="eyebrow">グループの気質（ガナ）</span><b style="font-size:18px">神'+gc[0]+'・人'+gc[1]+'・羅刹'+gc[2]+'</b><p class="note" style="color:inherit">'+(gc[0]>=gc[1]&&gc[0]>=gc[2]?'穏やかで品のある「神」タイプが中心。和やかにまとまりやすいグループです。':gc[2]>=gc[0]&&gc[2]>=gc[1]?'情熱的で行動力のある「羅刹」タイプが中心。勢いと突破力のあるグループです。':'現実的でバランスのいい「人」タイプが中心。地に足のついたグループです。')+'</p></div></div>';
 h+='<div class="tbl"><table style="min-width:'+(120+N*70)+'px"><thead><tr><th></th>'+ppl.map(function(x){return '<th>'+x.name.replace(/</g,'&lt;')+'</th>';}).join('')+'</tr></thead><tbody>'+
  ppl.map(function(x,i){return '<tr><td><b>'+x.name.replace(/</g,'&lt;')+'</b><br><a class="note" href="/nakshatra/'+x.nk.slug+'/">'+x.nk.name+'</a>'+(x.amb?'<br><span class="warn">星宿が未確定</span>':'')+'</td>'+M[i].map(function(v){return v===null?'<td class="mut">—</td>':'<td class="num"><span class="pill '+colr(v)+'">'+(Math.round(v*10)/10)+'</span></td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';
 h+='<div class="card"><h3>相性ランキング</h3><ol style="margin:0;padding-left:1.4em">'+pairs.map(function(p){var rl=JY.relation(ppl[p.a].nk.i,ppl[p.b].nk.i);return '<li>'+ppl[p.a].name.replace(/</g,'&lt;')+' × '+ppl[p.b].name.replace(/</g,'&lt;')+'　<span class="num">'+(Math.round(p.v*10)/10)+'点</span>　<span class="pill r">'+rl.type+'</span></li>';}).join('')+'</ol><p class="note">点数は、インド式の相性占い「アシュタクータ」（36点満点）を、性別を問わず両方向で計算した平均です。18点以上がひとつの目安です。右の印は星宿の関係（命・業胎・栄親・友衰・安壊・危成）です。</p></div>';
 if(ppl.some(function(x){return x.amb;}))h+='<p class="warn">「星宿が未確定」の人は、生まれた日に月の星宿が切り替わっています。時刻を入れると確定します。</p>';
 $('res').innerHTML=h;st.textContent=N+'人の相性を表示しています';return true;}
$('add').addEventListener('click',function(){addRow();save();});
$('f').addEventListener('submit',function(e){e.preventDefault();try{if(run())$('res').scrollIntoView({behavior:'smooth'});}catch(err){$('status').textContent='計算できませんでした。入力を確認してください。';}});
var saved=null;try{saved=JSON.parse(localStorage.getItem('tsuki-group')||'null');}catch(e){}
(saved&&saved.length?saved:[{n:'Aさん',d:'1990-05-15'},{n:'Bさん',d:'1988-09-05'},{n:'Cさん',d:'1992-02-20'},{n:'Dさん',d:'1985-11-03'}]).forEach(addRow);
TK.ready(function(){try{run();if(!saved)$('status').textContent='サンプル表示中（4人）';}catch(e){}});
})();
