// The landing page keeps the original calculator IDs and all content destinations.
export function home({SR, ad, nakChips, artList, ARTS, shareS, cta}) {
  const paths = [
    {n:'01', title:'自分を知る', en:'Discover yourself', image:'chart-talent', text:'生まれた星の配置から、本質や才能、人生のテーマを。', links:[['/chart/','魂の星図','言葉で読み解く、あなたの物語'],['/horoscope/','ホロスコープ作成','出生図・度数・分割図を見る'],['/sadesati/','サディサティ判定','土星がめぐる7年半を知る']]},
    {n:'02', title:'ご縁を知る', en:'Explore your connections', image:'chart-theme', text:'大切なあの人と、いつもの仲間と。星が教えるつながり。', links:[['/aisho/','相性占い','二人の相性を36点で読み解く'],['/group/','グループ相性','友だち・家族・職場、最大10人で']]},
    {n:'03', title:'日々を読む', en:'Find your rhythm', image:'chart-time', text:'月のリズムに耳をすませて、今日と、これからの一歩を。', links:[['/fortune/','今月の運勢','月の星座12種別のメッセージ'],['/calendar/','吉日カレンダー','吉日と満月・新月をひと目で'],['/muhurta/','吉日選び','入籍・引っ越し・開業の日を探す']]}
  ];
  return `<div id="qback" class="qback-top" hidden></div>
<section class="hero hero-top moon-hero" id="quick" aria-labelledby="home-title">
  <div class="moon-copy">
    <span class="eyebrow"><span aria-hidden="true">✧</span> NAVARATNA · 月の宿</span>
    <h1 id="home-title" data-jaseg="1">生まれた星に、<br>あなたを見つける。</h1>
    <p class="lead">生まれた日の星から、あなたを守る宝石の精霊と、<br class="desktop-break">人生を通して育てていく「魂の星」を読み解きます。</p>
    <div class="moon-form">
      <p class="form-intro"><span>あなたの魂の星と、宝石の精霊</span><span class="free-label">無料診断</span></p>
      <form class="f quick hq" id="qf" novalidate>
        <label for="qbd">あなたの生年月日<input id="qbd" type="date" value="" min="1900-01-01" max="2099-12-31" aria-describedby="birth-help"></label>
        <div class="actions"><button type="submit" class="big-btn">私の星を見つける <span aria-hidden="true">→</span></button></div>
      </form>
      <p id="birth-help" class="form-help">出生時刻がわからなくても大丈夫。日本時間で計算します。</p>
      <p id="qerror" class="form-error" role="alert" hidden></p>
    </div>
    <p class="hero-privacy"><span aria-hidden="true">◇</span> 生年月日は、この端末の中だけで計算します。</p>
    <a class="hero-guide" href="/jyotish/">インド占星術がはじめての方へ <span aria-hidden="true">↗</span></a>
  </div>
  <div class="celestial" aria-hidden="true">
    <div class="orbit orbit-outer"></div><div class="orbit orbit-inner"></div>
    <div class="celestial-moon"></div>
    <span class="star star-a">✧</span><span class="star star-b">✦</span><span class="star star-c">✧</span><span class="star star-d">·</span>
    <span class="orbit-caption">THE STARS WITHIN YOU</span>
    <img class="moon-spirit" src="${SR.img('moti')}" alt="" width="400" height="400" fetchpriority="high">
    <div class="spirit-caption"><span class="caption-rule"></span><span>月の精霊 モティ<br><small>PEARL · MOON</small></span></div>
    <p class="celestial-note">星は、あなたを知るための<br>小さな道しるべ。</p>
  </div>
</section>
<nav class="home-shortcuts" aria-label="よく使う占い">
  <a href="/today/"><span aria-hidden="true">☾</span><span>今日の運勢<small>今日の月からのメッセージ</small></span><b aria-hidden="true">↗</b></a>
  <a href="/chart/"><span aria-hidden="true">✧</span><span>魂の星図<small>あなたの本質と人生のテーマ</small></span><b aria-hidden="true">↗</b></a>
  <a href="/calendar/"><span aria-hidden="true">◷</span><span>吉日カレンダー<small>大切な一日に、星のヒントを</small></span><b aria-hidden="true">↗</b></a>
</nav>
<section class="home-results" aria-label="診断結果"><div id="qres" aria-live="polite" tabindex="-1"></div><div id="qwelcome"></div></section>
<section class="sr-sec home-spirits" aria-labelledby="spirits-title">
  <div class="section-heading"><div><span class="eyebrow">THE NINE GEMS</span><h2 id="spirits-title">あなたを見守る、9つの宝石の精霊。</h2></div><a class="text-link" href="/seirei/">9人の物語を読む <span aria-hidden="true">↗</span></a></div>
  <p class="section-description">ナヴァラトナとは、9つの宝石のこと。個性豊かな精霊たちが、27の星宿を3つずつ守っています。</p>
  <div class="sr-line" data-tap>${SR.L.map(x=>`<button type="button" data-id="${x.id}" aria-expanded="false" aria-controls="srd" aria-label="${x.name}・${x.gem}の精霊の紹介"><span class="sr-im"><img src="${SR.img(x.id,true)}" alt="" width="128" height="128" loading="lazy"></span><span class="sr-nm">${x.name}</span><span class="sr-gm">${x.gem}</span></button>`).join('')}</div>
  <div class="srd" id="srd" hidden aria-live="polite"></div>
  <p class="spirit-hint">気になる精霊を選ぶと、紹介がひらきます。</p>
</section>
<section id="explore" class="home-explore" aria-labelledby="explore-title">
  <div class="section-heading"><div><span class="eyebrow">A LITTLE GUIDANCE</span><h2 id="explore-title">今、知りたいことから。</h2></div><p>すべて無料で、何度でも。</p></div>
  <div class="journey-grid">${paths.map(x=>`<article class="journey"><div class="journey-image"><img src="/assets/land/${x.image}-s.webp" alt="" width="800" height="450" loading="lazy"><span>${x.n}</span></div><div class="journey-content"><span class="eyebrow">${x.en}</span><h3>${x.title}</h3><p>${x.text}</p><ul>${x.links.map(([url,title,desc])=>`<li><a href="${url}"><span><b>${title}</b><small>${desc}</small></span><span aria-hidden="true">↗</span></a></li>`).join('')}</ul></div></article>`).join('')}</div>
  <p class="note">生年月日と時刻、出生地を入れるだけ。計算はすべてあなたの端末の中で行います。出生時刻がわかる方は、<a href="/horoscope/">ホロスコープ作成</a>で本格的なチャートもすぐ作れます。</p>
</section>
<section id="today" class="home-today" aria-labelledby="today-title">
  <div class="section-heading"><div><span class="eyebrow">TODAY'S MOON</span><h2 id="today-title">今日の月と、あなたの運勢。</h2></div><span id="today-date" class="date-badge"></span></div>
  <p class="section-description">生まれた星宿と、今日の月の星宿の巡り（ターラ）から読む毎日の運勢です。</p>
  <div class="today-layout"><div class="card now" id="mine"></div><div class="card" id="nowslot"></div></div><div class="grid" id="pick"></div>
  <a class="text-link" href="/today/">27星宿すべての今日の運勢と時間帯を見る <span aria-hidden="true">→</span></a>
</section>
${ad('top')}
<section class="home-almanac"><div class="section-heading"><div><span class="eyebrow">PANCHANGA</span><h2>今日の暦</h2></div><p>インドの暦で見る、今日という日の性質。</p></div><div class="facts" id="pc"></div></section>
<section class="home-nakshatra" aria-labelledby="nakshatra-title">
  <div class="section-heading"><div><span class="eyebrow">THE 27 LUNAR MANSIONS</span><h2 id="nakshatra-title">月がめぐる、27の宿。</h2></div><a class="text-link" href="/nakshatra/">27星宿をくわしく <span aria-hidden="true">↗</span></a></div>
  <p class="section-description">27星宿（ナクシャトラ）は、月の通り道を27に分けた「月の宿」。生まれたときの月の星宿が、あなたの心のかたちを表します。</p>
  ${nakChips()}
  <a class="text-link" href="/wheel/">星宿の円盤で、月の巡りをたどる <span aria-hidden="true">→</span></a>
</section>
${ad('mid')}
<section class="home-reading"><div class="section-heading"><div><span class="eyebrow">LETTERS FROM THE STARS</span><h2>星を知る、読みもの。</h2></div><a class="text-link" href="/articles/">すべての読みもの <span aria-hidden="true">↗</span></a></div><p class="section-description">はじめてのインド占星術。星の言葉を、少しずつ。</p>${artList(ARTS.slice(0,6))}</section>
${cta}
${shareS('インド占星術の無料占いサイト「ナヴァラトナ」。生年月日だけで、あなたの星宿と守ってくれる宝石の精霊がわかります。','/')}`;
}
