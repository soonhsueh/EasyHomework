/**
 * 北京版小学数学课程配置
 * 定义各年级（上/下学期）的难度参数、可用题型、约束条件
 */

// ==================== 各年级配置 ====================

/**
 * 年级配置结构：
 * {
 *   semester: {           // '上' | '下'
 *     numberRange: [min, max],         // 数的范围
 *     operations: {                    // 各运算类型的参数
 *       addition: { min, max },        // 加数范围
 *       subtraction: { min, max },     // 减数和被减数范围
 *       multiplication: { tableMax },  // 乘法表范围（表内=9）
 *       division: { tableMax, remainder }
 *     },
 *     vertical: {
 *       enabled: true,
 *       digits: { add: [2,2], sub: [2,2], mul: [2,1], div: [2,1] }
 *     },
 *     wordProblemSteps: 1 | 2         // 应用题最多几步运算
 *   }
 * }
 */

const CURRICULUM = {

  // ============= 一年级 =============
  1: {
    label: '一年级',
    semesters: {
      '上': {
        numberRange: [0, 20],
        operations: {
          addition: { min: 0, max: 20, resultMax: 20, carry: true },
          subtraction: { min: 0, max: 20, allowZero: true, noNegative: true, borrow: true },
          multiplication: false,
          division: false
        },
        vertical: {
          addition: { digits1: 1, digits2: 2, noCarrying: false },
          subtraction: { digits1: 2, digits2: 2, noBorrowing: false },
          multiplication: false,
          division: false
        },
        wordProblemSteps: 1
      },
      '下': {
        numberRange: [0, 100],
        operations: {
          addition: { min: 0, max: 50, resultMax: 100 },
          subtraction: { min: 0, max: 50, allowZero: true, noNegative: true },
          multiplication: false,
          division: false
        },
        vertical: {
          addition: { digits1: 2, digits2: 2, noCarrying: false },
          subtraction: { digits1: 2, digits2: 2, noBorrowing: false },
          multiplication: false,
          division: false
        },
        wordProblemSteps: 1
      }
    }
  },

  // ============= 二年级 =============
  2: {
    label: '二年级',
    semesters: {
      '上': {
        numberRange: [0, 100],
        operations: {
          addition: { min: 0, max: 99, resultMax: 100 },
          subtraction: { min: 0, max: 99, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9 },  // 九九乘法表
          division: { tableMax: 9, remainder: false }  // 表内除法，无余数
        },
        vertical: {
          addition: { digits1: 2, digits2: 2, noCarrying: false },
          subtraction: { digits1: 2, digits2: 2, noBorrowing: false },
          multiplication: { digits1: 1, digits2: 1 },
          division: { digits1: 2, digits2: 1, noRemainder: true }
        },
        wordProblemSteps: 1
      },
      '下': {
        numberRange: [0, 10000],
        operations: {
          addition: { min: 0, max: 5000, resultMax: 10000 },
          subtraction: { min: 0, max: 5000, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9 },
          division: { tableMax: 9, remainder: true }  // 有余数除法
        },
        vertical: {
          addition: { digits1: 3, digits2: 3, noCarrying: false },
          subtraction: { digits1: 3, digits2: 3, noBorrowing: false },
          multiplication: { digits1: 2, digits2: 1 },
          division: { digits1: 3, digits2: 1, noRemainder: false }
        },
        wordProblemSteps: 2
      }
    }
  },

  // ============= 三年级 =============
  3: {
    label: '三年级',
    semesters: {
      '上': {
        numberRange: [0, 10000],
        operations: {
          addition: { min: 0, max: 9999, resultMax: 10000 },
          subtraction: { min: 0, max: 9999, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9, multiDigit: { digits1: 3, digits2: 1 } },
          division: { tableMax: 9, noRemainder: true, multiDigit: { digits1: 2, digits2: 1 } }
        },
        vertical: {
          addition: { digits1: 3, digits2: 3, noCarrying: false },
          subtraction: { digits1: 3, digits2: 3, noBorrowing: false },
          multiplication: { digits1: 3, digits2: 1 },
          division: { digits1: 2, digits2: 1, noRemainder: true }
        },
        wordProblemSteps: 2
      },
      '下': {
        numberRange: [0, 100000],
        operations: {
          addition: { min: 0, max: 99999, resultMax: 100000 },
          subtraction: { min: 0, max: 99999, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9, multiDigit: { digits1: 2, digits2: 2 } },
          division: { tableMax: 9, noRemainder: false, multiDigit: { digits1: 3, digits2: 2 } }
        },
        vertical: {
          addition: { digits1: 4, digits2: 4, noCarrying: false },
          subtraction: { digits1: 4, digits2: 4, noBorrowing: false },
          multiplication: { digits1: 2, digits2: 2 },
          division: { digits1: 4, digits2: 2, noRemainder: false }
        },
        wordProblemSteps: 2
      }
    }
  },

  // ============= 四年级 =============
  4: {
    label: '四年级',
    semesters: {
      '上': {
        numberRange: [0, 100000000], // 亿以内
        operations: {
          addition: { min: 0, max: 50000000, resultMax: 100000000 },
          subtraction: { min: 0, max: 50000000, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9, multiDigit: { digits1: 3, digits2: 2 } },
          division: { tableMax: 9, noRemainder: false, multiDigit: { digits1: 4, digits2: 2 } },
          decimal: { addition: true, subtraction: true, decimalPlaces: 1 }
        },
        vertical: {
          addition: { digits1: 5, digits2: 5, noCarrying: false },
          subtraction: { digits1: 5, digits2: 5, noBorrowing: false },
          multiplication: { digits1: 3, digits2: 2 },
          division: { digits1: 4, digits2: 2, noRemainder: false }
        },
        wordProblemSteps: 2
      },
      '下': {
        numberRange: [0, 100000000],
        operations: {
          addition: { min: 0, max: 50000000, resultMax: 100000000 },
          subtraction: { min: 0, max: 50000000, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9, multiDigit: { digits1: 3, digits2: 3 } },
          division: { tableMax: 9, noRemainder: false, multiDigit: { digits1: 5, digits2: 3 } },
          decimal: { addition: true, subtraction: true, multiplication: true, decimalPlaces: 2 }
        },
        vertical: {
          addition: { digits1: 5, digits2: 5, noCarrying: false },
          subtraction: { digits1: 5, digits2: 5, noBorrowing: false },
          multiplication: { digits1: 3, digits2: 3 },
          division: { digits1: 5, digits2: 3, noRemainder: false }
        },
        wordProblemSteps: 3
      }
    }
  },

  // ============= 五年级 =============
  5: {
    label: '五年级',
    semesters: {
      '上': {
        numberRange: [0, 100000000],
        operations: {
          addition: { min: 0, max: 99999999, resultMax: 100000000 },
          subtraction: { min: 0, max: 99999999, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9, multiDigit: { digits1: 4, digits2: 3 } },
          division: { tableMax: 9, noRemainder: false, multiDigit: { digits1: 5, digits2: 3 } },
          decimal: { addition: true, subtraction: true, multiplication: true, division: true, decimalPlaces: 2 },
          fraction: { addSub: true, sameDenominator: true }
        },
        vertical: {
          addition: { digits1: 5, digits2: 5, noCarrying: false },
          subtraction: { digits1: 5, digits2: 5, noBorrowing: false },
          multiplication: { digits1: 3, digits2: 3 },
          division: { digits1: 5, digits2: 3, noRemainder: false }
        },
        wordProblemSteps: 3
      },
      '下': {
        numberRange: [0, 100000000],
        operations: {
          addition: { min: 0, max: 99999999, resultMax: 100000000 },
          subtraction: { min: 0, max: 99999999, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9, multiDigit: { digits1: 4, digits2: 3 } },
          division: { tableMax: 9, noRemainder: false, multiDigit: { digits1: 5, digits2: 3 } },
          decimal: { addition: true, subtraction: true, multiplication: true, division: true, decimalPlaces: 3 },
          fraction: { addSub: true, sameDenominator: false, mulDiv: true }
        },
        vertical: {
          addition: { digits1: 5, digits2: 5, noCarrying: false },
          subtraction: { digits1: 5, digits2: 5, noBorrowing: false },
          multiplication: { digits1: 4, digits2: 3 },
          division: { digits1: 6, digits2: 3, noRemainder: false }
        },
        wordProblemSteps: 3
      }
    }
  },

  // ============= 六年级 =============
  6: {
    label: '六年级',
    semesters: {
      '上': {
        numberRange: [0, 100000000],
        operations: {
          addition: { min: 0, max: 99999999, resultMax: 100000000 },
          subtraction: { min: 0, max: 99999999, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9, multiDigit: { digits1: 4, digits2: 4 } },
          division: { tableMax: 9, noRemainder: false, multiDigit: { digits1: 6, digits2: 4 } },
          decimal: { addition: true, subtraction: true, multiplication: true, division: true, decimalPlaces: 3 },
          fraction: { addSub: true, sameDenominator: false, mulDiv: true },
          percent: true
        },
        vertical: {
          addition: { digits1: 6, digits2: 6, noCarrying: false },
          subtraction: { digits1: 6, digits2: 6, noBorrowing: false },
          multiplication: { digits1: 4, digits2: 4 },
          division: { digits1: 6, digits2: 4, noRemainder: false }
        },
        wordProblemSteps: 3
      },
      '下': {
        numberRange: [0, 100000000],
        operations: {
          addition: { min: 0, max: 99999999, resultMax: 100000000 },
          subtraction: { min: 0, max: 99999999, allowZero: true, noNegative: true },
          multiplication: { tableMax: 9, multiDigit: { digits1: 4, digits2: 4 } },
          division: { tableMax: 9, noRemainder: false, multiDigit: { digits1: 6, digits2: 4 } },
          decimal: { addition: true, subtraction: true, multiplication: true, division: true, decimalPlaces: 3 },
          fraction: { addSub: true, sameDenominator: false, mulDiv: true },
          percent: true,
          ratio: true
        },
        vertical: {
          addition: { digits1: 6, digits2: 6, noCarrying: false },
          subtraction: { digits1: 6, digits2: 6, noBorrowing: false },
          multiplication: { digits1: 4, digits2: 4 },
          division: { digits1: 6, digits2: 4, noRemainder: false }
        },
        wordProblemSteps: 4
      }
    }
  }
};

// ==================== 各年级可用题型 ====================

/**
 * 返回指定年级的可用题型列表
 * 考虑：是否为上下学期都支持、该运算是否已经学过
 */
const GRADE_AVAILABLE_TYPES = {
  1: {
    '上': ['addition', 'subtraction', 'vertical', 'word_problems'],
    '下': ['addition', 'subtraction', 'vertical', 'word_problems']
  },
  2: {
    '上': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems'],
    '下': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems']
  },
  3: {
    '上': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems'],
    '下': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems']
  },
  4: {
    '上': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems'],
    '下': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems']
  },
  5: {
    '上': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems'],
    '下': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems']
  },
  6: {
    '上': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems'],
    '下': ['addition', 'subtraction', 'multiplication', 'division', 'mixed', 'vertical', 'word_problems']
  }
};

// ==================== 工具函数 ====================

/**
 * 获取指定年级+学期的课程配置
 * @param {number} grade - 年级 (1-6)
 * @param {string} semester - 学期 ('上' | '下')，默认 '上'
 * @returns {object} 课程配置对象
 */
function getConfig(grade, semester = '上') {
  const gradeConfig = CURRICULUM[grade];
  if (!gradeConfig) return null;

  // 如果该年级没有分上下学期，使用通用配置
  return gradeConfig.semesters[semester] || gradeConfig.semesters['上'];
}

/**
 * 获取指定年级可用的题型列表
 * @param {number} grade - 年级
 * @param {string} semester - 学期，默认 '上'
 * @returns {string[]} 题型 key 数组
 */
function getAvailableTypes(grade, semester = '上') {
  const types = GRADE_AVAILABLE_TYPES[grade];
  if (!types) return [];
  return types[semester] || types['上'] || [];
}

/**
 * 获取某题型在该年级是否可用
 * @param {number} grade
 * @param {string} type - 题型 key
 * @param {string} semester
 * @returns {boolean}
 */
function isTypeAvailable(grade, type, semester = '上') {
  const types = getAvailableTypes(grade, semester);
  return types.includes(type);
}

module.exports = {
  CURRICULUM,
  GRADE_AVAILABLE_TYPES,
  getConfig,
  getAvailableTypes,
  isTypeAvailable
};
