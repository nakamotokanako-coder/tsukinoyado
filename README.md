# インド占星術ナヴァラトナ（無料占いサイト・旧名 月の宿）

静的サイト。`npm run build` で `dist/` に全ページを生成します（Vercel の設定は vercel.json）。

- 設定：`site.config.json`（サイト名、URL、AdSense の `ca-pub-...`、個人鑑定の案内リンク、お問い合わせ文）
- 原稿：`content/`（nak_data.json＝星宿の事実データ、nak_text_*.json＝星宿ページ本文、articles.json＝読みもの）
- 計算：`src/assets/calc.js`（ラーヒリー／ホールサイン。Astronomy Engine を使用）
- 広告：`site.config.json` の `adsenseClient` に ID を入れて再ビルドすると、全ページの広告枠が有効になります。
- 注意：`content/articles.json` の sade-sati 記事には「2026年現在の土星の位置」の記述があります。2027年6月以降は更新してください。
