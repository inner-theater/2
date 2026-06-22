// 阿里百炼 AI 集成 — 多模型链式调用
// 优先 qwen-max，额度耗尽依次切换后续模型

const API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const API_KEY = 'sk-ws-H.RPELEEP.p61n.MEQCIH2JI2qVWudheys2gj9Uye_M0aGfjZIMZ8WBbOZ2TSsKAiAEayo0jIvcHwoFsRRroonDGuBkuNHAWdjCS822hU6ArA'

// 模型链 — 按优先级排列，额度耗尽自动切换下一个
const MODEL_CHAIN = [
  { model: 'qwen-max', name: '通义千问Max' },
  { model: 'glm-5', name: '智谱GLM-5' },
  { model: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro' },
  { model: 'kimi-k2.6', name: 'Kimi K2.6' },
  { model: 'kimi-k2.5', name: 'Kimi K2.5' }
]

export async function getAIAnalysis({ type, personality, scores, zodiac }) {
  const prompt = buildPrompt({ type, personality, scores, zodiac })

  for (const { model, name } of MODEL_CHAIN) {
    try {
      console.log(`🤖 尝试调用 ${name}...`)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: '你是一位温暖专业的心理咨询师，擅长人格分析和成长建议。请用温暖、治愈的语言风格回复，300-500字，精炼而有深度。'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 1500
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ ${name} 返回成功`)
        return data.choices[0].message.content
      }

      // 429 = 额度耗尽 / 限流，换下一个模型
      // 4xx = 其他客户端错误
      console.warn(`⚠️ ${name} 返回 ${response.status}，尝试下一个模型`)
    } catch (e) {
      console.warn(`⚠️ ${name} 网络错误: ${e.message}`)
    }
  }

  // 全部模型失败 — 抛出明确错误
  throw new Error('所有 AI 模型均不可用，请检查网络或 API Key 状态')
}

function buildPrompt({ type, personality, scores, zodiac }) {
  let prompt = '请为以下测试结果生成一份温暖、专业的个性化解读和发展建议：\n\n'

  if (type === 'bigfive') {
    prompt += `【大五人格测试结果】\n`
    prompt += `人格类型：${personality.name}\n`
    prompt += `特质：${personality.subtitle}\n`
    prompt += `维度分数：\n`
    for (const [dim, label] of Object.entries({
      openness: '开放性', conscientiousness: '尽责性',
      extraversion: '外向性', agreeableness: '宜人性', neuroticism: '神经质'
    })) {
      if (scores[dim] !== undefined) {
        prompt += `  - ${label}：${scores[dim]}%\n`
      }
    }
  } else if (type === 'enneagram') {
    prompt += `【九型人格测试结果】\n`
    prompt += `核心类型：${personality.name}\n`
    prompt += `特质：${personality.subtitle}\n`
    prompt += `分数分布：\n`
    for (const [t, s] of Object.entries(scores)) {
      prompt += `  - ${t}号：${s}%\n`
    }
  }

  if (zodiac) {
    prompt += `\n【星座信息】\n`
    prompt += `星座：${zodiac.name}（${zodiac.emoji}）\n`
    prompt += `元素：${zodiac.element}\n`
    prompt += `守护星：${zodiac.ruler}\n`
  }

  prompt += '\n请提供：\n'
  prompt += '1. 核心人格洞察（结合星座特质交叉分析）\n'
  prompt += '2. 职场发展建议\n'
  prompt += '3. 关系与社交建议\n'
  prompt += '4. 个人成长方向\n'
  prompt += '请用温暖、鼓励、治愈的语气，避免说教。'
  return prompt
}

// ─── 星座/生肖 AI 深度解读 ───

async function callAI(systemPrompt, userPrompt) {
  for (const { model, name } of MODEL_CHAIN) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({ model, messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ], temperature: 0.8, max_tokens: 2000 })
      })
      if (res.ok) {
        const data = await res.json()
        return data.choices[0].message.content
      }
    } catch {}
  }
  throw new Error('AI 服务暂时不可用')
}

function parseSections(text) {
  const result = { personality: '', career: '', love: '', fortune: '' }
  
  // 尝试直接 JSON 解析
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.personality) result.personality = parsed.personality
      if (parsed.career) result.career = parsed.career
      if (parsed.love) result.love = parsed.love
      if (parsed.fortune) result.fortune = parsed.fortune
      return result
    } catch {}
  }

  // 降级：用 ### 分隔解析
  const sections = text.split(/^#{1,3}\s/m).filter(Boolean)
  for (const sec of sections) {
    const firstLine = sec.split('\n')[0].trim()
    const content = sec.slice(firstLine.length).trim()
    if (!content) continue
    
    if (/性格|人格|解析|深度|特质/.test(firstLine)) result.personality = content
    else if (/事业|财运|职场|职业|财富/.test(firstLine)) result.career = content
    else if (/爱情|感情|人际|关系|恋爱/.test(firstLine)) result.love = content
    else if (/运势|展望|预测|年/.test(firstLine)) result.fortune = content
  }

  // 全部未匹配 → 放入 personality
  if (!result.personality && !result.career && !result.love && !result.fortune) {
    result.personality = text.trim()
  }
  return result
}

export async function getZodiacAnalysis({ sign, birthday, zodiacType }) {
  const nextYear = new Date().getFullYear() + 1
  const prompt = `请结合以下信息，为这位用户生成专业的星座深度解读：

【基本信息】
星座：${sign.name}（${sign.latin} ${sign.emoji}）
元素属性：${sign.element}
守护星：${sign.ruler}
出生日期：${birthday}

请按以下 JSON 格式直接返回（不要输出其他内容）：

{
  "personality": "结合该星座${sign.name}的核心特质与出生日期的星象影响，深度分析性格。200-300字，温暖治愈风格。",
  "career": "结合${sign.name}的特质分析适合的职业方向和财富建议。200-300字。",
  "love": "分析${sign.name}在感情和人际关系中的表现与建议。200-300字。",
  "fortune": "结合${sign.name}的星象特点，简要展望${nextYear}年的整体运势方向和注意事项。150-200字。"
}

要求：专业、温暖、治愈，有具体的月份指引或行动建议，避免空泛说教。只返回 JSON，不要添加任何其他文字。`

  const text = await callAI(
    '你是一位资深占星师和心理咨询师。你必须严格返回 JSON 格式，不要添加解释性文字。',
    prompt
  )
  return parseSections(text)
}

export async function getChineseZodiacAnalysis({ sign, year, animal }) {
  const nextYear = new Date().getFullYear() + 1
  const prompt = `请结合以下信息，为这位用户生成专业的生肖深度解读：

【基本信息】
生肖：${sign.name}（${sign.emoji}）
出生年份：${year}年
五行属性：${sign.elem}
象征：${sign.symbol}

请按以下 JSON 格式直接返回（不要输出其他内容）：

{
  "personality": "结合属${sign.name}的特质与五行属性，深度分析性格。200-300字。",
  "career": "分析属${sign.name}的人适合的职业方向和财富建议。200-300字。",
  "love": "分析属${sign.name}在感情和人际关系中的表现与建议。200-300字。",
  "fortune": "结合生肖${sign.name}的特点，简要展望${nextYear}年的整体运势方向和注意事项。150-200字。"
}

要求：专业、温暖、治愈，有具体的行动建议。只返回 JSON，不要添加任何其他文字。`

  const text = await callAI(
    '你是一位资深的中国传统命理师和心理咨询师。你必须严格返回 JSON 格式，不要添加解释性文字。',
    prompt
  )
  return parseSections(text)
}
