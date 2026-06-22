const base = import.meta.env.BASE_URL || '/'
// 人格类型映射 — 不同类型对应不同的专属像素角色

export const bigFiveTypes = {
  explorer: {
    id: 'explorer', name: '探索者型', emoji: '✦',
    subtitle: '开放好奇 · 内敛深思',
    character: ${base}characters/explorer.png`, color: '#9B8EC4',
    description: `你是一个充满好奇心的探索者。对新事物保持高度开放，乐于尝试不同体验。面对挑战时，你能保持冷静，不轻易被情绪左右。\n\n在社交方面，你倾向选择性社交，偏好有深度的交流。你高度尽责，做事有条不紊，追求完美。宜人性处于中上水平，你既关心他人，也能保持独立判断。\n\n职场建议：你的好奇心和尽责性让你在研究、创意和策划类领域表现出色。适合独立钻研型工作，如数据分析、写作、产品设计等。\n\n关系建议：你真诚而内敛，虽然不擅长主动开启关系，但一旦建立深度连接，会成为极为忠诚的伴侣和朋友。`,
    traits: ['好奇心强', '深度思考', '独立自主', '追求完美']
  },
  leader: {
    id: 'leader', name: '领导者型', emoji: '◆',
    subtitle: '自信果断 · 目标导向',
    character: ${base}characters/leader.png`, color: '#9B8EC4',
    description: `你拥有天生的领导力。自信果断，目标明确，擅长组织和激励团队。你对挑战充满热情，面对困难时能迅速做出决策。\n\n在社交中，你是能量的来源——开朗外向，善于沟通，能够轻松建立广泛的人际网络。\n\n职场建议：你在管理、销售和创业领域如鱼得水。适合需要快速决策和团队协调的角色，如项目经理、企业创始人、销售总监等。`,
    traits: ['自信果断', '善于沟通', '组织能力强', '高能量']
  },
  mediator: {
    id: 'mediator', name: '协调者型', emoji: '◈',
    subtitle: '温和包容 · 善于合作',
    character: ${base}characters/mediator.png`, color: '#89A89B',
    description: `你是一个温暖而富有同理心的人。你善于倾听，能够理解不同立场，在冲突中扮演调解者的角色。\n\n在团队中，你是那个让所有人感到被接纳的人。你的宜人性极高，与人合作时总能找到共识。\n\n职场建议：你在教育、心理咨询、人力资源和社会工作等领域有天然优势。`,
    traits: ['同理心强', '善于倾听', '团队协作者', '温和包容']
  }
}

export const enneagramTypes = {
  1: { id: 'type1', name: '第一型 · 完美主义者', emoji: '◈', subtitle: '追求卓越 · 原则坚定', character: ${base}characters/perfectionist.png`, color: '#9B8EC4', traits: ['原则性强', '追求完美', '责任心重', '自律'], desc: '你是天生的改革者，内心有一把精确的尺子衡量一切。' },
  2: { id: 'type2', name: '第二型 · 助人者', emoji: '♥', subtitle: '温暖体贴 · 乐于奉献', character: ${base}characters/helper.png`, color: '#D4B8C7', traits: ['温暖体贴', '乐于助人', '善解人意', '奉献精神'], desc: '你的心是一盏永不熄灭的灯，照亮身边每一个人。' },
  3: { id: 'type3', name: '第三型 · 成就者', emoji: '★', subtitle: '高效务实 · 目标明确', character: ${base}characters/achiever.png`, color: '#9B8EC4', traits: ['高效务实', '目标明确', '适应力强', '善表现'], desc: '你像一颗永不停歇的星星，在追逐卓越的路上闪闪发光。' },
  4: { id: 'type4', name: '第四型 · 艺术家', emoji: '✦', subtitle: '浪漫敏感 · 独特自我', character: ${base}characters/artist.png`, color: '#D4B8C7', traits: ['独特自我', '情感深邃', '创造力强', '审美敏锐'], desc: '你的灵魂像一幅未完成的水彩画，每一笔都是独特的情感表达。' },
  5: { id: 'type5', name: '第五型 · 观察者', emoji: '◆', subtitle: '理性冷静 · 知识渊博', character: ${base}characters/observer.png`, color: '#89A89B', traits: ['理性冷静', '善于分析', '知识渊博', '独立思考'], desc: '你在知识的星空中遨游，用理智编织理解世界的网。' },
  6: { id: 'type6', name: '第六型 · 忠诚者', emoji: '▣', subtitle: '谨慎可靠 · 忠诚坚定', character: ${base}characters/loyalist.png`, color: '#9B8EC4', traits: ['忠诚可靠', '谨慎细心', '危机意识', '责任心强'], desc: '你是暴风雨中最可靠的灯塔，忠诚是你最坚硬的铠甲。' },
  7: { id: 'type7', name: '第七型 · 享乐者', emoji: '★', subtitle: '乐观开朗 · 热爱生活', character: ${base}characters/enthusiast.png`, color: '#D4B8C7', traits: ['乐观开朗', '热爱自由', '多才多艺', '精力充沛'], desc: '你的生命是一场永不落幕的嘉年华，快乐是你最自然的状态。' },
  8: { id: 'type8', name: '第八型 · 挑战者', emoji: '◆', subtitle: '坚强果断 · 保护欲强', character: ${base}characters/challenger.png`, color: '#9B8EC4', traits: ['坚强果断', '保护欲强', '自信勇敢', '领导力'], desc: '你是风雨中的磐石，用力量守护你所珍视的一切。' },
  9: { id: 'type9', name: '第九型 · 和平者', emoji: '◈', subtitle: '平和包容 · 随遇而安', character: ${base}characters/peacemaker.png`, color: '#89A89B', traits: ['平和包容', '回避冲突', '善解人意', '随和自然'], desc: '你是一片宁静的湖泊，在喧嚣的世界中保持内心的平和。' }
}

export function calculateBigFive(answers) {
  const dimScores = { openness: { score: 0, max: 0 }, conscientiousness: { score: 0, max: 0 }, extraversion: { score: 0, max: 0 }, agreeableness: { score: 0, max: 0 }, neuroticism: { score: 0, max: 0 } }
  answers.forEach(({ dimension, value, reversed }) => {
    const adj = reversed ? (6 - value) : value
    if (dimScores[dimension]) { dimScores[dimension].score += adj; dimScores[dimension].max += 5 }
  })
  const p = {}
  for (const [d, { score, max }] of Object.entries(dimScores)) p[d] = Math.round((score / max) * 100)
  if (p.openness > 70 && p.conscientiousness > 60) return { type: 'explorer', scores: p }
  if (p.extraversion > 65 && p.conscientiousness > 55) return { type: 'leader', scores: p }
  if (p.agreeableness > 65) return { type: 'mediator', scores: p }
  return { type: 'explorer', scores: p }
}

export function calculateEnneagram(answers) {
  const ts = {}
  answers.forEach(({ type, value }) => { ts[type] = (ts[type] || 0) + value })
  const sorted = Object.entries(ts).sort((a, b) => b[1] - a[1])
  const scores = {}
  sorted.slice(0, 3).forEach(([t, s]) => { scores[t] = Math.round((s / sorted[0][1]) * 100) })
  return { type: sorted[0][0], scores }
}
