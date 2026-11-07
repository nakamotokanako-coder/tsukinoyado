/* 鑑定書の注文：入力チェック → PayPalで支払い → /api/order で支払い確認と注文メール */
(function(){var $=TK.$,S=window.SHOP||{};
function prod(){var id=$('s-p').value;return (S.products||[]).filter(function(p){return p.id===id;})[0];}
function form(){return {name:$('s-name').value.trim(),email:$('s-email').value.trim(),bd:$('s-bd').value,bt:$('s-bt').value,unk:$('s-unk').checked,place:$('s-place').value.trim(),msg:$('s-msg').value.trim()};}
function check(){var f=form(),e=[];if(!f.name)e.push('お名前');if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))e.push('メールアドレス');if(!f.bd)e.push('生年月日');if(!f.bt&&!f.unk)e.push('出生時刻（わからない場合はチェック）');if(!f.place)e.push('出生地');if(!f.msg)e.push('ご相談の内容');if(!$('s-ok').checked)e.push('同意のチェック');return e;}
function sum(){var p=prod(),f=form();$('ssum').innerHTML=p?'<b>'+p.name+'</b>　'+(p.price?Number(p.price).toLocaleString('ja-JP')+'円（税込）':'料金は準備中')+(f.name?'<br>お名前：'+f.name.replace(/</g,'&lt;'):''):'';}
var wait=!S.clientId||!(S.products||[]).some(function(p){return p.price;});
function done(ok,id){var box=$('order');box.innerHTML=ok?'<div class="card shop-done"><h2>ご注文ありがとうございます</h2><p>お支払いを確認し、ご注文を承りました。'+(prod()&&prod().days?'お支払いから'+prod().days+'日以内に':'')+'、ご入力のメールアドレスへ鑑定書（PDF）をお送りします。</p><p class="note">PayPal注文番号：'+id+'（控えとして保存してください）。確認メールが届かない場合は、迷惑メールフォルダもご確認ください。</p></div>':
  '<div class="card shop-done warnbox"><h2>お支払いは完了しましたが、注文内容の送信に失敗しました</h2><p>お手数ですが、PayPal注文番号 <b>'+id+'</b> と、ご入力いただいた出生情報・ご相談内容を、お問い合わせ先までお送りください。二重にお支払いいただく必要はありません。</p></div>';box.scrollIntoView({behavior:'smooth',block:'start'});}
TK.ready(function(){['s-name','s-p'].forEach(function(id){var e=$(id);e&&e.addEventListener('input',sum);e&&e.addEventListener('change',sum);});sum();
  if(wait){$('paypal').innerHTML='<button type="button" disabled class="big-btn">ただいま受付準備中です</button>';return;}
  var sc=document.createElement('script');sc.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(S.clientId)+'&currency='+(S.currency||'JPY')+'&intent=capture&locale=ja_JP';
  sc.onerror=function(){$('sstatus').textContent='PayPalを読み込めませんでした。時間をおいて再度お試しください。';};
  sc.onload=function(){paypal.Buttons({style:{layout:'vertical',color:'gold',shape:'rect',label:'pay'},
    onClick:function(d,actions){var e=check();if(e.length){$('sstatus').textContent='入力してください：'+e.join('、');return actions.reject();}$('sstatus').textContent='';return actions.resolve();},
    createOrder:function(d,actions){var p=prod();return actions.order.create({purchase_units:[{amount:{currency_code:S.currency||'JPY',value:String(p.price)},description:p.name,custom_id:p.id}],application_context:{shipping_preference:'NO_SHIPPING'}});},
    onApprove:function(d,actions){$('sstatus').textContent='お支払いを確認しています…';return actions.order.capture().then(function(o){
      return fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderID:o.id,product:prod().id,form:form()})}).then(function(r){return r.json();}).then(function(j){done(!!j.ok,o.id);}).catch(function(){done(false,o.id);});});},
    onError:function(){$('sstatus').textContent='お支払いを完了できませんでした。お手数ですが、もう一度お試しください。';}}).render('#paypal');};
  document.head.appendChild(sc);});
})();
