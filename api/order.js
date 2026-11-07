// 鑑定書の注文：PayPalの支払いを確認してから、注文内容をメールで送る（Vercel Serverless Function）
// 必要な環境変数：PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_ENV(live|sandbox), RESEND_API_KEY, ORDER_TO, ORDER_FROM
import shop from '../content/shop.json' with { type: 'json' };

const API = () => (process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clip = (s, n) => String(s ?? '').slice(0, n);

async function token() {
  const r = await fetch(API() + '/v1/oauth2/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!r.ok) throw new Error('paypal auth');
  return (await r.json()).access_token;
}
async function mail(to, subject, html, replyTo) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.ORDER_FROM, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) })
  });
  if (!r.ok) throw new Error('mail ' + r.status);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const p = shop.products.find(x => x.id === b.product);
    if (!p || !p.price || !/^[A-Z0-9]{8,40}$/.test(String(b.orderID || ''))) return res.status(400).json({ ok: false, error: 'bad request' });
    // 支払いの確認：完了していること、金額と通貨が商品と一致すること
    const t = await token();
    const r = await fetch(API() + '/v2/checkout/orders/' + b.orderID, { headers: { Authorization: 'Bearer ' + t } });
    if (!r.ok) return res.status(402).json({ ok: false, error: 'order not found' });
    const o = await r.json();
    const pu = (o.purchase_units || [])[0] || {}, cap = ((pu.payments || {}).captures || [])[0] || {};
    const amt = (cap.amount || pu.amount || {});
    if (o.status !== 'COMPLETED' || amt.currency_code !== shop.currency || Number(amt.value) !== Number(p.price)) return res.status(402).json({ ok: false, error: 'payment not verified' });
    const f = b.form || {};
    const rows = [['商品', p.name + (p.options && f.theme ? '（' + clip(f.theme, 20) + '）' : '')], ['金額', p.price + '円'], ['PayPal注文番号', b.orderID], ['お名前', clip(f.name, 60)], ['メール', clip(f.email, 120)], ['生年月日', clip(f.bd, 20)], ['出生時刻', f.unk ? '不明' : clip(f.bt, 10)], ['出生地', clip(f.place, 80)], ['ご相談内容', clip(f.msg, 3000)]];
    const table = '<table cellpadding="6" style="border-collapse:collapse">' + rows.map(x => '<tr><th align="left" style="border-bottom:1px solid #ddd">' + x[0] + '</th><td style="border-bottom:1px solid #ddd;white-space:pre-wrap">' + esc(x[1]) + '</td></tr>').join('') + '</table>';
    await mail(process.env.ORDER_TO, '【鑑定書のご注文】' + p.name + '／' + clip(f.name, 30), '<p>鑑定書のご注文がありました（支払い確認済み）。</p>' + table, f.email);
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email || '')) {
      try { await mail(f.email, '【インド占星術ナヴァラトナ】ご注文ありがとうございます', '<p>' + esc(f.name) + ' 様</p><p>「' + esc(p.name) + '」のご注文を承りました。' + (p.days ? 'お支払いから' + p.days + '日以内に' : '') + '鑑定書（PDF）をこのメールアドレスへお送りします。</p><p>ご注文内容</p>' + table + '<p>インド占星術ナヴァラトナ</p>'); } catch (e) {}
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'server' });
  }
}
