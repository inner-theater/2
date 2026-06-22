<template>
  <div class="test-hub">
    <div class="content">
      <div class="badge">✦ 专业心理测评</div>
      <h1 class="headline">选择你的<br />测试方案</h1>
      <p class="subhead">所有题目严格基于经典心理学量表</p>

      <div class="cta-list">
        <button class="cta primary" @click="$router.push('/test/bigfive/lite')">
          <span class="cta-title">大五人格 · 精简版</span>
          <span class="cta-desc">60题 · 约8分钟</span>
        </button>
        <button class="cta primary" @click="$router.push('/test/bigfive/full')">
          <span class="cta-title">大五人格 · 完整版</span>
          <span class="cta-desc">120题 · 约15分钟</span>
        </button>
        <button class="cta secondary" @click="$router.push('/test/enneagram/lite')">
          <span class="cta-title">九型人格 · 精简版</span>
          <span class="cta-desc">54题 · 约7分钟</span>
        </button>
        <button class="cta secondary" @click="$router.push('/test/enneagram/full')">
          <span class="cta-title">九型人格 · 完整版</span>
          <span class="cta-desc">108题 · 约13分钟</span>
        </button>
      </div>
    </div>

    <nav class="tab-bar">
      <div class="pill">
        <div class="tab" @click="$router.push('/')"><span class="tab-icon">✦</span><span class="tab-label">首页</span></div>
        <div class="tab active"><span class="tab-icon">◆</span><span class="tab-label">测试</span></div>
        <div class="tab" @click="$router.push('/fortune')"><span class="tab-icon">★</span><span class="tab-label">星相</span></div>
        <div class="tab" @click="$router.push('/profile')"><span class="tab-icon">◈</span><span class="tab-label">我的</span></div>
      </div>
    </nav>
  </div>
</template>

<script setup>
</script>

<style scoped>
.test-hub { min-height: 100dvh; background: var(--color-bg); display: flex; flex-direction: column; }
.content { flex: 1; padding: 32px 20px 20px; display: flex; flex-direction: column; align-items: center; gap: 28px; }
.badge { padding: 6px 16px; background: var(--color-surface); border-radius: var(--radius-lg); font-size: 14px; color: var(--color-primary); }
.headline { font-family: var(--font-heading); font-size: 32px; color: var(--color-text); text-align: center; line-height: 1.4; }
.subhead { font-size: 16px; color: var(--color-text-secondary); }
.cta-list { width: 100%; display: flex; flex-direction: column; gap: 12px; }
.cta { width: 100%; border: none; border-radius: var(--radius-lg); padding: 16px 20px; display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer; font-family: inherit; transition: transform 0.15s; -webkit-tap-highlight-color: transparent; }
.cta:active { transform: scale(0.98); }
.cta.primary { background: var(--color-primary); }
.cta.primary .cta-title { color: var(--color-white); }
.cta.primary .cta-desc { color: rgba(255,255,255,0.7); }
.cta.secondary { background: var(--color-white); border: 2px solid var(--color-primary); }
.cta.secondary .cta-title { color: var(--color-text); }
.cta.secondary .cta-desc { color: var(--color-text-secondary); }
.cta-title { font-family: var(--font-heading); font-size: 16px; }
.cta-desc { font-size: 14px; }

.tab-bar { padding: 12px 21px 21px; background: var(--color-bg); }
.pill { display: flex; height: 62px; background: var(--color-white); border-radius: var(--radius-pill); padding: 4px; border: 1px solid var(--color-border); }
.tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: 26px; cursor: pointer; transition: background 0.2s; }
.tab.active { background: var(--color-primary); }
.tab.active .tab-icon, .tab.active .tab-label { color: var(--color-white); }
.tab-icon { font-size: 18px; color: var(--color-text-secondary); }
.tab-label { font-family: var(--font-heading); font-size: 10px; color: var(--color-text-secondary); }
</style>
