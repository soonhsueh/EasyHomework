/**
 * 题目生成引擎 — 小学数学练习题
 *
 * 每种运算类型独立一个生成函数，统一签名：
 *   generateXxx(config, count) → [{ id, type, display, operands, operator, answer }]
 *
 * config 来自 curriculum.getConfig(grade, semester)
 */

const { getQuestionCount } = require('./constants');

// ==================== 工具函数 ====================

/** 生成 [min, max] 范围内的随机整数 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 生成指定位数的随机整数 */
function randDigits(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return randInt(min, max);
}

/** 打乱数组（Fisher-Yates） */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==================== 加法生成器 ====================

function generateAddition(config, count) {
  const cfg = config.operations.addition;
  const questions = [];
  const seen = new Set();

  let attempts = 0;
  while (questions.length < count && attempts < count * 10) {
    attempts++;
    const a = randInt(cfg.min, cfg.max);
    const b = randInt(cfg.min, cfg.max);
    const answer = a + b;

    // 检查结果范围
    if (cfg.resultMax && answer > cfg.resultMax) continue;

    // 去重
    const key = `${a}+${b}`;
    if (seen.has(key)) continue;
    seen.add(key);

    questions.push({
      id: questions.length + 1,
      type: 'addition',
      display: 'horizontal',
      operands: [a, b],
      operator: '+',
      answer: answer
    });
  }

  return questions;
}

// ==================== 减法生成器 ====================

function generateSubtraction(config, count) {
  const cfg = config.operations.subtraction;
  const questions = [];
  const seen = new Set();

  let attempts = 0;
  while (questions.length < count && attempts < count * 10) {
    attempts++;

    // 先生成被减数，再生成减数，确保 a >= b
    const a = randInt(cfg.min || 1, cfg.max);
    const b = randInt(cfg.allowZero ? 0 : 1, a);

    if (cfg.noNegative && b > a) continue;

    const answer = a - b;

    const key = `${a}-${b}`;
    if (seen.has(key)) continue;
    seen.add(key);

    questions.push({
      id: questions.length + 1,
      type: 'subtraction',
      display: 'horizontal',
      operands: [a, b],
      operator: '-',
      answer: answer
    });
  }

  return questions;
}

// ==================== 乘法生成器 ====================

function generateMultiplication(config, count) {
  const cfg = config.operations.multiplication;
  if (!cfg) return [];

  const questions = [];
  const seen = new Set();

  let attempts = 0;
  while (questions.length < count && attempts < count * 10) {
    attempts++;

    let a, b;
    if (cfg.multiDigit) {
      // 多位数乘法
      a = randDigits(randInt(1, cfg.multiDigit.digits1));
      b = randDigits(randInt(1, cfg.multiDigit.digits2));
    } else {
      // 表内乘法
      a = randInt(1, cfg.tableMax || 9);
      b = randInt(1, cfg.tableMax || 9);
    }

    const answer = a * b;
    const key = `${a}×${b}`;
    if (seen.has(key)) continue;
    seen.add(key);

    questions.push({
      id: questions.length + 1,
      type: 'multiplication',
      display: 'horizontal',
      operands: [a, b],
      operator: '×',
      answer: answer
    });
  }

  return questions;
}

// ==================== 除法生成器 ====================

function generateDivision(config, count) {
  const cfg = config.operations.division;
  if (!cfg) return [];

  const questions = [];
  const seen = new Set();

  let attempts = 0;
  while (questions.length < count && attempts < count * 10) {
    attempts++;

    let dividend, divisor, answer, remainder;

    if (cfg.multiDigit) {
      // 多位数除法：先生成商和除数，反推被除数
      const divisorDigits = randInt(1, cfg.multiDigit.digits2);
      divisor = randDigits(divisorDigits);
      const quotientDigits = randInt(1, cfg.multiDigit.digits1);
      answer = randDigits(quotientDigits);

      if (cfg.noRemainder || !cfg.hasRemainder) {
        dividend = divisor * answer;
      } else {
        remainder = randInt(0, divisor - 1);
        dividend = divisor * answer + remainder;
      }
    } else {
      // 表内除法：被除数 = 除数 × 商
      divisor = randInt(1, cfg.tableMax || 9);
      answer = randInt(1, cfg.tableMax || 9);
      dividend = divisor * answer;

      if (!cfg.noRemainder && cfg.remainder && Math.random() > 0.7) {
        remainder = randInt(1, divisor - 1);
        dividend += remainder;
      }
    }

    const key = `${dividend}÷${divisor}`;
    if (seen.has(key)) continue;
    seen.add(key);

    questions.push({
      id: questions.length + 1,
      type: 'division',
      display: 'horizontal',
      operands: [dividend, divisor],
      operator: '÷',
      answer: answer,
      remainder: remainder || 0
    });
  }

  return questions;
}

// ==================== 混合运算生成器 ====================

function generateMixed(config, count) {
  // 从该年级支持的运算类型中各取一部分
  const types = [];
  if (config.operations.addition) types.push('addition');
  if (config.operations.subtraction) types.push('subtraction');
  if (config.operations.multiplication) types.push('multiplication');
  if (config.operations.division) types.push('division');

  const questions = [];
  const perType = Math.ceil(count / types.length);

  for (const type of types) {
    let generated;
    switch (type) {
      case 'addition':
        generated = generateAddition(config, perType);
        break;
      case 'subtraction':
        generated = generateSubtraction(config, perType);
        break;
      case 'multiplication':
        generated = generateMultiplication(config, perType);
        break;
      case 'division':
        generated = generateDivision(config, perType);
        break;
    }

    if (generated) {
      // 标记为混合题型
      generated.forEach(q => { q.type = type; });
      questions.push(...generated);
    }
  }

  // 打乱顺序，重新编号
  const shuffled = shuffle(questions).slice(0, count);
  shuffled.forEach((q, i) => { q.id = i + 1; });

  return shuffled;
}

// ==================== 竖式计算生成器 ====================

function generateVertical(config, count) {
  const vCfg = config.vertical;
  if (!vCfg) return [];

  // 四种竖式运算平均分配
  const opTypes = [];
  if (vCfg.addition) opTypes.push('addition');
  if (vCfg.subtraction) opTypes.push('subtraction');
  if (vCfg.multiplication) opTypes.push('multiplication');
  if (vCfg.division) opTypes.push('division');

  const questions = [];
  const perOp = Math.ceil(count / opTypes.length);
  const seen = new Set();

  for (const opType of opTypes) {
    const opCfg = vCfg[opType];
    if (!opCfg) continue;

    let generated = 0;
    let attempts = 0;

    while (generated < perOp && attempts < perOp * 20) {
      attempts++;

      let a, b, answer, remainder = 0;
      let questionType = opType;

      switch (opType) {
        case 'addition': {
          a = randDigits(opCfg.digits1);
          b = randDigits(opCfg.digits2);
          answer = a + b;
          break;
        }
        case 'subtraction': {
          a = randDigits(opCfg.digits1);
          b = randDigits(opCfg.digits2);
          // 确保 a >= b
          if (b > a) [a, b] = [b, a];
          answer = a - b;
          break;
        }
        case 'multiplication': {
          a = randDigits(opCfg.digits1);
          b = randDigits(opCfg.digits2);
          answer = a * b;
          break;
        }
        case 'division': {
          // 先生成除数和商，反推被除数
          b = randDigits(opCfg.digits2);
          answer = randInt(1, Math.pow(10, opCfg.digits1 - opCfg.digits2 + 1) - 1);
          a = b * answer;
          if (!opCfg.noRemainder && Math.random() > 0.7) {
            remainder = randInt(1, b - 1);
            a += remainder;
          }
          break;
        }
      }

      const key = `${a}${opType}${b}`;
      if (seen.has(key)) continue;
      seen.add(key);

      questions.push({
        id: 0, // 后面统一编号
        type: questionType,
        display: 'vertical',
        operands: [a, b],
        operator: opType === 'addition' ? '+' :
                  opType === 'subtraction' ? '-' :
                  opType === 'multiplication' ? '×' : '÷',
        answer: answer,
        remainder: remainder
      });

      generated++;
    }
  }

  // 打乱并编号
  const shuffled = shuffle(questions).slice(0, count);
  shuffled.forEach((q, i) => { q.id = i + 1; });

  return shuffled;
}

// ==================== 主入口 ====================

/**
 * 统一生成入口
 * @param {object} config - curriculum 配置
 * @param {string} type - 题型 key
 * @param {number} grade - 年级 (1-6)
 * @param {number} count - 题目数量（可选，默认按年级自动计算）
 * @returns {object} { questions: [...], meta: {...} }
 */
function generate(config, type, grade, count) {
  const actualCount = count || getQuestionCount(type, grade) || 24;

  let questions = [];

  switch (type) {
    case 'addition':
      questions = generateAddition(config, actualCount);
      break;
    case 'subtraction':
      questions = generateSubtraction(config, actualCount);
      break;
    case 'multiplication':
      questions = generateMultiplication(config, actualCount);
      break;
    case 'division':
      questions = generateDivision(config, actualCount);
      break;
    case 'mixed':
      questions = generateMixed(config, actualCount);
      break;
    case 'vertical':
      questions = generateVertical(config, actualCount);
      break;
    case 'word_problems':
      // wordProblems 在 wordProblems.js 中实现
      const wordProblems = require('./wordProblems');
      questions = wordProblems.generate(config, actualCount, grade);
      break;
    default:
      questions = generateAddition(config, actualCount);
  }

  return {
    questions,
    meta: {
      type,
      count: questions.length
    }
  };
}

module.exports = {
  generate,
  generateAddition,
  generateSubtraction,
  generateMultiplication,
  generateDivision,
  generateMixed,
  generateVertical
};
