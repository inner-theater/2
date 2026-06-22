<template>
  <div class="zodiac-page">
    <div class="content">
      <div class="badge" :style="{ background: signColor + '22', color: signColor }">
        {{ sign.emoji }} 生肖命理 · {{ sign.elem }}属
      </div>

      <div class="sign-hero">
        <span class="sign-emoji-big">{{ sign.emoji }}</span>
        <h1 class="sign-name">{{ sign.name }}</h1>
        <p class="sign-subtitle">十二生肖之{{ sign.name }}</p>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">五行属性</span>
          <span class="info-val">{{ sign.elem }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">象征意义</span>
          <span class="info-val">{{ sign.symbol }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">相配属相</span>
          <span class="info-val">{{ sign.compatibility }}</span>
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">✦ 核心特质</h2>
        <div class="trait-tags">
          <span v-for="t in sign.traits" :key="t" class="trait-tag" :style="{ background: signColor + '22', color: signColor }">{{ t }}</span>
        </div>
      </div>

      <div class="card">
        <h2 class="card-title">✦ 性格全面解析</h2>
        <p v-if="aiLoading" class="desc-text loading-text">✨ AI 正在结合你的生辰为你深度解析...</p>
        <p v-else-if="aiError" class="desc-text error-text">⚠️ AI 服务暂时不可用，请稍后重试</p>
        <p v-else class="desc-text">{{ aiContent.personality }}</p>
      </div>

      <div class="card">
        <h2 class="card-title">✦ 事业与财运</h2>
        <p v-if="aiLoading" class="desc-text loading-text">✨ 正在分析你的职业潜能...</p>
        <p v-else-if="aiError" class="desc-text error-text">⚠️ AI 服务暂时不可用，请稍后重试</p>
        <p v-else class="desc-text">{{ aiContent.career }}</p>
      </div>

      <div class="card">
        <h2 class="card-title">✦ 爱情与人际</h2>
        <p v-if="aiLoading" class="desc-text loading-text">✨ 正在解读你的感情密码...</p>
        <p v-else-if="aiError" class="desc-text error-text">⚠️ AI 服务暂时不可用，请稍后重试</p>
        <p v-else class="desc-text">{{ aiContent.love }}</p>
      </div>

      <div class="card">
        <h2 class="card-title">✦ {{ nextYear }} 年运势展望</h2>
        <p v-if="aiLoading" class="desc-text loading-text">✨ 正在推演你的生肖运势...</p>
        <p v-else-if="aiError" class="desc-text error-text">⚠️ AI 服务暂时不可用，请稍后重试</p>
        <p v-else class="desc-text">{{ aiContent.fortune }}</p>
      </div>

      <div class="poster-section" ref="posterRef">
        <h2 class="card-title">🧸 你的生肖海报</h2>
        <div class="poster-card">
          <div class="poster-bg" :style="{ background: signColor + '11' }">
            <span class="z-emoji">{{ sign.emoji }}</span>
            <span class="z-name">生肖 · {{ sign.name }}</span>
            <span class="z-elem">五行{{ sign.elem }} · {{ sign.symbol }}</span>
            <div class="z-traits">
              <span v-for="t in sign.traits.slice(0, 4)" :key="t" class="z-trait">{{ t }}</span>
            </div>
            <div class="z-brand">✦ 星心测试</div>
          </div>
        </div>
        <button class="share-btn" @click="savePoster">保存海报</button>
      </div>

      <button class="btn-back" @click="$router.push('/fortune')">返回星相</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chineseZodiacData } from '../data/zodiac.js'
import { getChineseZodiacAnalysis } from '../data/ai-analysis.js'

const route = useRoute()
const router = useRouter()
const posterRef = ref(null)
const nextYear = new Date().getFullYear() + 1

const aiContent = ref({ personality: '', career: '', love: '', fortune: '' })
const aiLoading = ref(true)
const aiError = ref(false)

function cacheKey() {
  const b = getBirthdayRaw()
  return `v2_cnzodiac_${b.year}_${b.isSolar ? 's' : 'l'}_${signKey.value}`
}
function getBirthdayRaw() {
  try {
    const saved = localStorage.getItem('starheart_fortune')
    if (saved) return JSON.parse(saved)
  } catch {}
  return { year: 2000, month: 1, day: 1, isSolar: true }
}
function loadCache(key) {
  try {
    const saved = localStorage.getItem('starheart_ai_cache')
    if (saved) {
      const cache = JSON.parse(saved)
      return cache[key] || null
    }
  } catch {}
  return null
}
function saveCache(key, data) {
  try {
    const saved = localStorage.getItem('starheart_ai_cache')
    const cache = saved ? JSON.parse(saved) : {}
    cache[key] = data
    localStorage.setItem('starheart_ai_cache', JSON.stringify(cache))
  } catch {}
}

const signKey = computed(() => route.params.sign || 'rat')
const sign = computed(() => chineseZodiacData[signKey.value] || chineseZodiacData.rat)

onMounted(async () => {
  saveHistory()

  const key = cacheKey()
  const cached = loadCache(key)

  if (cached) {
    aiContent.value = cached
    aiLoading.value = false
    return
  }

  try {
    const b = getBirthdayRaw()
    const result = await getChineseZodiacAnalysis({
      sign: sign.value,
      year: b.year
    })
    aiContent.value = result
    saveCache(key, result)
  } catch (e) {
    console.error('AI zodiac analysis failed:', e.message)
    aiError.value = true
  } finally {
    aiLoading.value = false
  }
})

function saveHistory() {
  try {
    const saved = localStorage.getItem('starheart_history')
    const list = saved ? JSON.parse(saved) : []
    // 去重：如果最新一条与当前相同则不重复记录
    if (list.length && list[0].type === 'chineseZodiac' && list[0].key === signKey.value) return
    list.unshift({
      type: 'chineseZodiac',
      name: sign.value.name,
      emoji: sign.value.emoji,
      key: signKey.value,
      time: Date.now()
    })
    localStorage.setItem('starheart_history', JSON.stringify(list.slice(0, 30)))
  } catch {}
}

const signColor = computed(() => {
  const colors = {
    rat: '#3B82F6', ox: '#92400E', tiger: '#DC2626', rabbit: '#10B981',
    dragon: '#F59E0B', snake: '#7C3AED', horse: '#EF4444', goat: '#84CC16',
    monkey: '#FBBF24', rooster: '#F59E0B', dog: '#78716C', pig: '#EC4899'
  }
  return colors[signKey.value] || '#7C3AED'
})

async function savePoster() {
  if (!posterRef.value) return
  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(posterRef.value.querySelector('.poster-bg'), {
      backgroundColor: '#F0EDF5', scale: 2, useCORS: true
    })
    const link = document.createElement('a')
    link.download = `starheart-zodiac-${sign.value.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    alert('保存失败')
  }
}
</script>

<style scoped>
.zodiac-page { min-height: 100dvh; background: var(--color-bg); }

.content { padding: 24px 20px 80px; display: flex; flex-direction: column; align-items: center; gap: 20px; }

.badge { padding: 8px 20px; border-radius: var(--radius-lg); font-size: 15px; font-weight: 600; }
.sign-hero { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.sign-emoji-big { font-size: 80px; line-height: 1; }
.sign-name { font-family: var(--font-heading); font-size: 36px; color: var(--color-text); }
.sign-subtitle { font-size: 16px; color: var(--color-text-secondary); }

.info-grid { width: 100%; display: flex; gap: 8px; }
.info-item { flex: 1; padding: 12px; background: var(--color-white); border-radius: var(--radius-md); text-align: center; display: flex; flex-direction: column; gap: 4px; }
.info-label { font-size: 12px; color: var(--color-text-secondary); }
.info-val { font-size: 14px; color: var(--color-text); font-weight: 600; }

.card { width: 100%; padding: 20px; background: var(--color-white); border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 14px; }
.card-title { font-family: var(--font-heading); font-size: 16px; color: var(--color-secondary); }
.trait-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.trait-tag { padding: 6px 14px; border-radius: var(--radius-pill); font-size: 14px; font-weight: 600; }
.desc-text { font-size: 15px; color: var(--color-text); line-height: 1.8; white-space: pre-line; }
.loading-text { color: var(--color-primary); text-align: center; padding: 12px 0; }
.error-text { color: #D4B8C7; text-align: center; padding: 12px 0; }

.poster-section { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.poster-card { width: 100%; }
.poster-bg { padding: 32px 24px; border-radius: var(--radius-xl); display: flex; flex-direction: column; align-items: center; gap: 14px; border: 2px dashed var(--color-border); }
.z-emoji { font-size: 56px; }
.z-name { font-family: var(--font-heading); font-size: 24px; color: var(--color-text); }
.z-elem { font-size: 14px; color: var(--color-text-secondary); }
.z-traits { display: flex; gap: 8px; }
.z-trait { padding: 4px 12px; background: var(--color-surface); border-radius: var(--radius-pill); font-size: 13px; }
.z-brand { font-family: var(--font-heading); font-size: 12px; color: var(--color-text-secondary); margin-top: 4px; }

.share-btn, .btn-back { width: 100%; padding: 14px 0; border: none; border-radius: var(--radius-lg); font-family: var(--font-heading); font-size: 16px; cursor: pointer; }
.share-btn { background: var(--color-secondary); color: var(--color-white); }
.btn-back { background: var(--color-white); border: 1.5px solid var(--color-border); color: var(--color-text-secondary); }
.share-btn:active, .btn-back:active { transform: scale(0.98); }
</style>
