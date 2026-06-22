// IPIP-NEO 120 大五人格题库（精简版 = 60题，完整版 = 120题）
// 每题包含：维度(dimension)、反向计分标记(reversed)、测谎题标记(lie)

const bigFivePool = [
  // === 开放性 (Openness) — 24题 ===
  { id: 'O01', text: '我喜欢尝试新事物和新体验。', dimension: 'openness', reversed: false },
  { id: 'O02', text: '我对艺术和美有敏锐的感受力。', dimension: 'openness', reversed: false },
  { id: 'O03', text: '我经常沉浸在想象的幻想世界中。', dimension: 'openness', reversed: false },
  { id: 'O04', text: '我更喜欢按照常规做事，不喜欢变化。', dimension: 'openness', reversed: true },
  { id: 'O05', text: '我对抽象概念和哲学问题感兴趣。', dimension: 'openness', reversed: false },
  { id: 'O06', text: '我喜欢参观博物馆和艺术展览。', dimension: 'openness', reversed: false },
  { id: 'O07', text: '我不太关心艺术或音乐。', dimension: 'openness', reversed: true },
  { id: 'O08', text: '我对不同文化的习俗感到好奇。', dimension: 'openness', reversed: false },
  { id: 'O09', text: '我常常突然冒出新的创意想法。', dimension: 'openness', reversed: false },
  { id: 'O10', text: '我更喜欢熟悉的环境而不是探索新地方。', dimension: 'openness', reversed: true },
  { id: 'O11', text: '我对科学发现和新知充满热情。', dimension: 'openness', reversed: false },
  { id: 'O12', text: '我认为传统的方法通常是最好的。', dimension: 'openness', reversed: true },
  { id: 'O13', text: '我喜欢用非传统的方式解决问题。', dimension: 'openness', reversed: false },
  { id: 'O14', text: '我经常做生动而富有想象力的梦。', dimension: 'openness', reversed: false },
  { id: 'O15', text: '我对诗歌和文学有较高的鉴赏力。', dimension: 'openness', reversed: false },
  { id: 'O16', text: '我认为大部分新想法都不切实际。', dimension: 'openness', reversed: true },
  { id: 'O17', text: '我喜欢学习不同领域的知识。', dimension: 'openness', reversed: false },
  { id: 'O18', text: '我可以很容易地适应新环境。', dimension: 'openness', reversed: false },
  { id: 'O19', text: '我更关注事实而不是理论。', dimension: 'openness', reversed: true },
  { id: 'O20', text: '我对非常规生活方式持开放态度。', dimension: 'openness', reversed: false },
  { id: 'O21', text: '我经常尝试新的烹饪方法或食谱。', dimension: 'openness', reversed: false },
  { id: 'O22', text: '我倾向于按既定规则行事。', dimension: 'openness', reversed: true },
  { id: 'O23', text: '我喜欢与不同背景的人交流思想。', dimension: 'openness', reversed: false },
  { id: 'O24', text: '我对新的音乐和艺术形式持开放态度。', dimension: 'openness', reversed: false },

  // === 尽责性 (Conscientiousness) — 24题 ===
  { id: 'C01', text: '我做事总是有条不紊。', dimension: 'conscientiousness', reversed: false },
  { id: 'C02', text: '我总能把事情办得妥妥当当。', dimension: 'conscientiousness', reversed: false },
  { id: 'C03', text: '我倾向于把事情留到最后一刻。', dimension: 'conscientiousness', reversed: true },
  { id: 'C04', text: '我会遵守承诺，信守约定。', dimension: 'conscientiousness', reversed: false },
  { id: 'C05', text: '我常常忘记把东西放回原处。', dimension: 'conscientiousness', reversed: true },
  { id: 'C06', text: '我对自己的工作要求很高。', dimension: 'conscientiousness', reversed: false },
  { id: 'C07', text: '我经常迟到，不太守时。', dimension: 'conscientiousness', reversed: true },
  { id: 'C08', text: '做决定之前我会深思熟虑。', dimension: 'conscientiousness', reversed: false },
  { id: 'C09', text: '我的房间或工作区域通常是整洁有序的。', dimension: 'conscientiousness', reversed: false },
  { id: 'C10', text: '我更喜欢随性而为，不喜欢制定计划。', dimension: 'conscientiousness', reversed: true },
  { id: 'C11', text: '设定目标后，我会一步步努力实现。', dimension: 'conscientiousness', reversed: false },
  { id: 'C12', text: '我有时不够自律，容易分心。', dimension: 'conscientiousness', reversed: true },
  { id: 'C13', text: '我注重细节，追求精益求精。', dimension: 'conscientiousness', reversed: false },
  { id: 'C14', text: '我经常在完成任务前就感到厌倦。', dimension: 'conscientiousness', reversed: true },
  { id: 'C15', text: '我能够很好地管理自己的时间。', dimension: 'conscientiousness', reversed: false },
  { id: 'C16', text: '我有时会冲动行事，不考虑后果。', dimension: 'conscientiousness', reversed: true },
  { id: 'C17', text: '我坚持完成任务直到它们完美。', dimension: 'conscientiousness', reversed: false },
  { id: 'C18', text: '当遇到困难时，我容易半途而废。', dimension: 'conscientiousness', reversed: true },
  { id: 'C19', text: '我喜欢列清单来组织我的生活。', dimension: 'conscientiousness', reversed: false },
  { id: 'C20', text: '我对日常事务有时会粗心大意。', dimension: 'conscientiousness', reversed: true },
  { id: 'C21', text: '在重要任务中我总能保持专注。', dimension: 'conscientiousness', reversed: false },
  { id: 'C22', text: '我不太喜欢为自己设定严格的规则。', dimension: 'conscientiousness', reversed: true },
  { id: 'C23', text: '我相信勤奋比天赋更重要。', dimension: 'conscientiousness', reversed: false },
  { id: 'C24', text: '我有时会故意回避责任。', dimension: 'conscientiousness', reversed: true },

  // === 外向性 (Extraversion) — 24题 ===
  { id: 'E01', text: '我是聚会中活跃气氛的那个人。', dimension: 'extraversion', reversed: false },
  { id: 'E02', text: '在社交场合，我通常是安静而克制的。', dimension: 'extraversion', reversed: true },
  { id: 'E03', text: '我喜欢成为人们关注的焦点。', dimension: 'extraversion', reversed: false },
  { id: 'E04', text: '我喜欢和很多人在一起。', dimension: 'extraversion', reversed: false },
  { id: 'E05', text: '我更喜欢独处而不是参与社交活动。', dimension: 'extraversion', reversed: true },
  { id: 'E06', text: '我很容易和新认识的人交朋友。', dimension: 'extraversion', reversed: false },
  { id: 'E07', text: '在人群中我不太主动说话。', dimension: 'extraversion', reversed: true },
  { id: 'E08', text: '我能轻松地在一群人中表现自己。', dimension: 'extraversion', reversed: false },
  { id: 'E09', text: '我不喜欢太喧闹的环境。', dimension: 'extraversion', reversed: true },
  { id: 'E10', text: '我喜欢和朋友们分享有趣的故事。', dimension: 'extraversion', reversed: false },
  { id: 'E11', text: '人多的时候我会感到不自在。', dimension: 'extraversion', reversed: true },
  { id: 'E12', text: '我经常主动与人发起对话。', dimension: 'extraversion', reversed: false },
  { id: 'E13', text: '我在社交场合经常充满活力。', dimension: 'extraversion', reversed: false },
  { id: 'E14', text: '我需要很多独处时间来恢复精力。', dimension: 'extraversion', reversed: true },
  { id: 'E15', text: '参加派对或聚会让我感到兴奋。', dimension: 'extraversion', reversed: false },
  { id: 'E16', text: '我觉得自己不是特别健谈的人。', dimension: 'extraversion', reversed: true },
  { id: 'E17', text: '我喜欢认识不同行业的新朋友。', dimension: 'extraversion', reversed: false },
  { id: 'E18', text: '在团体讨论中，我通常保持沉默。', dimension: 'extraversion', reversed: true },
  { id: 'E19', text: '我很容易在社交中获得快乐。', dimension: 'extraversion', reversed: false },
  { id: 'E20', text: '我更愿意通过文字而不是面对面交流。', dimension: 'extraversion', reversed: true },
  { id: 'E21', text: '我相信我是外向开朗的人。', dimension: 'extraversion', reversed: false },
  { id: 'E22', text: '大型社交活动让我感到压力。', dimension: 'extraversion', reversed: true },
  { id: 'E23', text: '我喜欢带着朋友一起探索新地方。', dimension: 'extraversion', reversed: false },
  { id: 'E24', text: '我很少主动提出组织聚会。', dimension: 'extraversion', reversed: true },

  // === 宜人性 (Agreeableness) — 24题 ===
  { id: 'A01', text: '我对遇到的大多数人都怀有好感。', dimension: 'agreeableness', reversed: false },
  { id: 'A02', text: '我经常主动为他人提供帮助。', dimension: 'agreeableness', reversed: false },
  { id: 'A03', text: '我有时会对别人的动机持怀疑态度。', dimension: 'agreeableness', reversed: true },
  { id: 'A04', text: '我相信人性的善良一面。', dimension: 'agreeableness', reversed: false },
  { id: 'A05', text: '我有时会有意无意地伤害别人的感情。', dimension: 'agreeableness', reversed: true },
  { id: 'A06', text: '我喜欢让身边的人感到舒适和被关心。', dimension: 'agreeableness', reversed: false },
  { id: 'A07', text: '在团队中我不介意听取不同意见。', dimension: 'agreeableness', reversed: false },
  { id: 'A08', text: '我不会轻易原谅那些伤害过我的人。', dimension: 'agreeableness', reversed: true },
  { id: 'A09', text: '我善于调节团队中的矛盾和冲突。', dimension: 'agreeableness', reversed: false },
  { id: 'A10', text: '我觉得别人经常利用我的好心。', dimension: 'agreeableness', reversed: true },
  { id: 'A11', text: '我愿意花时间倾听朋友的烦恼。', dimension: 'agreeableness', reversed: false },
  { id: 'A12', text: '在竞争中我更看重赢而不是公平。', dimension: 'agreeableness', reversed: true },
  { id: 'A13', text: '我能够换位思考，理解他人处境。', dimension: 'agreeableness', reversed: false },
  { id: 'A14', text: '我有时会对他人的错误过于挑剔。', dimension: 'agreeableness', reversed: true },
  { id: 'A15', text: '我乐于赞美和认可他人的成就。', dimension: 'agreeableness', reversed: false },
  { id: 'A16', text: '我不太关心陌生人的遭遇。', dimension: 'agreeableness', reversed: true },
  { id: 'A17', text: '我愿意为团队的成功做出个人牺牲。', dimension: 'agreeableness', reversed: false },
  { id: 'A18', text: '当别人犯错时我很难保持耐心。', dimension: 'agreeableness', reversed: true },
  { id: 'A19', text: '我经常考虑自己的行为会对他人产生什么影响。', dimension: 'agreeableness', reversed: false },
  { id: 'A20', text: '我不太会表达对他人的关心。', dimension: 'agreeableness', reversed: true },
  { id: 'A21', text: '我是一个容易相处、温和友善的人。', dimension: 'agreeableness', reversed: false },
  { id: 'A22', text: '当我的利益被侵犯时，我可能会变得强硬。', dimension: 'agreeableness', reversed: true },
  { id: 'A23', text: '我喜欢和他人合作完成工作。', dimension: 'agreeableness', reversed: false },
  { id: 'A24', text: '我有时故意不回应别人的请求。', dimension: 'agreeableness', reversed: true },

  // === 神经质 (Neuroticism) — 24题（含反向题） ===
  { id: 'N01', text: '我经常感到紧张和焦虑。', dimension: 'neuroticism', reversed: false },
  { id: 'N02', text: '大部分时间我都感到心情放松。', dimension: 'neuroticism', reversed: true },
  { id: 'N03', text: '我很容易因为小事而感到烦恼。', dimension: 'neuroticism', reversed: false },
  { id: 'N04', text: '我的情绪基本稳定，很少大起大落。', dimension: 'neuroticism', reversed: true },
  { id: 'N05', text: '我时常毫无理由地感到悲伤。', dimension: 'neuroticism', reversed: false },
  { id: 'N06', text: '面对压力时我能够保持平静。', dimension: 'neuroticism', reversed: true },
  { id: 'N07', text: '我经常担心不好的事情会发生。', dimension: 'neuroticism', reversed: false },
  { id: 'N08', text: '我很少感到沮丧或忧郁。', dimension: 'neuroticism', reversed: true },
  { id: 'N09', text: '别人的批评会让我非常困扰。', dimension: 'neuroticism', reversed: false },
  { id: 'N10', text: '我对自己的情绪有很好的控制力。', dimension: 'neuroticism', reversed: true },
  { id: 'N11', text: '我常常感到不安和没有安全感。', dimension: 'neuroticism', reversed: false },
  { id: 'N12', text: '我通常能以积极的心态应对困难。', dimension: 'neuroticism', reversed: true },
  { id: 'N13', text: '我的情绪比大多数人都要敏感。', dimension: 'neuroticism', reversed: false },
  { id: 'N14', text: '我很少有强烈的情绪波动。', dimension: 'neuroticism', reversed: true },
  { id: 'N15', text: '在压力下我容易变得慌乱。', dimension: 'neuroticism', reversed: false },
  { id: 'N16', text: '我对自己在压力下保持冷静的能力有信心。', dimension: 'neuroticism', reversed: true },
  { id: 'N17', text: '我常常因为过度担忧而难以入睡。', dimension: 'neuroticism', reversed: false },
  { id: 'N18', text: '我能很好地处理日常生活中的压力。', dimension: 'neuroticism', reversed: true },
  { id: 'N19', text: '我比别人更容易感到被冒犯。', dimension: 'neuroticism', reversed: false },
  { id: 'N20', text: '即使事情不顺利，我也不会气馁。', dimension: 'neuroticism', reversed: true },
  { id: 'N21', text: '我经常担心自己在别人眼中的形象。', dimension: 'neuroticism', reversed: false },
  { id: 'N22', text: '我是一个镇定自若的人。', dimension: 'neuroticism', reversed: true },
  { id: 'N23', text: '我会因为一些小事而反复纠结。', dimension: 'neuroticism', reversed: false },
  { id: 'N24', text: '我通常能够从容面对生活中的变化。', dimension: 'neuroticism', reversed: true }
]

// === 测谎题 === (3题，随机插入)
const lieQuestions = [
  { id: 'L01', text: '我从来没有说过谎。', dimension: 'lie', reversed: false },
  { id: 'L02', text: '在任何情况下我都从未占过别人便宜。', dimension: 'lie', reversed: false },
  { id: 'L03', text: '我总是言行一致，从不敷衍。', dimension: 'lie', reversed: false }
]

// === 九型人格 108题 ===
const enneagramPool = []
const enneagramTemplates = [
  { type: 1, items: [
    '我对自己有很高的道德标准',
    '别人经常说我的标准太高了',
    '我很难容忍混乱和不守规矩',
    '我内心有一个严厉的批评者',
    '我觉得有责任纠正周围的错误',
    '我经常检查自己的工作确保没有错误',
    '我对是非对错有强烈的判断',
    '我做事会追求完美的标准',
    '当我看到不公正的事时我会感到愤怒',
    '我很难放松，总觉得有事需要做',
    '我把责任看得比享乐更重要',
    '我会反复检查以确保万无一失'
  ]},
  { type: 2, items: [
    '我为自己能够帮助他人感到自豪',
    '我经常把别人的需求放在自己之前',
    '我需要被需要的感觉',
    '我善于察觉他人的情绪需求',
    '当我付出后得不到感激时会感到受伤',
    '我很难直接表达自己的需求',
    '我通过帮助他人来建立亲密关系',
    '我有时会觉得自己的付出被当作理所当然',
    '我喜欢给亲近的人准备惊喜',
    '当别人向我倾诉时我感到被信任',
    '我害怕被身边的人抛弃或忽视',
    '我常常成为朋友的情感依靠'
  ]},
  { type: 3, items: [
    '我的自我价值很大程度上取决于我的成就',
    '我善于在不同场合展现不同的一面',
    '我对自己设定很高的目标并努力达成',
    '我害怕失败甚于害怕死亡',
    '我善于推销自己和自己的想法',
    '我的外表和形象对我很重要',
    '我常常同时处理多个项目',
    '当事情不顺利时我会感到非常沮丧',
    '我喜欢得到他人的认可和赞赏',
    '我有时会为了效率牺牲与他人的情感连接',
    '我是一个非常有竞争力的人',
    '我总是在寻找下一个可以达成的目标'
  ]},
  { type: 4, items: [
    '我常常觉得自己与周围人不同',
    '我的情绪深刻而复杂',
    '我怀念一些可能从未真正存在过的东西',
    '我通过艺术或创作来表达自己',
    '我倾向于关注生活中缺失的部分',
    '我需要时间独处来恢复情感平衡',
    '被完全理解对我来说很重要',
    '我欣赏独特性和个人风格',
    '我经常经历强烈的情绪波动',
    '普通的日常生活有时让我感到无聊',
    '我对美有超越常人的敏感度',
    '我相信我的内心世界比实际生活更丰富'
  ]},
  { type: 5, items: [
    '我在投入社交活动之前需要了解情况',
    '独处对我来说是获取能量的方式',
    '知识就是力量这句话深得我心',
    '在表达观点之前我需要充分思考',
    '我倾向于观察而不是参与',
    '我喜欢深入钻研一个感兴趣的领域',
    '过多的情绪要求会让我感到消耗',
    '我对自己的隐私非常保护',
    '我喜欢有条理地收集信息',
    '社交活动后我需要长时间恢复',
    '我经常在脑海中推演各种可能性',
    '我有时会因为过度思考而错失机会'
  ]},
  { type: 6, items: [
    '安全对我来说是最重要的',
    '我做决定前会反复权衡利弊',
    '我倾向于预想最坏的情况并做好准备',
    '忠诚是我最看重的品质之一',
    '我有时会对权威既依赖又怀疑',
    '我很难快速信任一个人',
    '我需要生活的稳定和可预测性',
    '当面对太多不确定性时我会感到焦虑',
    '我对那些值得信赖的人极其忠诚',
    '我经常为未来可能出现的问题做准备',
    '危机时刻我往往是最冷静的那个人',
    '我会在多个选项之间反复犹豫'
  ]},
  { type: 7, items: [
    '我总是保持积极乐观的心态',
    '我对生活充满热情和好奇心',
    '我很难长时间专注于一件事',
    '我喜欢同时探索多种可能性',
    '新鲜感对我来说非常重要',
    '我善于把任何经历都变成有趣的故事',
    '我倾向于回避痛苦和不愉快的感受',
    '我喜欢制定令人兴奋的未来计划',
    '我容易对重复性的工作感到厌倦',
    '我是朋友圈里最有能量的人',
    '我相信凡事都有积极的一面',
    '我有时会因为追求快乐而忽略重要事务'
  ]},
  { type: 8, items: [
    '我从不畏惧与他人正面冲突',
    '我天生就有保护弱者的冲动',
    '我不喜欢表现出软弱和脆弱',
    '在团队中我自然地承担领导角色',
    '我相信诚实直率比委婉更重要',
    '我讨厌受到任何形式的控制',
    '我欣赏坚强和有主见的人',
    '我会毫不犹豫地为自己的立场辩护',
    '我有时会因为过于强势而让人感到压力',
    '我相信权力应该掌握在有能力的人手中',
    '在面对不公时我会挺身而出',
    '我对重要的人和事有极强的保护欲'
  ]},
  { type: 9, items: [
    '我倾向于避免产生冲突和矛盾',
    '我容易理解不同人的观点',
    '我有时会因为迁就他人而忽略自己的需求',
    '和谐对我来说比正确更重要',
    '我可能需要很长时间才能做出决定',
    '我喜欢保持生活的平静和节奏',
    '我在人群中自然地扮演调解角色',
    '我有时会因为过于被动而错失机会',
    '我享受简单和舒适的日常',
    '当遇到分歧时我会努力寻找共识',
    '别人觉得我脾气好容易相处',
    '我有时会散漫，需要外界推动'
  ]}
]

enneagramTemplates.forEach(({ type, items }) => {
  items.forEach((text, i) => {
    enneagramPool.push({ id: `E${type}_${i + 1}`, text, type, value: 1 })
  })
})

// 获取精简版题库（完整题量的一半）
function getShortVersion(pool, dimensions, shortCount) {
  const selected = []
  const dimMap = {}
  pool.forEach(q => {
    const key = q.dimension || q.type
    if (!dimMap[key]) dimMap[key] = []
    dimMap[key].push(q)
  })
  // 每维度均衡抽取
  const perDim = Math.floor(shortCount / Object.keys(dimMap).length)
  for (const dim of Object.keys(dimMap)) {
    const items = dimMap[dim]
    const shuffled = [...items].sort(() => Math.random() - 0.5)
    selected.push(...shuffled.slice(0, Math.min(perDim, items.length)))
  }
  // 加入测谎题
  selected.push(...lieQuestions.slice(0, Math.floor(shortCount * 0.05)))
  return selected.sort(() => Math.random() - 0.5)
}

export function getBigFiveQuestions(version) {
  if (version === 'lite') return getShortVersion(bigFivePool, null, 60)
  const withLie = [...bigFivePool, ...lieQuestions]
  return withLie.sort(() => Math.random() - 0.5)
}

export function getEnneagramQuestions(version) {
  if (version === 'lite') return getShortVersion(enneagramPool, null, 54)
  return [...enneagramPool].sort(() => Math.random() - 0.5)
}

export const testInfo = {
  bigfive: {
    title: '大五人格测试',
    fullName: 'IPIP-NEO 120',
    lite: { count: 60, time: '8分钟' },
    full: { count: 120, time: '15分钟' },
    options: ['非常不同意', '不同意', '中立', '同意', '非常同意'],
    optionsShort: ['很不同意', '不同意', '中立', '同意', '很同意']
  },
  enneagram: {
    title: '九型人格测试',
    fullName: 'Enneagram 108',
    lite: { count: 54, time: '7分钟' },
    full: { count: 108, time: '13分钟' },
    options: ['完全不符合', '不太符合', '部分符合', '比较符合', '完全符合'],
    optionsShort: ['不符合', '不太符', '部分符', '较符合', '很符合']
  }
}
