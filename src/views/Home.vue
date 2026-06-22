<template>
  <div class="home">
    <div class="content">
      <header class="header">
        <div class="logo">
          <span class="logo-icon">✦</span>
          <span class="logo-text">星心测试</span>
        </div>
      </header>

      <section class="hero">
        <div class="badge">✦ 疗愈心理 × 专业测评</div>
        <h1 class="headline">探索你的<br />星空密码</h1>
        <button class="hero-btn" @click="$router.push('/test')">开始探索</button>
      </section>

      <section class="intro">
        <div class="intro-card">
          <h2 class="intro-title">大五人格</h2>
          <p class="intro-desc">基于国际公认的 IPIP-NEO 120 项量表，从开放性、尽责性、外向性、宜人性、神经质五个维度，科学描绘你的人格画像。这是当代心理学研究中最被广泛验证的人格模型。</p>
          <div class="intro-tags">
            <span>120题完整版</span><span>60题精简版</span>
          </div>
        </div>
        <div class="intro-card">
          <h2 class="intro-title">九型人格</h2>
          <p class="intro-desc">探索你内心最深处的动机与恐惧。九型人格将人分为九种核心类型，揭示你行为背后的情感逻辑。不仅知道"你是什么样"，更理解"你为什么这样"。</p>
          <div class="intro-tags">
            <span>108题完整版</span><span>54题精简版</span>
          </div>
        </div>
        <div class="intro-card">
          <h2 class="intro-title">星相命理</h2>
          <p class="intro-desc">提供十二星座深度解读和十二生肖传统命理，结合专业的心理人格分析，让你更全面地认识自己。</p>
          <div class="intro-tags">
            <span>星座解读</span><span>生肖解析</span>
          </div>
        </div>
      </section>
    </div>

    <nav class="tab-bar">
      <div class="pill">
        <div class="tab active"><span class="tab-icon">✦</span><span class="tab-label">首页</span></div>
        <div class="tab" @click="$router.push('/test')"><span class="tab-icon">◆</span><span class="tab-label">测试</span></div>
        <div class="tab" @click="$router.push('/fortune')"><span class="tab-icon">★</span><span class="tab-label">星相</span></div>
        <div class="tab" @click="$router.push('/profile')"><span class="tab-icon">◈</span><span class="tab-label">我的</span></div>
      </div>
    </nav>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home { min-height: 100dvh; display: flex; flex-direction: column; background: var(--color-bg); }
.content { flex: 1; padding: 24px 20px 20px; display: flex; flex-direction: column; gap: 32px; }
.header { display: flex; justify-content: space-between; align-items: center; }
.logo { display: flex; align-items: center; gap: 8px; }
.logo-icon { font-size: 20px; color: var(--color-primary); }
.logo-text { font-family: var(--font-heading); font-size: 14px; color: var(--color-text); }
.hero { display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; }
.badge { padding: 6px 16px; background: var(--color-surface); border-radius: var(--radius-lg); font-size: 14px; color: var(--color-text-secondary); }
.headline { font-family: var(--font-heading); font-size: 32px; color: var(--color-text); line-height: 1.4; }
.subhead { font-size: 16px; color: var(--color-text-secondary); }
.hero-btn { margin-top: 8px; padding: 14px 48px; background: var(--color-primary); color: var(--color-white); border: none; border-radius: var(--radius-lg); font-family: var(--font-heading); font-size: 16px; cursor: pointer; transition: transform 0.15s; }
.hero-btn:active { transform: scale(0.97); }

.intro { display: flex; flex-direction: column; gap: 16px; }
.intro-card { padding: 24px 20px; background: var(--color-white); border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 12px; }
.intro-title { font-family: var(--font-heading); font-size: 18px; color: var(--color-primary); }
.intro-desc { font-size: 15px; color: var(--color-text); line-height: 1.7; }
.intro-tags { display: flex; gap: 8px; }
.intro-tags span { padding: 4px 12px; background: var(--color-surface); border-radius: var(--radius-pill); font-size: 13px; color: var(--color-text-secondary); }

.tab-bar { padding: 12px 21px 21px; background: var(--color-bg); }
.pill { display: flex; height: 62px; background: var(--color-white); border-radius: var(--radius-pill); padding: 4px; border: 1px solid var(--color-border); }
.tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: 26px; cursor: pointer; transition: background 0.2s; }
.tab.active { background: var(--color-primary); }
.tab.active .tab-icon, .tab.active .tab-label { color: var(--color-white); }
.tab-icon { font-size: 18px; color: var(--color-text-secondary); }
.tab-label { font-family: var(--font-heading); font-size: 10px; color: var(--color-text-secondary); }
</style>
