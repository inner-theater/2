<template>
  <div class="fortune-hub">
    <div class="content">
      <div class="badge">★ 星相命理</div>
      <h1 class="headline">发现你的<br />星辰密码</h1>

      <!-- 日历类型切换 -->
      <div class="calendar-toggle">
        <button :class="{ active: isSolar }" @click="switchCalendar(true)">阳历</button>
        <button :class="{ active: !isSolar }" @click="switchCalendar(false)">农历</button>
      </div>

      <!-- 日期选择 — 滚轮 picker -->
      <div class="date-inputs">
        <div class="input-group">
          <label>年</label>
          <div class="picker-wrap" ref="yearWrap" @scroll="onScrollYear">
            <div class="picker-list">
              <div v-for="y in years" :key="y" class="picker-item" :class="{ active: y === year }">{{ y }}</div>
            </div>
          </div>
        </div>
        <div class="input-group">
          <label>月</label>
          <div class="picker-wrap" ref="monthWrap" @scroll="onScrollMonth">
            <div class="picker-list">
              <div v-for="m in 12" :key="m" class="picker-item" :class="{ active: m === month }">{{ m }}</div>
            </div>
          </div>
        </div>
        <div class="input-group">
          <label>日</label>
          <div class="picker-wrap" ref="dayWrap" @scroll="onScrollDay">
            <div class="picker-list">
              <div v-for="d in daysInMonth" :key="d" class="picker-item" :class="{ active: d === day }">{{ d }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 匹配结果 -->
      <div v-if="matched.zodiac" class="result-card" @click="goToConstellation">
        <div class="result-header">
          <span class="result-emoji">{{ matched.zodiac.emoji }}</span>
          <div class="result-info">
            <span class="result-name">{{ matched.zodiac.name }}</span>
            <span class="result-date">{{ matched.zodiac.date }}</span>
          </div>
        </div>
        <span class="result-elem">{{ matched.zodiac.element }} · 守护星 {{ matched.zodiac.ruler }}</span>
      </div>

      <div v-if="matched.chinese" class="result-card" @click="goToChineseZodiac">
        <div class="result-header">
          <span class="result-emoji">{{ matched.chinese.emoji }}</span>
          <div class="result-info">
            <span class="result-name">生肖 · {{ matched.chinese.name }}</span>
            <span class="result-date">生于 {{ year }} 年</span>
          </div>
        </div>
        <span class="result-elem">五行属{{ matched.chinese.elem }}</span>
      </div>
    </div>

    <nav class="tab-bar">
      <div class="pill">
        <div class="tab" @click="$router.push('/')"><span class="tab-icon">✦</span><span class="tab-label">首页</span></div>
        <div class="tab" @click="$router.push('/test')"><span class="tab-icon">◆</span><span class="tab-label">测试</span></div>
        <div class="tab active"><span class="tab-icon">★</span><span class="tab-label">星相</span></div>
        <div class="tab" @click="$router.push('/profile')"><span class="tab-icon">◈</span><span class="tab-label">我的</span></div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { zodiacData, chineseZodiacData } from '../data/zodiac.js'
import { lunarToSolar } from '../data/lunar.js'

const router = useRouter()
const isSolar = ref(true)
const year = ref(2000)
const month = ref(1)
const day = ref(1)
const yearWrap = ref(null)
const monthWrap = ref(null)
const dayWrap = ref(null)

const ITEM_H = 44 // picker item height in px

function scrollToSelected() {
  nextTick(() => {
    const yi = years.indexOf(year.value)
    if (yearWrap.value) yearWrap.value.scrollTop = yi * ITEM_H
    if (monthWrap.value) monthWrap.value.scrollTop = (month.value - 1) * ITEM_H
    if (dayWrap.value) dayWrap.value.scrollTop = (day.value - 1) * ITEM_H
  })
}

let scrollTimer = null
function onScrollYear() {
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    const idx = Math.round(yearWrap.value.scrollTop / ITEM_H)
    if (idx >= 0 && idx < years.length) {
      year.value = years[idx]
      matchSign()
    }
  }, 100)
}
function onScrollMonth() {
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    const idx = Math.round(monthWrap.value.scrollTop / ITEM_H)
    if (idx >= 0 && idx < 12) {
      month.value = idx + 1
      matchSign()
    }
  }, 100)
}
function onScrollDay() {
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    const idx = Math.round(dayWrap.value.scrollTop / ITEM_H)
    if (idx >= 0 && idx < daysInMonth.value) {
      day.value = idx + 1
      matchSign()
    }
  }, 100)
}

// 初始化：加载上次输入的日期
function loadSaved() {
  try {
    const saved = localStorage.getItem('starheart_fortune')
    if (saved) {
      const s = JSON.parse(saved)
      isSolar.value = s.isSolar ?? true
      year.value = s.year || 2000
      month.value = s.month || 1
      day.value = s.day || 1
    }
  } catch {}
}
loadSaved()

// 保存到 localStorage
function save() {
  localStorage.setItem('starheart_fortune', JSON.stringify({
    isSolar: isSolar.value,
    year: year.value,
    month: month.value,
    day: day.value
  }))
}

// 监听变化自动保存
watch([isSolar, year, month, day], save)

const years = Array.from({ length: 100 }, (_, i) => 2025 - i)

const daysInMonth = computed(() => {
  // 农历模式下粗略估算天数范围
  const d = new Date(year.value, month.value, 0)
  return Math.min(d.getDate(), 30)
})

const chineseZodiacKeys = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat']

function getChineseZodiac(y) {
  return chineseZodiacData[chineseZodiacKeys[y % 12]]
}

function getZodiacSign(m, d) {
  const ranges = [
    { sign: 'capricorn', end: [1, 19] }, { sign: 'aquarius', end: [2, 18] },
    { sign: 'pisces', end: [3, 20] }, { sign: 'aries', end: [4, 19] },
    { sign: 'taurus', end: [5, 20] }, { sign: 'gemini', end: [6, 21] },
    { sign: 'cancer', end: [7, 22] }, { sign: 'leo', end: [8, 22] },
    { sign: 'virgo', end: [9, 22] }, { sign: 'libra', end: [10, 23] },
    { sign: 'scorpio', end: [11, 21] }, { sign: 'sagittarius', end: [12, 21] },
    { sign: 'capricorn', end: [12, 31] }
  ]
  for (const r of ranges) {
    if (m < r.end[0] || (m === r.end[0] && d <= r.end[1])) return zodiacData[r.sign]
  }
  return zodiacData.capricorn
}

const matched = ref({ zodiac: null, chinese: null })

function matchSign() {
  if (isSolar.value) {
    // 阳历：直接匹配
    matched.value.zodiac = getZodiacSign(month.value, day.value)
    matched.value.chinese = getChineseZodiac(year.value)
  } else {
    // 农历：先转为阳历再匹配星座，生肖按农历年
    const solar = lunarToSolar(year.value, month.value, day.value)
    matched.value.zodiac = getZodiacSign(solar.month, solar.day)
    matched.value.chinese = getChineseZodiac(year.value)
  }
}

function switchCalendar(solar) {
  isSolar.value = solar
  if (!solar) day.value = 15  // 农历默认15日
  matchSign()
}

function goToChineseZodiac() {
  if (matched.value.chinese) {
    const key = Object.keys(chineseZodiacData).find(k => chineseZodiacData[k].name === matched.value.chinese.name)
    if (key) router.push(`/chinese-zodiac/${key}`)
  }
}

function goToConstellation() {
  if (matched.value.zodiac) {
    const key = Object.keys(zodiacData).find(k => zodiacData[k].name === matched.value.zodiac.name)
    if (key) router.push(`/constellation/${key}`)
  }
}

// 初始化
matchSign()
onMounted(scrollToSelected)
</script>

<style scoped>
.fortune-hub { min-height: 100dvh; background: var(--color-bg); display: flex; flex-direction: column; }
.content { flex: 1; padding: 32px 20px 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.badge { padding: 6px 16px; background: var(--color-surface); border-radius: var(--radius-lg); font-size: 14px; color: var(--color-primary); }
.headline { font-family: var(--font-heading); font-size: 32px; color: var(--color-text); text-align: center; line-height: 1.4; }
.subhead { font-size: 16px; color: var(--color-text-secondary); }

.calendar-toggle { display: flex; background: var(--color-surface); border-radius: var(--radius-pill); padding: 3px; }
.calendar-toggle button { padding: 8px 24px; border: none; background: transparent; border-radius: var(--radius-pill); font-family: var(--font-heading); font-size: 14px; cursor: pointer; transition: all 0.2s; color: var(--color-text-secondary); }
.calendar-toggle button.active { background: var(--color-primary); color: var(--color-white); }

.date-inputs { width: 100%; display: flex; gap: 8px; justify-content: center; }
.input-group { flex: 0 0 auto; display: flex; flex-direction: column; gap: 6px; align-items: center; }
.input-group label { font-size: 13px; color: var(--color-text-secondary); text-align: center; }

.picker-wrap {
  width: 72px; height: 132px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  background: var(--color-white);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.picker-wrap::-webkit-scrollbar { display: none; }
.picker-list { padding: 44px 0; }
.picker-item {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--color-text-secondary);
  scroll-snap-align: center;
  transition: color 0.15s, font-weight 0.15s;
}
.picker-item.active {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 20px;
}

.result-card { width: 100%; padding: 20px; background: var(--color-white); border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 10px; cursor: pointer; transition: transform 0.15s; }
.result-card:active { transform: scale(0.98); }
.result-header { display: flex; align-items: center; gap: 16px; }
.result-emoji { font-size: 40px; }
.result-info { display: flex; flex-direction: column; gap: 2px; }
.result-name { font-family: var(--font-heading); font-size: 18px; color: var(--color-text); }
.result-date { font-size: 14px; color: var(--color-text-secondary); }
.result-elem { font-size: 14px; color: var(--color-primary); }

.tab-bar { padding: 12px 21px 21px; background: var(--color-bg); }
.pill { display: flex; height: 62px; background: var(--color-white); border-radius: var(--radius-pill); padding: 4px; border: 1px solid var(--color-border); }
.tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: 26px; cursor: pointer; transition: background 0.2s; }
.tab.active { background: var(--color-primary); }
.tab.active .tab-icon, .tab.active .tab-label { color: var(--color-white); }
.tab-icon { font-size: 18px; color: var(--color-text-secondary); }
.tab-label { font-family: var(--font-heading); font-size: 10px; color: var(--color-text-secondary); }
</style>
