<template>
  <div class="zodiac-page">
    <div class="content">
      <div class="badge" :style="{ background: sign.color + '22', color: sign.color }">
        {{ sign.emoji }} {{ sign.name }} · {{ sign.date }}
      </div>

      <div class="sign-hero">
        <img :src="sign.character" alt="" class="sign-char" />
        <h1 class="sign-name">{{ sign.latin }} {{ sign.emoji }}</h1>
      </div>

      <div class="info-grid">
        <div class="info-item"><span class="info-label">元素</span><span class="info-val">{{ sign.element }}</span></div>
        <div class="info-item"><span class="info-label">守护星</span><span class="info-val">{{ sign.ruler }}</span></div>
        <div class="info-item"><span class="info-label">匹配星座</span><span class="info-val">{{ compat }}</span></div>
      </div>

      <div class="card">
        <h2 class="card-title">✦ 性格全面解析</h2>
        <div class="trait-tags">
          <span v-for="t in sign.traits" :key="t" class="trait-tag" :style="{ background: sign.color + '22', color: sign.color }">{{ t }}</span>
        </div>
        <p v-if="aiLoading" class="desc-text loading-text">✨ AI 正在结合你的生日为你深度解析...</p>
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
        <p v-if="aiLoading" class="desc-text loading-text">✨ 正在推演你的星象运势...</p>
        <p v-else-if="aiError" class="desc-text error-text">⚠️ AI 服务暂时不可用，请稍后重试</p>
        <p v-else class="desc-text">{{ aiContent.fortune }}</p>
      </div>

      <div class="poster-section" ref="posterRef">
        <h2 class="card-title">🧸 你的星座海报</h2>
        <div class="poster-card">
          <div class="poster-bg" :style="{ background: sign.color + '11' }">
            <span class="z-emoji">{{ sign.emoji }}</span>
            <span class="z-name">{{ sign.name }}</span>
            <img :src="sign.character" alt="" class="z-char-img" />
            <span class="z-elem">{{ sign.element }} · 守护星 {{ sign.ruler }}</span>
            <div class="z-traits">
              <span v-for="t in sign.traits" :key="t" class="z-trait"><template v-if="t.length > 2">{{ t.slice(0,2) }}<br>{{ t.slice(2) }}</template><template v-else>{{ t }}</template></span>
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
import { zodiacData } from '../data/zodiac.js'
import { getZodiacAnalysis } from '../data/ai-analysis.js'

const route = useRoute()
const router = useRouter()
const posterRef = ref(null)
const nextYear = new Date().getFullYear() + 1

const signKey = computed(() => route.params.sign || 'aries')
const sign = computed(() => zodiacData[signKey.value] || zodiacData.aries)

const aiContent = ref({ personality: '', career: '', love: '', fortune: '' })
const aiLoading = ref(true)
const aiError = ref(false)

// 缓存管理
function cacheKey() {
  const b = getBirthdayRaw()
  return `v2_zodiac_${b.year}_${b.month}_${b.day}_${b.isSolar ? 's' : 'l'}_${signKey.value}`
}
function getBirthdayRaw() {
  try {
    const saved = localStorage.getItem('starheart_fortune')
    if (saved) return JSON.parse(saved)
  } catch {}
  return { year: 2000, month: 1, day: 1, isSolar: true }
}
function getBirthday() {
  const s = getBirthdayRaw()
  const cal = s.isSolar ? '阳历' : '农历'
  return `${s.year}年${s.month}月${s.day}日（${cal}）`
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

onMounted(async () => {
  // 记录到历史
  saveHistory()

  const key = cacheKey()
  const cached = loadCache(key)

  if (cached) {
    aiContent.value = cached
    aiLoading.value = false
    return
  }

  try {
    const birthday = getBirthday()
    const result = await getZodiacAnalysis({
      sign: sign.value,
      birthday,
      zodiacType: 'constellation'
    })
    aiContent.value = result
    saveCache(key, result)
  } catch (e) {
    console.error('AI analysis failed:', e.message)
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
    if (list.length && list[0].type === 'constellation' && list[0].key === signKey.value) return
    list.unshift({
      type: 'constellation',
      name: sign.value.name,
      emoji: sign.value.emoji,
      key: signKey.value,
      time: Date.now()
    })
    localStorage.setItem('starheart_history', JSON.stringify(list.slice(0, 30)))
  } catch {}
}

const compat = computed(() => {
  const map = {
    aries: '狮子座、射手座', taurus: '处女座、摩羯座', gemini: '天秤座、水瓶座',
    cancer: '天蝎座、双鱼座', leo: '白羊座、射手座', virgo: '金牛座、摩羯座',
    libra: '双子座、水瓶座', scorpio: '巨蟹座、双鱼座', sagittarius: '白羊座、狮子座',
    capricorn: '金牛座、处女座', aquarius: '双子座、天秤座', pisces: '巨蟹座、天蝎座'
  }
  return map[signKey.value] || ''
})

async function savePoster() {
  if (!posterRef.value) return
  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(posterRef.value.querySelector('.poster-bg'), {
      backgroundColor: '#F0EDF5', scale: 2, useCORS: true
    })
    const link = document.createElement('a')
    link.download = `starheart-${sign.value.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    alert('保存失败')
  }
}
</script>

<style scoped>
.zodiac-page { min-height: 100dvh; background: var(--color-bg); }

.content { padding: 24px 20px 80px; display: flex; flex-direction: column; align-items: center; gap: 24px; }

.badge { padding: 8px 20px; border-radius: var(--radius-lg); font-size: 15px; font-weight: 600; }
.sign-hero { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.sign-char { width: 140px; height: 140px; border-radius: var(--radius-xl); object-fit: contain; padding: 16px; background: linear-gradient(135deg, #5B4A7A 0%, #43355A 100%); }
.sign-name { font-family: var(--font-heading); font-size: 32px; color: var(--color-text); }

.info-grid { width: 100%; display: flex; gap: 8px; }
.info-item { flex: 1; padding: 12px; background: var(--color-white); border-radius: var(--radius-md); text-align: center; display: flex; flex-direction: column; gap: 4px; }
.info-label { font-size: 12px; color: var(--color-text-secondary); }
.info-val { font-size: 14px; color: var(--color-text); font-weight: 600; }

.card { width: 100%; padding: 24px 20px; background: var(--color-white); border-radius: var(--radius-xl); display: flex; flex-direction: column; gap: 16px; }
.card-title { font-family: var(--font-heading); font-size: 16px; color: var(--color-secondary); }
.trait-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.trait-tag { padding: 6px 14px; border-radius: var(--radius-pill); font-size: 14px; font-weight: 600; }
.desc-text { font-size: 15px; color: var(--color-text); line-height: 1.8; white-space: pre-line; }
.loading-text { color: var(--color-primary); text-align: center; padding: 12px 0; }
.error-text { color: #D4B8C7; text-align: center; padding: 12px 0; }

.poster-section { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.poster-card { width: 100%; }
.poster-bg { padding: 32px 24px; border-radius: var(--radius-xl); display: flex; flex-direction: column; align-items: center; gap: 14px; border: 2px dashed var(--color-border); }
.z-emoji { font-size: 48px; }
.z-name { font-family: var(--font-heading); font-size: 24px; color: var(--color-text); }
.z-char-img { width: 100px; height: 100px; object-fit: contain; border-radius: var(--radius-lg); padding: 8px; background: linear-gradient(135deg, #5B4A7A 0%, #43355A 100%); }
.z-elem { font-size: 14px; color: var(--color-text-secondary); }
.z-traits { display: flex; gap: 8px; }
.z-trait { padding: 6px 12px; background: var(--color-surface); border-radius: var(--radius-pill); font-size: 13px; text-align: center; line-height: 1.5; display: inline-block; }
.z-brand { font-family: var(--font-heading); font-size: 12px; color: var(--color-text-secondary); margin-top: 4px; }

.share-btn, .btn-back { width: 100%; padding: 14px 0; border: none; border-radius: var(--radius-lg); font-family: var(--font-heading); font-size: 16px; cursor: pointer; }
.share-btn { background: var(--color-secondary); color: var(--color-white); }
.btn-back { background: var(--color-white); border: 1.5px solid var(--color-border); color: var(--color-text-secondary); }
.share-btn:active, .btn-back:active { transform: scale(0.98); }
</style>
