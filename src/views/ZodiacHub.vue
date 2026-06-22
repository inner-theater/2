<template>
  <div class="zodiac-hub">
    <div class="content">
      <div class="badge">★ 星座命理</div>
      <h1 class="headline">探索你的<br />星座密码</h1>
      <p class="subhead">选择你的星座，查看深度解读和专属像素图腾</p>

      <div class="sign-grid">
        <div v-for="(s, key) in signs" :key="key" class="sign-card" @click="$router.push(`/constellation/${key}`)">
          <span class="sign-emoji">{{ s.emoji }}</span>
          <span class="sign-name">{{ s.name }}</span>
          <span class="sign-date">{{ s.date }}</span>
        </div>
      </div>
    </div>

    <nav class="tab-bar">
      <div class="pill">
        <div class="tab" @click="$router.push('/')"><span class="tab-icon">✦</span><span class="tab-label">首页</span></div>
        <div class="tab" @click="$router.push('/test')"><span class="tab-icon">◆</span><span class="tab-label">测试</span></div>
        <div class="tab active"><span class="tab-icon">★</span><span class="tab-label">星座</span></div>
        <div class="tab" @click="$router.push('/profile')"><span class="tab-icon">◈</span><span class="tab-label">我的</span></div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { zodiacData } from '../data/zodiac.js'
const signs = zodiacData
</script>

<style scoped>
.zodiac-hub { min-height: 100dvh; background: var(--color-bg); display: flex; flex-direction: column; }
.content { flex: 1; padding: 32px 20px 20px; display: flex; flex-direction: column; align-items: center; gap: 28px; }
.badge { padding: 6px 16px; background: var(--color-surface); border-radius: var(--radius-lg); font-size: 14px; color: var(--color-primary); }
.headline { font-family: var(--font-heading); font-size: 32px; color: var(--color-text); text-align: center; line-height: 1.4; }
.subhead { font-size: 16px; color: var(--color-text-secondary); text-align: center; }
.sign-grid { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.sign-card { padding: 20px 8px; background: var(--color-white); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: transform 0.15s; }
.sign-card:active { transform: scale(0.96); }
.sign-emoji { font-size: 36px; }
.sign-name { font-family: var(--font-heading); font-size: 14px; color: var(--color-text); }
.sign-date { font-size: 11px; color: var(--color-text-secondary); }

.tab-bar { padding: 12px 21px 21px; background: var(--color-bg); }
.pill { display: flex; height: 62px; background: var(--color-white); border-radius: var(--radius-pill); padding: 4px; border: 1px solid var(--color-border); }
.tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: 26px; cursor: pointer; transition: background 0.2s; }
.tab.active { background: var(--color-primary); }
.tab.active .tab-icon, .tab.active .tab-label { color: var(--color-white); }
.tab-icon { font-size: 18px; color: var(--color-text-secondary); }
.tab-label { font-family: var(--font-heading); font-size: 10px; color: var(--color-text-secondary); }
</style>
