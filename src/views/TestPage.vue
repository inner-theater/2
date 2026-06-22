<template>
  <div class="test-page">
    <div class="content">
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-text">第 {{ current + 1 }} / {{ questions.length }} 题</span>
          <span class="timer">⏱ {{ formattedTime }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
        </div>
      </div>

      <div class="question-card">
        <span class="q-number">Q{{ String(current + 1).padStart(2, '0') }}</span>
        <p class="q-text">{{ questions[current]?.text }}</p>

        <div class="options">
          <button
            v-for="(opt, idx) in options"
            :key="idx"
            class="option"
            :class="{ selected: answers[current] === idx + 1 }"
            @click="select(idx + 1)"
          >
            {{ idx + 1 }} · {{ opt }}
          </button>
        </div>
      </div>

      <div class="nav-buttons">
      <button class="btn-back" @click="handleBack">
        {{ current === 0 ? '返回' : '上一题' }}
      </button>
      <button class="btn-next" @click="goNext">
        {{ isLast ? '查看结果' : '下一题' }}
      </button>
    </div>

    <!-- 退出确认弹窗 -->
    <div v-if="showExitModal" class="modal-mask" @click.self="cancelExit">
      <div class="modal-card">
        <p class="modal-title">确定要退出吗？</p>
        <p class="modal-sub">已完成 {{ current }} / {{ questions.length }} 题</p>
        <button class="modal-btn save-btn" @click="exitWithSave">保留进度退出</button>
        <button class="modal-btn clear-btn" @click="exitAndClear">清除进度退出</button>
        <button class="modal-btn cancel-btn" @click="cancelExit">继续答题</button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { getBigFiveQuestions, getEnneagramQuestions, testInfo } from '../data/questions.js'

const props = defineProps({ type: String, version: String })
const router = useRouter()

const questions = ref([])
const answers = ref([])
const current = ref(0)
const startTime = ref(Date.now())
const elapsed = ref(0)
const showExitModal = ref(false)
let isSubmitting = false
let timer = null

const options = props.type === 'bigfive'
  ? ['很不同意', '不同意', '中立', '同意', '很同意']
  : ['不符合', '不太符', '部分符', '较符合', '很符合']

const isLast = computed(() => current.value >= questions.value.length - 1)
const progressPercent = computed(() =>
  questions.value.length ? ((current.value + 1) / questions.value.length) * 100 : 0
)
const formattedTime = computed(() => {
  const m = Math.floor(elapsed.value / 60)
  const s = elapsed.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

// 进度存储 key
const progressKey = computed(() => `starheart_progress_${props.type}_${props.version}`)

// 尝试恢复进度
function restoreProgress() {
  try {
    const saved = localStorage.getItem(progressKey.value)
    if (saved) {
      const p = JSON.parse(saved)
      if (p.questions && p.questions.length) {
        questions.value = p.questions
        answers.value = p.answers
        current.value = p.current
        elapsed.value = p.elapsed
        startTime.value = Date.now() - p.elapsed * 1000
        return true
      }
      // 旧格式不含题目 → 清除重新开始
      localStorage.removeItem(progressKey.value)
    }
  } catch {}
  return false
}

onMounted(() => {
  // 初始化题库
  if (props.type === 'bigfive') {
    questions.value = getBigFiveQuestions(props.version)
  } else {
    questions.value = getEnneagramQuestions(props.version)
  }

  const restored = restoreProgress()
  if (!restored) {
    answers.value = new Array(questions.value.length).fill(0)
  }

  timer = setInterval(() => { elapsed.value = Math.floor((Date.now() - startTime.value) / 1000) }, 1000)
})

onBeforeUnmount(() => {
  saveProgress()
  clearInterval(timer)
})

// 页面隐藏/刷新时自动保存进度
function onVisibilityChange() {
  if (document.hidden) saveProgress()
}
window.addEventListener('beforeunload', saveProgress)
window.addEventListener('visibilitychange', onVisibilityChange)
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', saveProgress)
  window.removeEventListener('visibilitychange', onVisibilityChange)
})

// 拦截浏览器返回/路由离开
onBeforeRouteLeave((to, from) => {
  if (isSubmitting) return true  // 提交结果 → 放行
  if (showExitModal.value) return true
  showExitModal.value = true
  return false
})

// 保存进度
function saveProgress() {
  const p = { type: props.type, version: props.version, current: current.value, answers: answers.value, elapsed: elapsed.value, total: questions.value.length, questions: questions.value, title: testInfo[props.type]?.title || '' }
  localStorage.setItem(progressKey.value, JSON.stringify(p))
}

// 清除进度
function clearProgress() {
  localStorage.removeItem(progressKey.value)
}

function select(val) {
  answers.value[current.value] = val
  saveProgress()
  if (!isLast.value) {
    setTimeout(() => current.value++, 200)
  }
}

function goBack() {
  if (current.value > 0) current.value--
}

function handleBack() {
  if (current.value === 0) {
    showExitModal.value = true
  } else {
    goBack()
  }
}

function exitWithSave() {
  saveProgress()
  clearInterval(timer)
  router.push('/test')
}

function exitAndClear() {
  clearProgress()
  clearInterval(timer)
  router.push('/test')
}

function cancelExit() {
  showExitModal.value = false
}

function goNext() {
  if (isLast.value) {
    // 检查是否全部答完
    const unanswered = answers.value.findIndex(v => !v)
    if (unanswered >= 0) {
      current.value = unanswered
      return
    }
    clearInterval(timer)
    clearProgress()
    isSubmitting = true
    const result = answers.value.map((v, i) => ({
      ...questions.value[i],
      value: v,
      time: elapsed.value
    }))
    router.push({
      path: `/result/${props.type}/${props.version}`,
      state: { answers: result, time: elapsed.value }
    })
  } else if (answers.value[current.value]) {
    current.value++
    saveProgress()
  }
}
</script>

<style scoped>
.test-page {
  min-height: 100dvh;
  background: var(--color-bg);
}

.content {
  padding: 24px 20px 80px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.progress-section { display: flex; flex-direction: column; gap: 14px; }
.progress-info { display: flex; justify-content: space-between; }
.progress-text { font-size: 16px; color: var(--color-text-secondary); }
.timer { font-size: 16px; color: var(--color-secondary); }
.progress-bar {
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.question-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}
.q-number {
  font-family: var(--font-heading);
  font-size: 14px;
  color: var(--color-secondary);
}
.q-text {
  font-size: 20px;
  color: var(--color-text);
  text-align: center;
  line-height: 1.6;
}

.options {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.option {
  width: 100%;
  padding: 14px 20px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  font-size: 16px;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.option:active { transform: scale(0.98); }
.option.selected {
  border-color: var(--color-primary);
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.btn-back, .btn-next {
  flex: 0 0 calc(50% - 6px);
  padding: 14px 0;
  border-radius: var(--radius-lg);
  border: none;
  font-family: var(--font-heading);
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.btn-back:active, .btn-next:active { transform: scale(0.97); }
.btn-back {
  background: var(--color-white);
  border: 1.5px solid var(--color-border);
  color: var(--color-text-secondary);
}
.btn-next {
  background: var(--color-primary);
  color: var(--color-white);
}

/* 退出弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(58, 53, 80, 0.6); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-card { width: 85%; max-width: 340px; background: var(--color-white); border-radius: var(--radius-xl); padding: 32px 24px 32px; display: flex; flex-direction: column; gap: 12px; }
.modal-title { font-family: var(--font-heading); font-size: 20px; color: var(--color-text); text-align: center; }
.modal-sub { font-size: 14px; color: var(--color-text-secondary); text-align: center; padding-bottom: 8px; }
.modal-btn { width: 100%; padding: 14px 0; border: none; border-radius: var(--radius-lg); font-family: var(--font-heading); font-size: 16px; cursor: pointer; }
.save-btn { background: var(--color-primary); color: var(--color-white); }
.clear-btn { background: var(--color-white); border: 1.5px solid #E05A5A; color: #E05A5A; }
.cancel-btn { background: transparent; color: var(--color-text-secondary); font-size: 14px; }
.modal-btn:active { transform: scale(0.97); }
</style>
