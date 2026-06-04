/**
 * Canvas 渲染引擎 — 小学数学练习题
 *
 * 负责将题目数组绘制到 Canvas 上，输出 A4 比例的图片。
 * 支持三种排版模式：横式、竖式、应用题。
 *
 * 公共 API：
 *   initCanvas(ctx, width, height)         — 初始化画布
 *   renderQuestions(ctx, questions, meta)  — 渲染题目页
 *   renderAnswers(ctx, questions, meta)    — 渲染答案页
 */

const C = require('./constants');

// ==================== 画布初始化 ====================

/**
 * 初始化 A4 画布（白色背景）
 */
function initCanvas(ctx, width, height) {
  ctx.fillStyle = C.CANVAS_COLORS.WHITE;
  ctx.fillRect(0, 0, width, height);
}

// ==================== 页眉绘制 ====================

/**
 * 绘制标题和信息行
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} meta - { type, count }
 */
function drawHeader(ctx, meta) {
  const typeLabel = C.TYPE_LABELS[meta.type] || '数学练习';

  // 主标题
  ctx.fillStyle = C.CANVAS_COLORS.BLACK;
  ctx.font = `bold ${C.HEADER.TITLE_SIZE}px "PingFang SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(typeLabel, C.CANVAS.WIDTH / 2, C.HEADER.TITLE_Y);

  // 副标题：姓名 + 日期
  ctx.font = `${C.HEADER.INFO_SIZE}px "PingFang SC", sans-serif`;
  ctx.fillStyle = C.CANVAS_COLORS.BLACK;
  ctx.textAlign = 'left';
  ctx.fillText(
    '姓名：__________    日期：____年____月____日',
    C.CANVAS.MARGIN_LEFT,
    C.HEADER.INFO_Y
  );

  // 分割线
  ctx.strokeStyle = C.CANVAS_COLORS.LINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(C.CANVAS.MARGIN_LEFT, C.HEADER.LINE_Y);
  ctx.lineTo(C.CANVAS.WIDTH - C.CANVAS.MARGIN_RIGHT, C.HEADER.LINE_Y);
  ctx.stroke();
}

// ==================== 页脚绘制 ====================

function drawFooter(ctx) {
  ctx.fillStyle = C.CANVAS_COLORS.GRAY;
  ctx.font = `${C.FOOTER.TEXT_SIZE}px "PingFang SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(C.FOOTER.TEXT, C.CANVAS.WIDTH / 2, C.FOOTER.Y);
}

// ==================== 横式题目绘制 ====================

/**
 * 计算横式题目的排版参数
 * 根据操作数位数自动调整列数：<=3位用3列，>=4位用2列防止重叠
 * @param {Array} questions - 题目数组
 */
function layoutHorizontal(questions) {
  const count = questions.length;

  // 检测最大数字位数，决定列数
  let maxDigits = 1;
  questions.forEach(q => {
    (q.operands || []).forEach(op => {
      const digits = String(Math.abs(op)).length;
      if (digits > maxDigits) maxDigits = digits;
    });
  });

  const cols = maxDigits >= 3
    ? C.QUESTION.COLUMNS_HORIZONTAL_LARGE
    : C.QUESTION.COLUMNS_HORIZONTAL;

  const availableWidth = C.CANVAS.WIDTH - C.CANVAS.MARGIN_LEFT - C.CANVAS.MARGIN_RIGHT;
  const colWidth = availableWidth / cols;
  const startX = C.CANVAS.MARGIN_LEFT;
  const startY = C.QUESTION.START_Y;
  const rowSpacing = C.QUESTION.ROW_SPACING;

  const rows = Math.ceil(count / cols);

  return { cols, colWidth, startX, startY, rowSpacing, rows };
}

/**
 * 绘制单个横式题目
 * 格式: "1.  23 + 15 = _____"
 * @param {number} textSize - 动态字号（大数字时自动缩小）
 */
function drawHorizontalOne(ctx, question, x, y, textSize) {
  const numSize = C.QUESTION.NUMBER_SIZE;
  const fontSize = textSize || C.QUESTION.TEXT_SIZE;

  // 题号
  ctx.fillStyle = C.CANVAS_COLORS.BLACK;
  ctx.font = `${numSize}px "PingFang SC", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${question.id}.`, x, y);

  // 算式
  const [a, b] = question.operands;
  const operator = question.operator;
  const expression = `${a} ${operator} ${b} = ____`;

  ctx.font = `${fontSize}px "PingFang SC", sans-serif`;
  ctx.fillText(expression, x + numSize + 14, y);
}

// ==================== 竖式题目绘制 ====================

/**
 * 计算竖式题目的排版参数
 */
function layoutVertical(count) {
  const cols = C.QUESTION.COLUMNS_VERTICAL;
  const availableWidth = C.CANVAS.WIDTH - C.CANVAS.MARGIN_LEFT - C.CANVAS.MARGIN_RIGHT;
  const colWidth = availableWidth / cols;
  const startX = C.CANVAS.MARGIN_LEFT;
  const startY = C.QUESTION.START_Y;
  const rowSpacing = C.QUESTION.VERTICAL_ROW_SPACING;

  const rows = Math.ceil(count / cols);

  return { cols, colWidth, startX, startY, rowSpacing, rows };
}

/**
 * 绘制单个竖式题目
 *
 * 加法/减法格式：
 *       23
 *    +  15
 *   ------
 *
 * 乘法格式：
 *       23
 *    ×   5
 *   ------
 *
 * 除法格式：
 *        ___
 *    5 ) 23
 */
function drawVerticalOne(ctx, question, centerX, topY) {
  const textSize = C.QUESTION.TEXT_SIZE;
  const numSize = C.QUESTION.NUMBER_SIZE;
  const [a, b] = question.operands;
  const operator = question.operator;

  // 题号（左上角，左移避免与竖式重叠）
  ctx.fillStyle = C.CANVAS_COLORS.BLACK;
  ctx.font = `${numSize}px "PingFang SC", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const numberX = centerX - 110;
  ctx.fillText(`${question.id}.`, numberX, topY + 12);

  ctx.font = `${textSize}px "PingFang SC", sans-serif`;
  ctx.textBaseline = 'middle';

  const lineHeight = textSize + 14;
  const digitWidth = 22; // 每个数字字符大约的宽度（对应36px字号）

  if (operator === '÷') {
    // 除法竖式格式：除数 ) 被除数，上方留空写商
    const aStr = String(a);
    const bStr = String(b);

    // b ) a  —— 画在右侧
    const rightX = centerX + digitWidth * 2;

    // 绘制 ") a"
    ctx.textAlign = 'right';
    ctx.fillText(bStr, rightX - digitWidth * 0.5, topY + lineHeight);
    ctx.textAlign = 'left';
    ctx.fillText(aStr, rightX + digitWidth * 0.5, topY + lineHeight);

    // 被除数上方的横线（商的位置）
    ctx.strokeStyle = C.CANVAS_COLORS.BLACK;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rightX + digitWidth * 0.5, topY + lineHeight - digitWidth);
    ctx.lineTo(rightX + digitWidth * 0.5 + aStr.length * digitWidth, topY + lineHeight - digitWidth);
    ctx.stroke();

    // 下方的横线（留出答案空间）
    const resultY = topY + lineHeight * 2.5;
    ctx.beginPath();
    ctx.moveTo(rightX - digitWidth * 0.5, resultY);
    ctx.lineTo(rightX + digitWidth * 0.5 + aStr.length * digitWidth, resultY);
    ctx.stroke();

  } else {
    // 加法/减法/乘法：标准竖式
    const aStr = String(a);
    const bStr = String(b);
    const maxLen = Math.max(aStr.length, bStr.length);

    // 右对齐排列
    const rightX = centerX + digitWidth * 2;

    // 第一行：操作数 a
    ctx.textAlign = 'right';
    ctx.fillText(aStr, rightX, topY);

    // 第二行：运算符 + 操作数 b
    ctx.fillText(`${operator} ${bStr}`, rightX, topY + lineHeight);

    // 第三行：横线（下移留足书写答案空间）
    const lineY = topY + lineHeight * 1.8;
    ctx.strokeStyle = C.CANVAS_COLORS.BLACK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightX - (maxLen + 1) * digitWidth, lineY);
    ctx.lineTo(rightX + digitWidth * 0.5, lineY);
    ctx.stroke();

    // 横线下方留空给答案（不再需要额外的 textAlign，留给手动书写）
  }
}

// ==================== 应用题绘制 ====================

/**
 * 绘制单个应用题（通栏）
 * 使用 measureText 精确换行，支持中英文混排
 * @returns {number} 占用的总高度（含题目文字+留空）
 */
function drawWordOne(ctx, question, x, y, maxWidth) {
  const numSize = C.QUESTION.NUMBER_SIZE;
  const textSize = C.QUESTION.TEXT_SIZE;
  const lineHeight = textSize + 14;

  // 题号
  ctx.fillStyle = C.CANVAS_COLORS.BLACK;
  ctx.font = `bold ${numSize}px "PingFang SC", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`${question.id}.`, x, y);

  // 题目文字（精确自动换行）
  const textX = x + numSize + 16;
  const text = question.scenario || '';
  const availableWidth = maxWidth - numSize - 16;

  ctx.font = `${textSize}px "PingFang SC", sans-serif`;

  let currentY = y;
  let remaining = text;

  while (remaining.length > 0) {
    // 逐字符测量宽度，找到能放入当前行的最大字符数
    let lineLen = 0;
    let lineWidth = 0;
    while (lineLen < remaining.length) {
      const charWidth = ctx.measureText(remaining[lineLen]).width;
      if (lineWidth + charWidth > availableWidth) break;
      lineWidth += charWidth;
      lineLen++;
    }
    // 如果一行一个字符都放不下，强制放一个
    if (lineLen === 0) lineLen = 1;

    const line = remaining.substring(0, lineLen);
    remaining = remaining.substring(lineLen);
    ctx.fillText(line, textX, currentY);
    currentY += lineHeight;
  }

  // 返回题目文字占用的纯高度
  return currentY - y;
}

// ==================== 主布局与绘制 ====================

/**
 * 根据题目类型自动排版并绘制所有题目
 * @returns {number} 实际绘制区域底部 Y 坐标
 */
function layoutAndDraw(ctx, questions, isAnswer) {
  if (!questions || questions.length === 0) return C.QUESTION.START_Y;

  const firstQ = questions[0];
  const display = firstQ.display;

  if (display === 'word') {
    return drawWordPage(ctx, questions, isAnswer);
  } else if (display === 'vertical') {
    return drawVerticalPage(ctx, questions, isAnswer);
  } else {
    return drawHorizontalPage(ctx, questions, isAnswer);
  }
}

/**
 * 横式题目排版绘制
 */
function drawHorizontalPage(ctx, questions, isAnswer) {
  const { cols, colWidth, startX, startY, rowSpacing } = layoutHorizontal(questions);

  // 根据操作数位数动态调整字号，防止大数字溢出列宽
  let maxDigits = 1;
  questions.forEach(q => {
    (q.operands || []).forEach(op => {
      const d = String(Math.abs(op)).length;
      if (d > maxDigits) maxDigits = d;
    });
  });
  const textSize = maxDigits >= 6 ? 28 : maxDigits >= 5 ? 30 : maxDigits >= 4 ? 33 : C.QUESTION.TEXT_SIZE;

  questions.forEach((q, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = startX + col * colWidth;
    const y = startY + row * rowSpacing;

    if (isAnswer) {
      drawHorizontalAnswer(ctx, q, x, y, textSize);
    } else {
      drawHorizontalOne(ctx, q, x, y, textSize);
    }
  });

  const rows = Math.ceil(questions.length / cols);
  return startY + rows * rowSpacing;
}

/**
 * 横式题目答案
 */
function drawHorizontalAnswer(ctx, question, x, y, textSize) {
  const numSize = C.QUESTION.NUMBER_SIZE;
  const fontSize = textSize || C.QUESTION.TEXT_SIZE;
  const [a, b] = question.operands;

  ctx.fillStyle = C.CANVAS_COLORS.BLACK;
  ctx.font = `${numSize}px "PingFang SC", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${question.id}.`, x, y);

  const expression = `${a} ${question.operator} ${b} = ${question.answer}`;

  ctx.font = `${fontSize}px "PingFang SC", sans-serif`;
  ctx.fillText(expression, x + numSize + 14, y);
}

/**
 * 竖式题目排版绘制
 */
function drawVerticalPage(ctx, questions, isAnswer) {
  const { cols, colWidth, startX, startY, rowSpacing } = layoutVertical(questions.length);

  questions.forEach((q, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const centerX = startX + col * colWidth + colWidth / 2;
    const topY = startY + row * rowSpacing;

    drawVerticalOne(ctx, q, centerX, topY);

    // 答案页：在横线下面填入答案
    if (isAnswer) {
      drawVerticalAnswer(ctx, q, centerX, topY);
    }
  });

  const rows = Math.ceil(questions.length / cols);
  return startY + rows * rowSpacing;
}

/**
 * 竖式题目答案填入
 */
function drawVerticalAnswer(ctx, question, centerX, topY) {
  const textSize = C.QUESTION.TEXT_SIZE;
  const lineHeight = textSize + 14;
  const digitWidth = 22;
  const [a, b] = question.operands;
  const operator = question.operator;

  ctx.fillStyle = '#E74C3C'; // 红色答案
  ctx.font = `bold ${textSize}px "PingFang SC", sans-serif`;

  if (operator === '÷') {
    const aStr = String(a);
    const rightX = centerX + digitWidth * 2;
    // 商写在被除数上方
    ctx.textAlign = 'right';
    ctx.fillText(
      String(question.answer),
      rightX + digitWidth * 0.5 + aStr.length * digitWidth,
      topY + lineHeight - digitWidth * 1.5
    );
    // 余数（如果有），写在横线下方
    if (question.remainder) {
      ctx.font = `${textSize - 4}px "PingFang SC", sans-serif`;
      ctx.fillText(
        `余${question.remainder}`,
        rightX + digitWidth * 0.5 + aStr.length * digitWidth + 20,
        topY + lineHeight * 2.5 + 5
      );
    }
  } else {
    const rightX = centerX + digitWidth * 2;
    // 答案写在横线下方
    const answerY = topY + lineHeight * 2.5;
    ctx.textAlign = 'right';
    ctx.fillText(String(question.answer), rightX, answerY);
  }
}

/**
 * 应用题排版绘制
 */
function drawWordPage(ctx, questions, isAnswer) {
  const textSize = C.QUESTION.TEXT_SIZE;
  const startX = C.CANVAS.MARGIN_LEFT;
  let currentY = C.QUESTION.START_Y;
  const maxWidth = C.CANVAS.WIDTH - C.CANVAS.MARGIN_LEFT - C.CANVAS.MARGIN_RIGHT;
  const wordSpacing = C.QUESTION.WORD_ROW_SPACING || 30;

  questions.forEach((q, i) => {
    q.id = i + 1;

    // 超出画布底部则停止
    if (currentY > C.CANVAS.HEIGHT - C.CANVAS.MARGIN_BOTTOM - 120) {
      return;
    }

    const textHeight = drawWordOne(ctx, q, startX, currentY, maxWidth);

    if (isAnswer) {
      // 答案页：在题目下方显示答案（红色）
      ctx.fillStyle = '#E74C3C';
      ctx.font = `bold ${textSize}px "PingFang SC", sans-serif`;
      ctx.textAlign = 'left';
      const answerText = q.unit
        ? `答：${q.answer}${q.unit}`
        : `答：${q.answer}`;
      ctx.fillText(answerText, startX + C.QUESTION.NUMBER_SIZE + 16, currentY + textHeight + 8);

      // 多步应用题展示解题步骤
      if (q.workSteps && q.workSteps.length > 1) {
        ctx.font = `${textSize - 4}px "PingFang SC", sans-serif`;
        q.workSteps.forEach((step, si) => {
          ctx.fillText(
            step,
            startX + C.QUESTION.NUMBER_SIZE + 24,
            currentY + textHeight + 16 + (si + 1) * (textSize + 4)
          );
        });
      }

      currentY += textHeight + wordSpacing + 24;
    } else {
      // 题目页：题目文字后留答题空行
      currentY += textHeight + wordSpacing;
    }
  });

  return currentY;
}

// ==================== 公共 API ====================

/**
 * 渲染完整的题目页
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
 * @param {Array} questions - 题目数组
 * @param {object} meta - { type, count }
 */
function renderQuestions(ctx, questions, meta) {
  initCanvas(ctx, C.CANVAS.WIDTH, C.CANVAS.HEIGHT);
  drawHeader(ctx, meta);
  drawFooter(ctx);
  layoutAndDraw(ctx, questions, false);
}

/**
 * 渲染完整的答案页
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
 * @param {Array} questions - 题目数组
 * @param {object} meta - { type, count }
 */
function renderAnswers(ctx, questions, meta) {
  initCanvas(ctx, C.CANVAS.WIDTH, C.CANVAS.HEIGHT);

  // 答案页标题
  const typeLabel = C.TYPE_LABELS[meta.type] || '数学练习';
  ctx.fillStyle = C.CANVAS_COLORS.BLACK;
  ctx.font = `bold ${C.HEADER.TITLE_SIZE}px "PingFang SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(`${typeLabel} · 参考答案`, C.CANVAS.WIDTH / 2, C.HEADER.TITLE_Y);

  // 答案页副标题
  ctx.font = `${C.HEADER.INFO_SIZE}px "PingFang SC", sans-serif`;
  ctx.fillText(
    '姓名：__________    日期：____年____月____日',
    C.CANVAS.WIDTH / 2,
    C.HEADER.INFO_Y
  );

  // 分割线
  ctx.strokeStyle = C.CANVAS_COLORS.LINE;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(C.CANVAS.MARGIN_LEFT, C.HEADER.LINE_Y);
  ctx.lineTo(C.CANVAS.WIDTH - C.CANVAS.MARGIN_RIGHT, C.HEADER.LINE_Y);
  ctx.stroke();

  drawFooter(ctx);
  layoutAndDraw(ctx, questions, true);
}

module.exports = {
  initCanvas,
  renderQuestions,
  renderAnswers,
  drawHeader,
  drawFooter,
  layoutAndDraw
};
