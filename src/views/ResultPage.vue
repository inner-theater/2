<template>
  <div class="result-page">
    <div class="content">
      <!-- Badge + Type -->
      <div class="badge">✦ {{ testTitle }} · {{ versionName }}</div>
      <h1 class="type-name">{{ personality.name }}</h1>
      <p class="type-sub">{{ personality.subtitle }}</p>

      <!-- 分数卡片 -->
      <div class="scores-card">
        <h2 class="card-title">{{ scoreTitle }}</h2>
        <div v-for="(label, dim) in displayScores" :key="dim" class="dim-row">
          <span class="dim-label">{{ label }}</span>
          <div class="dim-bar"><div class="dim-fill" :style="{ width: scores[dim] + '%', background: dimColors[dim % dimColors.length] }" /></div>
          <span class="dim-score">{{ scores[dim] }}%</span>
        </div>
      </div>

      <!-- 像素海报 -->
      <div class="poster-section">
        <h2 class="card-title">🧸 你的专属像素海报</h2>
        <div ref="posterRef" class="poster-card">
          <span class="poster-type">{{ personality.name }}</span>
          <div class="poster-char">
            <img :src="personality.character" alt="pixel character" class="char-img" />
          </div>
          <div class="poster-scores">
            <span v-for="(label, dim) in shortScores" :key="dim" class="ps-line" :style="{ color: personality.color }">
              {{ label }} {{ '█'.repeat(Math.floor(scores[dim] / 10)) }}{{ '░'.repeat(10 - Math.floor(scores[dim] / 10)) }} {{ scores[dim] }}%
            </span>
          </div>
          <div class="poster-footer">
            <span class="pf-brand">✦ 星心测试</span>
            <canvas ref="qrCanvas" width="48" height="48" class="pf-qr"></canvas>
          </div>
        </div>
        <button class="share-btn" @click="savePoster">保存海报</button>
      </div>

      <!-- AI 深度解读 -->
      <div class="analysis-card" v-if="aiAnalysis">
        <h2 class="card-title">✨ AI 深度解读</h2>
        <p class="analysis-text">{{ aiAnalysis }}</p>
      </div>

      <div class="analysis-card" v-if="aiLoading">
        <h2 class="card-title">✨ 正在生成深度解读...</h2>
        <p class="analysis-text" style="text-align:center">🤖 AI 正在调用 {{ currentModel }} 为你生成专属人格分析...</p>
      </div>

      <div class="analysis-card" v-if="aiError" style="border: 2px solid #D4B8C7;">
        <h2 class="card-title" style="color:#D4B8C7;">💫 解读生成中</h2>
        <p class="analysis-text" style="text-align:center; color: var(--color-text-secondary);">
          AI 服务暂时繁忙，请稍后刷新页面重试。
        </p>
      </div>

      <!-- 行动按钮 -->
      <div class="actions">
        <button class="btn-secondary" @click="$router.push('/')">重新测试</button>
        <button class="btn-primary" @click="$router.push('/')">返回首页</button>
      </div>
    </div>

    <nav class="tab-bar">
      <div class="pill">
        <div class="tab active" @click="$router.push('/')"><span class="tab-icon">✦</span><span class="tab-label">首页</span></div>
        <div class="tab" @click="$router.push('/test')"><span class="tab-icon">◆</span><span class="tab-label">测试</span></div>
        <div class="tab" @click="$router.push('/fortune')"><span class="tab-icon">★</span><span class="tab-label">星相</span></div>
        <div class="tab" @click="$router.push('/profile')"><span class="tab-icon">◈</span><span class="tab-label">我的</span></div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bigFiveTypes, enneagramTypes, calculateBigFive, calculateEnneagram } from '../data/personalities.js'
import { testInfo } from '../data/questions.js'
import { getAIAnalysis } from '../data/ai-analysis.js'

const props = defineProps({ testType: String, version: String })
const router = useRouter()
const posterRef = ref(null)
const qrCanvas = ref(null)
const personality = ref({ name: '', subtitle: '', character: '', description: '', traits: [] })
const scores = ref({})
const aiAnalysis = ref('')
const aiLoading = ref(true)
const aiError = ref(false)
const currentModel = ref('通义千问Max')

const testTitle = computed(() => testInfo[props.testType]?.title || '')
const versionName = computed(() => props.version === 'lite' ? '精简版' : '完整版')

const dimColors = ['#9B8EC4', '#89A89B', '#D4B8C7', '#9B8EC4', '#89A89B']
const dimLabels = { openness: '开放性', conscientiousness: '尽责性', extraversion: '外向性', agreeableness: '宜人性', neuroticism: '神经质' }
const enneaDimLabels = { 1: '1号', 2: '2号', 3: '3号', 4: '4号', 5: '5号', 6: '6号', 7: '7号', 8: '8号', 9: '9号' }

const scoreTitle = computed(() => props.testType === 'bigfive' ? '五大维度分数' : '九型人格分布')

const displayScores = computed(() => {
  const s = scores.value
  if (props.testType === 'bigfive') {
    const ordered = {}
    for (const [dim, pct] of Object.entries(s).sort((a, b) => b[1] - a[1])) {
      ordered[dim] = pct
    }
    return Object.fromEntries(
      Object.entries(ordered).map(([k, v]) => [k, dimLabels[k] || k])
    )
  }
  return Object.fromEntries(
    Object.entries(s).map(([k, v]) => [k, enneaDimLabels[k] || k])
  )
})

const shortScores = computed(() => {
  const entries = Object.entries(scores.value).slice(0, 3)
  return Object.fromEntries(entries.map(([k, v]) => [
    k,
    (props.testType === 'bigfive' ? dimLabels[k] : enneaDimLabels[k]) || k
  ]))
})

onMounted(async () => {
  const state = history.state
  if (!state?.answers) return router.replace('/')

  const answers = state.answers

  if (props.testType === 'bigfive') {
    const result = calculateBigFive(answers, props.version)
    scores.value = result.scores
    personality.value = bigFiveTypes[result.type] || bigFiveTypes.explorer
  } else {
    const result = calculateEnneagram(answers)
    scores.value = result.scores
    const typeNum = result.type
    personality.value = enneagramTypes[typeNum] || enneagramTypes[4]
  }

  // AI 深度解读
  try {
    const analysis = await getAIAnalysis({
      type: props.testType,
      personality: personality.value,
      scores: scores.value
    })
    if (analysis) aiAnalysis.value = analysis
  } catch (e) {
    console.error('所有 AI 模型均失败:', e.message)
    aiError.value = true
  } finally {
    aiLoading.value = false
  }

  // 生成二维码
  const shareUrl = window.location.href
  generateQR(shareUrl, qrCanvas.value)

  // 保存测试记录
  try {
    const saved = localStorage.getItem('starheart_history')
    const history = saved ? JSON.parse(saved) : []
    history.unshift({
      name: personality.value.name,
      type: props.testType,
      version: props.version,
      time: Date.now()
    })
    localStorage.setItem('starheart_history', JSON.stringify(history.slice(0, 10)))
  } catch {}
})

async function savePoster() {
  if (!posterRef.value) return
  try {
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(posterRef.value, {
      backgroundColor: '#F0EDF5',
      scale: 2,
      useCORS: true
    })
    const link = document.createElement('a')
    link.download = `starheart-${personality.value.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    alert('海报保存失败，请重试')
  }
}

// 生成简易 QR Code
function generateQR(text, canvas) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const size = 48
  canvas.width = size; canvas.height = size
  ctx.fillStyle = '#3A3550'
  // 用 hashCode 生成像素图案模拟二维码
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i)
    hash |= 0
  }
  const seed = Math.abs(hash)
  const cellSize = 4
  for (let y = 0; y < size / cellSize; y++) {
    for (let x = 0; x < size / cellSize; x++) {
      if (x < 3 || y < 3 || x >= 9 || y >= 9) {
        const val = (seed * (x * 13 + y * 7 + 1)) & 1
        if (val) ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
  }
}
</script>

<style scoped>
.result-page {
  min-height: 100dvh;
  background: var(--color-bg);
}

.content {
  padding: 24px 20px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.badge {
  padding: 6px 16px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  font-size: 14px;
  color: var(--color-primary);
}
.type-name {
  font-family: var(--font-heading);
  font-size: 36px;
  color: var(--color-text);
  text-align: center;
}
.type-sub {
  font-size: 18px;
  color: var(--color-text-secondary);
}

.scores-card, .poster-section, .analysis-card {
  width: 100%;
  padding: 24px 20px;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card-title {
  font-family: var(--font-heading);
  font-size: 16px;
  color: var(--color-secondary);
}

.dim-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dim-label { font-size: 15px; color: var(--color-text); min-width: 60px; }
.dim-bar {
  flex: 1;
  height: 12px;
  background: var(--color-border);
  border-radius: 6px;
  overflow: hidden;
}
.dim-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}
.dim-score { font-size: 15px; font-weight: 600; min-width: 36px; text-align: right; }

/* 海报 */
.poster-section { align-items: center; }
.poster-card {
  width: 280px;
  padding: 24px 20px;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.poster-type {
  font-family: var(--font-heading);
  font-size: 18px;
  color: var(--color-primary);
}
.poster-char {
  width: 120px;
  height: 120px;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.char-img { width: 100%; height: 100%; object-fit: contain; }
.poster-scores {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}
.ps-line { font-size: 13px; }
.poster-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pf-brand { font-family: var(--font-heading); font-size: 12px; color: var(--color-text); }
.pf-qr {
  width: 40px; height: 40px;
  background: var(--color-white);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.share-btn {
  width: 100%;
  padding: 14px 0;
  background: var(--color-secondary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-heading);
  font-size: 16px;
  cursor: pointer;
}
.share-btn:active { transform: scale(0.98); }

.analysis-text {
  font-size: 15px;
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre-line;
}

.actions {
  width: 100%;
  display: flex;
  gap: 12px;
}
.btn-primary, .btn-secondary {
  flex: 1;
  padding: 14px 0;
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-heading);
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.btn-primary:active, .btn-secondary:active { transform: scale(0.97); }
.btn-primary { background: var(--color-primary); color: var(--color-white); }
.btn-secondary { background: var(--color-white); border: 1.5px solid var(--color-border); color: var(--color-text-secondary); }

/* Tab Bar */
.tab-bar {
  padding: 12px 21px 21px;
  background: var(--color-bg);
}
.pill {
  display: flex;
  height: 62px;
  background: var(--color-white);
  border-radius: var(--radius-pill);
  padding: 4px;
  border: 1px solid var(--color-border);
}
.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 26px;
}
.tab.active {
  background: var(--color-primary);
}
.tab.active .tab-icon,
.tab.active .tab-label { color: var(--color-white); }
.tab-icon { font-size: 18px; color: var(--color-text-secondary); }
.tab-label { font-family: var(--font-heading); font-size: 10px; color: var(--color-text-secondary); }
</style>
