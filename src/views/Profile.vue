<template>
  <div class="profile" @click="onPageClick">
    <div class="content">
      <div class="badge">◈ 我的</div>
      <h1 class="headline">成长记录</h1>
      <p class="subhead">你的每一次探索，都在这里</p>

      <div class="empty-state" v-if="!history.length && !inProgress.length">
        <span class="empty-icon">🌟</span>
        <span class="empty-text">还没有记录</span>
        <button class="start-btn" @click="$router.push('/fortune')">开始探索</button>
      </div>

      <div class="history" v-if="history.length || inProgress.length">
        <div class="section-title" v-if="inProgress.length">⏳ 未完成的测试</div>
        <div v-for="item in inProgress" :key="'p'+item.key" class="swipe-row">
          <button class="del-btn" @click.stop="removeProgress(item.key)">删除</button>
          <div class="hist-item in-progress"
            @click="resumeTest(item)">
            <span class="hist-type">{{ item.title }}</span>
            <span class="hist-progress">{{ item.current }}/{{ item.total }}</span>
          </div>
        </div>
        <div class="section-title" v-if="testHistory.length">✦ 测试记录</div>
        <div v-for="item in testHistory" :key="'t'+item.time" class="swipe-row">
          <button class="del-btn" @click.stop="removeItem(item.time)">删除</button>
          <div class="hist-item"
            :style="{ transform: swipedId === item.time ? `translateX(-${delWidth}px)` : 'translateX(0)' }"
            @click="goToItem(item)"
            @touchstart.prevent="onTouchStart($event, item.time)"
            @touchmove.prevent="onTouchMove($event, item.time)"
            @touchend.prevent="onTouchEnd(item.time)"
            @mousedown.prevent="onMouseDown($event, item.time)">
            <span class="hist-type">{{ item.name }}</span>
            <span class="hist-time">{{ formatTime(item.time) }}</span>
          </div>
        </div>
        <div class="section-title" v-if="zodiacHistory.length">★ 星相记录</div>
        <div v-for="item in zodiacHistory" :key="'z'+item.time" class="swipe-row">
          <button class="del-btn" @click.stop="removeItem(item.time)">删除</button>
          <div class="hist-item"
            :style="{ transform: swipedId === item.time ? `translateX(-${delWidth}px)` : 'translateX(0)' }"
            @click="goToItem(item)"
            @touchstart.prevent="onTouchStart($event, item.time)"
            @touchmove.prevent="onTouchMove($event, item.time)"
            @touchend.prevent="onTouchEnd(item.time)"
            @mousedown.prevent="onMouseDown($event, item.time)">
            <span class="hist-type">{{ item.emoji }} {{ item.name }}</span>
            <span class="hist-time">{{ formatTime(item.time) }}</span>
          </div>
        </div>
      </div>
    </div>

    <nav class="tab-bar">
      <div class="pill">
        <div class="tab" @click="$router.push('/')"><span class="tab-icon">✦</span><span class="tab-label">首页</span></div>
        <div class="tab" @click="$router.push('/test')"><span class="tab-icon">◆</span><span class="tab-label">测试</span></div>
        <div class="tab" @click="$router.push('/fortune')"><span class="tab-icon">★</span><span class="tab-label">星相</span></div>
        <div class="tab active"><span class="tab-icon">◈</span><span class="tab-label">我的</span></div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const history = ref([])
const swipedId = ref(null)
const delWidth = 72
let touchStartX = 0
let touchCurrentX = 0
let mouseDown = false
let mouseSwipingId = null
let didSwipe = false
let justSwiped = false

onMounted(() => {
  try {
    const saved = localStorage.getItem('starheart_history')
    if (saved) history.value = JSON.parse(saved)
  } catch {}
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})

function onTouchStart(e, id) {
  didSwipe = false
  touchStartX = e.touches[0].clientX
  touchCurrentX = touchStartX
}
function onTouchMove(e, id) {
  touchCurrentX = e.touches[0].clientX
  const diff = touchStartX - touchCurrentX
  if (diff > 20) { swipedId.value = id; didSwipe = true }
  else if (diff < -10) { swipedId.value = null; didSwipe = false }
}
function onTouchEnd(id) {
  const diff = touchStartX - touchCurrentX
  if (diff < delWidth / 2) {
    swipedId.value = null
  } else {
    justSwiped = true
    setTimeout(() => { justSwiped = false }, 50)
  }
}
function onMouseDown(e, id) {
  didSwipe = false
  justSwiped = false
  mouseDown = true
  mouseSwipingId = id
  touchStartX = e.clientX
  touchCurrentX = e.clientX
}
function onMouseMove(e) {
  if (!mouseDown) return
  touchCurrentX = e.clientX
  const diff = touchStartX - touchCurrentX
  if (diff > 20) { swipedId.value = mouseSwipingId; didSwipe = true }
  else if (diff < -10) { swipedId.value = null; didSwipe = false; justSwiped = false }
}
function onMouseUp() {
  if (!mouseDown) return
  const diff = touchStartX - touchCurrentX
  if (diff < delWidth / 2) swipedId.value = null
  else justSwiped = true
  mouseDown = false
  mouseSwipingId = null
  setTimeout(() => { justSwiped = false }, 50)
}
function removeItem(time) {
  history.value = history.value.filter(h => h.time !== time)
  localStorage.setItem('starheart_history', JSON.stringify(history.value))
  swipedId.value = null
}
function resetSwipe() { swipedId.value = null; didSwipe = false }
function onPageClick(e) {
  if (justSwiped) return
  if (e.target.classList.contains('del-btn')) return
  resetSwipe()
}

const testHistory = computed(() => history.value.filter(h => h.type === 'bigfive' || h.type === 'enneagram'))
const zodiacHistory = computed(() => history.value.filter(h => h.type === 'constellation' || h.type === 'chineseZodiac'))

// 未完成测试
const inProgress = computed(() => {
  const list = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith('starheart_progress_')) {
      try {
        const p = JSON.parse(localStorage.getItem(k))
        list.push({ key: k, ...p })
      } catch {}
    }
  }
  return list
})

function resumeTest(item) {
  router.push(`/test/${item.type}/${item.version}`)
}

function removeProgress(key) {
  localStorage.removeItem(key)
  // force recompute
  router.go(0)
}

function goToItem(item) {
  if (didSwipe || swipedId.value) return
  resetSwipe()
  if (item.type === 'bigfive' || item.type === 'enneagram') {
    router.push(`/result/${item.type}/${item.version || 'full'}`)
  } else if (item.type === 'constellation') {
    router.push(`/constellation/${item.key}`)
  } else if (item.type === 'chineseZodiac') {
    router.push(`/chinese-zodiac/${item.key}`)
  }
}

function formatTime(ts) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.profile { min-height: 100dvh; background: var(--color-bg); display: flex; flex-direction: column; }
.content { flex: 1; padding: 32px 20px 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.badge { padding: 6px 16px; background: var(--color-surface); border-radius: var(--radius-lg); font-size: 14px; color: var(--color-primary); }
.headline { font-family: var(--font-heading); font-size: 32px; color: var(--color-text); }
.subhead { font-size: 16px; color: var(--color-text-secondary); }
.empty-state { margin-top: 40px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.empty-icon { font-size: 64px; }
.empty-text { font-size: 16px; color: var(--color-text-secondary); }
.start-btn { padding: 14px 32px; background: var(--color-primary); color: var(--color-white); border: none; border-radius: var(--radius-lg); font-family: var(--font-heading); font-size: 16px; cursor: pointer; }

.history { width: 100%; display: flex; flex-direction: column; gap: 12px; }
.section-title { font-family: var(--font-heading); font-size: 14px; color: var(--color-secondary); padding: 4px 0; }
.swipe-row { position: relative; overflow: hidden; border-radius: var(--radius-lg); }
.del-btn { position: absolute; right: 0; top: 0; bottom: 0; width: 72px; background: #E05A5A; color: #fff; border: none; border-radius: 0 var(--radius-lg) var(--radius-lg) 0; font-family: var(--font-heading); font-size: 14px; cursor: pointer; z-index: 0; }
.hist-item { width: 100%; padding: 16px 20px; background: var(--color-white); border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; transition: transform 0.2s ease; }
.hist-item:active { transform: scale(0.98); }
.hist-item.in-progress { border: 1.5px dashed var(--color-primary); background: var(--color-surface); }
.hist-progress { font-size: 13px; color: var(--color-primary); font-weight: 600; }
.hist-type { font-family: var(--font-heading); font-size: 14px; color: var(--color-text); }
.hist-time { font-size: 13px; color: var(--color-text-secondary); }

.tab-bar { padding: 12px 21px 21px; background: var(--color-bg); }
.pill { display: flex; height: 62px; background: var(--color-white); border-radius: var(--radius-pill); padding: 4px; border: 1px solid var(--color-border); }
.tab { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border-radius: 26px; cursor: pointer; transition: background 0.2s; }
.tab.active { background: var(--color-primary); }
.tab.active .tab-icon, .tab.active .tab-label { color: var(--color-white); }
.tab-icon { font-size: 18px; color: var(--color-text-secondary); }
.tab-label { font-family: var(--font-heading); font-size: 10px; color: var(--color-text-secondary); }
</style>
