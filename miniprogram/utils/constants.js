/**
 * 全局常量 — 小学数学练习题生成器
 */

// ==================== Canvas 画布 ====================

/** A4 画布尺寸（150dpi，单位 px） */
const CANVAS = {
  WIDTH: 1240,
  HEIGHT: 1754,
  MARGIN_TOP: 60,
  MARGIN_BOTTOM: 60,
  MARGIN_LEFT: 60,
  MARGIN_RIGHT: 60
};

// ==================== 排版参数 ====================

/** 标题区 */
const HEADER = {
  TITLE: '出题易',
  TITLE_SIZE: 48,
  TITLE_Y: 90,
  INFO_SIZE: 28,
  INFO_Y: 140,
  LINE_Y: 170           // 姓名日期下方分割线
};

/** 题目区 */
const QUESTION = {
  START_Y: 200,          // 第一行题目的 Y 坐标
  NUMBER_SIZE: 30,       // 题号字号
  TEXT_SIZE: 36,         // 算式字号（加大，更清晰）
  ROW_SPACING: 68,       // 横式行间距
  VERTICAL_ROW_SPACING: 220,  // 竖式行间距（含留空写答案）
  WORD_ROW_SPACING: 42,      // 应用题题目间距（含答题留空）
  COL_SPACING: 40,       // 列间距
  COLUMNS_HORIZONTAL: 3, // 横式默认列数（1-2位数字）
  COLUMNS_HORIZONTAL_LARGE: 2, // 大数字列数（>=3位数）
  COLUMNS_VERTICAL: 3,   // 竖式默认列数（加大行距后改用3列）
  PER_PAGE: 15           // 每页默认题目数（旧）
};

/** 页脚 */
const FOOTER = {
  Y: 1680,
  TEXT_SIZE: 24,
  TEXT: '第 1 页'
};

// ==================== 配色（Canvas 用） ====================

const CANVAS_COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#333333',
  GRAY: '#999999',
  LINE: '#CCCCCC',
  PRIMARY: '#4A90D9'
};

// ==================== 题型标签映射 ====================

const TYPE_LABELS = {
  addition: '加法练习',
  subtraction: '减法练习',
  multiplication: '乘法练习',
  division: '除法练习',
  mixed: '混合运算',
  vertical: '竖式计算',
  word_problems: '应用题'
};

/**
 * 各题型每页题目数量（按年级区分）
 * 规则：
 *   加减乘除：1-2年级 50题，3年级以上 40题
 *   混合运算：全部 30题
 *   竖式计算：全部 15题
 *   应用题：  全部 10题
 */
function getQuestionCount(type, grade) {
  const isJunior = (grade === 1 || grade === 2);

  switch (type) {
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'division':
      return isJunior ? 50 : 40;
    case 'mixed':
      return 30;
    case 'vertical':
      return 15;
    case 'word_problems':
      return 10;
    default:
      return 24;
  }
}

// ==================== 年级标签 ====================

const GRADE_LABELS = [
  '', '一年级', '二年级', '三年级', '四年级', '五年级', '六年级'
];

// ==================== 导出 ====================

module.exports = {
  CANVAS,
  HEADER,
  QUESTION,
  FOOTER,
  CANVAS_COLORS,
  TYPE_LABELS,
  getQuestionCount,
  GRADE_LABELS
};
