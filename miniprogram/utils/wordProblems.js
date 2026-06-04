/**
 * 应用题场景库 — 小学数学练习题
 *
 * 模板结构：
 * {
 *   template: string,    // 场景描述，{n1} {n2} {n3} 为数字占位符
 *   operation: string,   // 运算类型
 *   grades: number[],    // 适用年级
 *   unit: string,        // 单位
 *   steps: number        // 运算步数
 * }
 */

// ==================== 工具函数 ====================

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillTemplate(template, numbers) {
  let result = template;
  numbers.forEach((n, i) => {
    result = result.replace(`{n${i + 1}}`, n);
  });
  return result;
}

// ==================== 场景模板库 ====================

const TEMPLATES = {

  // ======== 一年级（一步加减） ========
  grade1: [
    // 加法
    { template: '小明有{n1}个苹果，妈妈又给了他{n2}个，小明现在有多少个苹果？', operation: 'addition', grades: [1, 1], unit: '个', steps: 1 },
    { template: '树上有{n1}只小鸟，又飞来{n2}只，树上一共有多少只小鸟？', operation: 'addition', grades: [1, 1], unit: '只', steps: 1 },
    { template: '书架上层有{n1}本书，下层有{n2}本书，书架上一共有多少本书？', operation: 'addition', grades: [1, 1], unit: '本', steps: 1 },
    { template: '小红做了{n1}道题，小刚做了{n2}道题，两人一共做了多少道题？', operation: 'addition', grades: [1, 1], unit: '道', steps: 1 },
    { template: '池塘里有{n1}条红金鱼，{n2}条花金鱼，池塘里一共有多少条金鱼？', operation: 'addition', grades: [1, 1], unit: '条', steps: 1 },
    { template: '篮子里有{n1}个鸡蛋，用了{n2}个，还剩多少个鸡蛋？', operation: 'subtraction', grades: [1, 1], unit: '个', steps: 1 },
    // 减法
    { template: '小明有{n1}块糖，吃了{n2}块，还剩多少块？', operation: 'subtraction', grades: [1, 1], unit: '块', steps: 1 },
    { template: '停车场原来有{n1}辆车，开走了{n2}辆，现在停车场还有多少辆车？', operation: 'subtraction', grades: [1, 1], unit: '辆', steps: 1 },
    { template: '小华有{n1}元钱，买文具花了{n2}元，还剩多少元？', operation: 'subtraction', grades: [1, 1], unit: '元', steps: 1 },
    { template: '操场上有{n1}个小朋友，走了{n2}个，现在操场上有多少个小朋友？', operation: 'subtraction', grades: [1, 1], unit: '个', steps: 1 },
  ],

  // ======== 二年级（四则运算 + 两步） ========
  grade2: [
    // 加法
    { template: '图书馆上午借出{n1}本书，下午借出{n2}本书，一天一共借出多少本书？', operation: 'addition', grades: [2, 2], unit: '本', steps: 1 },
    { template: '一班有{n1}人，二班有{n2}人，两个班一共有多少人？', operation: 'addition', grades: [2, 2], unit: '人', steps: 1 },
    // 减法
    { template: '一根绳子长{n1}米，剪去{n2}米，还剩多少米？', operation: 'subtraction', grades: [2, 2], unit: '米', steps: 1 },
    { template: '商店有{n1}个书包，卖了{n2}个，还剩多少个？', operation: 'subtraction', grades: [2, 2], unit: '个', steps: 1 },
    // 乘法
    { template: '每盒有{n1}支铅笔，{n2}盒一共有多少支铅笔？', operation: 'multiplication', grades: [2, 2], unit: '支', steps: 1 },
    { template: '每组有{n1}个小朋友，{n2}组一共有多少个小朋友？', operation: 'multiplication', grades: [2, 2], unit: '个', steps: 1 },
    { template: '一本书{n1}元，买{n2}本需要多少元？', operation: 'multiplication', grades: [2, 2], unit: '元', steps: 1 },
    { template: '每排种{n1}棵树，种了{n2}排，一共种了多少棵树？', operation: 'multiplication', grades: [2, 2], unit: '棵', steps: 1 },
    // 除法
    { template: '把{n1}个苹果平均分给{n2}个小朋友，每人分得多少个？', operation: 'division', grades: [2, 2], unit: '个', steps: 1 },
    { template: '有{n1}朵花，每{n2}朵扎成一束，可以扎成多少束？', operation: 'division', grades: [2, 2], unit: '束', steps: 1 },
    { template: '{n1}元钱买{n2}本同样的本子，每本多少元？', operation: 'division', grades: [2, 2], unit: '元', steps: 1 },
    { template: '{n1}个同学坐船，每条船坐{n2}人，需要多少条船？', operation: 'division', grades: [2, 2], unit: '条', steps: 1 },
    // 两步（二年级下：混合运算单元）
    { template: '小明买了{n1}支铅笔和{n2}块橡皮，铅笔每支{n3}元，橡皮每块{n4}元，一共花了多少元？', operation: 'mixed', grades: [2, 3], unit: '元', steps: 2, answerType: 'multiply_add' },
    { template: '一班有{n1}人，二班比一班多{n2}人，两个班一共有多少人？', operation: 'mixed', grades: [2, 2], unit: '人', steps: 2, answerType: 'add_diff_total' },
    { template: '妈妈买了{n1}个苹果，吃了{n2}个，又把剩下的平均分给{n3}个小朋友，每人分得多少个？', operation: 'mixed', grades: [2, 3], unit: '个', steps: 2, answerType: 'subtract_divide' },
  ],

  // ======== 三年级（多位数 + 分数初步） ========
  grade3: [
    { template: '果园里有{n1}棵苹果树，{n2}棵梨树，一共有多少棵果树？', operation: 'addition', grades: [3, 3], unit: '棵', steps: 1 },
    { template: '一辆汽车每小时行驶{n1}千米，{n2}小时行驶了多少千米？', operation: 'multiplication', grades: [3, 3], unit: '千米', steps: 1 },
    { template: '学校有{n1}本图书，平均分给{n2}个班，每班分得多少本？', operation: 'division', grades: [3, 3], unit: '本', steps: 1 },
    { template: '长方形的长是{n1}厘米，宽是{n2}厘米，它的周长是多少厘米？', operation: 'mixed', grades: [3, 3], unit: '厘米', steps: 2, answerType: 'perimeter' },
    { template: '小明{n1}分钟走了{n2}米，照这样的速度，{n3}分钟能走多少米？', operation: 'mixed', grades: [3, 4], unit: '米', steps: 2, answerType: 'speed_distance' },
    { template: '一个蛋糕平均分成{n1}块，小红吃了{n2}块，还剩几分之几？', operation: 'mixed', grades: [3, 3], unit: '', steps: 1, answerType: 'fraction_remain' },
    { template: '一桶油重{n1}千克，用去一半后，还剩多少千克？', operation: 'mixed', grades: [3, 3], unit: '千克', steps: 1, answerType: 'half' },
    { template: '商店运来{n1}箱苹果，每箱{n2}千克，一共运来多少千克苹果？', operation: 'multiplication', grades: [3, 3], unit: '千克', steps: 1 },
    { template: '三年级的同学去春游，一共{n1}人，每{n2}人一组，可以分成多少组？', operation: 'division', grades: [3, 3], unit: '组', steps: 1 },
    { template: '一本故事书{n1}页，小明每天看{n2}页，多少天能看完？', operation: 'division', grades: [3, 3], unit: '天', steps: 1 },
    { template: '爸爸买了{n1}千克苹果和{n2}千克梨，苹果每千克{n3}元，梨每千克{n4}元，一共花了多少元？', operation: 'mixed', grades: [3, 4], unit: '元', steps: 2, answerType: 'multiply_add' },
    { template: '一根铁丝长{n1}厘米，用去{n2}厘米，剩下的铁丝是原来的几分之几？', operation: 'mixed', grades: [3, 3], unit: '', steps: 2, answerType: 'remain_fraction' },
  ],

  // ======== 四年级（大数 + 小数） ========
  grade4: [
    { template: '我国某省的面积约为{n1}平方千米，另一个省的面积约为{n2}平方千米，两个省的面积一共约多少平方千米？', operation: 'addition', grades: [4, 4], unit: '平方千米', steps: 1 },
    { template: '一列火车每小时行驶{n1}千米，从甲地到乙地需要{n2}小时，两地相距多少千米？', operation: 'multiplication', grades: [4, 4], unit: '千米', steps: 1 },
    { template: '小明带了{n1}元去超市，买了一个{n2}元的书包和一本{n3}元的笔记本，还剩多少元？', operation: 'mixed', grades: [4, 4], unit: '元', steps: 2, answerType: 'subtract_add' },
    { template: '一块长方形菜地，长{n1}米，宽{n2}米，它的面积是多少平方米？', operation: 'multiplication', grades: [4, 4], unit: '平方米', steps: 1 },
    { template: '工厂生产了{n1}个零件，每{n2}个装一箱，可以装多少箱？还剩多少个？', operation: 'division', grades: [4, 4], unit: '箱', steps: 1 },
    { template: '妈妈去超市买了{n1}千克大米，每千克{n2}.{n3}元，一共花了多少元？', operation: 'multiplication', grades: [4, 5], unit: '元', steps: 1 },
    { template: '一瓶饮料{n1}.{n2}升，喝了{n3}.{n4}升，还剩多少升？', operation: 'subtraction', grades: [4, 5], unit: '升', steps: 1 },
    { template: '买{n1}本同样的书共花了{n2}.{n3}元，每本书多少元？', operation: 'division', grades: [4, 5], unit: '元', steps: 1 },
    { template: '一辆卡车每次运{n1}吨货物，运了{n2}次，一共运了多少吨？', operation: 'multiplication', grades: [4, 4], unit: '吨', steps: 1 },
    { template: '爷爷今年{n1}岁，小明今年{n2}岁，爷爷的年龄大约是小明的多少倍？', operation: 'division', grades: [4, 4], unit: '倍', steps: 1 },
    { template: '一袋大米{n1}千克，吃了{n2}天后还剩{n3}千克，平均每天吃多少千克？', operation: 'mixed', grades: [4, 5], unit: '千克', steps: 2, answerType: 'subtract_divide' },
  ],

  // ======== 五年级（小数乘除 + 分数 + 方程） ========
  grade5: [
    { template: '一块玻璃{n1}.{n2}元/平方米，面积是{n3}.{n4}平方米，买这块玻璃需要多少钱？', operation: 'multiplication', grades: [5, 5], unit: '元', steps: 1 },
    { template: '小明跑了{n1}米用了{n2}秒，他平均每秒跑多少米？（保留两位小数）', operation: 'division', grades: [5, 5], unit: '米', steps: 1 },
    { template: '一个三角形底是{n1}厘米，高是{n2}厘米，它的面积是多少平方厘米？', operation: 'mixed', grades: [5, 5], unit: '平方厘米', steps: 1, answerType: 'triangle_area' },
    { template: '小华看了一本书的{n1}/{n2}，还剩下几分之几没看？', operation: 'subtraction', grades: [5, 5], unit: '', steps: 1 },
    { template: '一个蛋糕，小明吃了{n1}/{n2}，小红吃了{n3}/{n4}，两人一共吃了几分之几？', operation: 'addition', grades: [5, 5], unit: '', steps: 1 },
    { template: '一根绳子长{n1}米，截去{n2}/{n3}，截去了多少米？', operation: 'mixed', grades: [5, 6], unit: '米', steps: 1, answerType: 'fraction_of' },
    { template: '一个长方形的长是{n1}厘米，宽是长的{n2}/{n3}，宽是多少厘米？', operation: 'mixed', grades: [5, 6], unit: '厘米', steps: 1, answerType: 'fraction_of' },
    { template: '五年级{n1}名同学参加植树，每{n2}人一组，可以分成多少组？', operation: 'division', grades: [5, 5], unit: '组', steps: 1 },
    { template: '一桶油用去{n1}千克，正好是这桶油的{n2}/{n3}，这桶油原来有多少千克？', operation: 'mixed', grades: [5, 6], unit: '千克', steps: 1, answerType: 'fraction_whole' },
    { template: '某班男生{n1}人，女生{n2}人，男生人数是女生人数的几分之几？', operation: 'division', grades: [5, 5], unit: '', steps: 1 },
    { template: '一件衣服打八折后售价{n1}元，原价多少元？', operation: 'mixed', grades: [5, 6], unit: '元', steps: 1, answerType: 'discount80' },
    { template: '梯形上底{n1}厘米，下底{n2}厘米，高{n3}厘米，面积是多少平方厘米？', operation: 'mixed', grades: [5, 5], unit: '平方厘米', steps: 2, answerType: 'trapezoid_area' },
  ],

  // ======== 六年级（分数乘除 + 百分数 + 比例） ========
  grade6: [
    { template: '一本书有{n1}页，小明第一天看了全书的{n2}/{n3}，第二天看了全书的{n4}/{n5}，两天一共看了多少页？', operation: 'mixed', grades: [6, 6], unit: '页', steps: 3, answerType: 'fraction_parts' },
    { template: '一件商品原价{n1}元，现在打{n2}折出售，现价是多少元？', operation: 'multiplication', grades: [6, 6], unit: '元', steps: 1 },
    { template: '爸爸把{n1}元存入银行，年利率是{n2}.{n3}%，一年后可以取回本息共多少元？', operation: 'mixed', grades: [6, 6], unit: '元', steps: 2, answerType: 'interest' },
    { template: '六一班有{n1}人，今天的出勤率是{n2}%，今天有多少人出勤？', operation: 'multiplication', grades: [6, 6], unit: '人', steps: 1 },
    { template: '某化肥厂上月生产化肥{n1}吨，这个月比上月增产{n2}%，这个月生产化肥多少吨？', operation: 'mixed', grades: [6, 6], unit: '吨', steps: 2, answerType: 'percent_increase' },
    { template: '甲乙两地相距{n1}千米，在比例尺1:{n2}的地图上，两地距离是多少厘米？', operation: 'division', grades: [6, 6], unit: '厘米', steps: 1 },
    { template: '一个圆形花坛的半径是{n1}米，它的面积是多少平方米？（π取3.14）', operation: 'mixed', grades: [6, 6], unit: '平方米', steps: 1, answerType: 'circle_area' },
    { template: '小明和小红共有{n1}元，他们的钱数比是{n2}:{n3}，小明有多少元？', operation: 'mixed', grades: [6, 6], unit: '元', steps: 2, answerType: 'ratio_split' },
    { template: '把{n1}克糖放入{n2}克水中，糖占糖水的百分之几？', operation: 'division', grades: [6, 6], unit: '%', steps: 1 },
    { template: '一项工程，甲队单独做{n1}天完成，乙队单独做{n2}天完成，两队合作需要多少天？', operation: 'mixed', grades: [6, 6], unit: '天', steps: 3, answerType: 'work_together' },
    { template: '一个圆柱底面半径{n1}厘米，高{n2}厘米，体积是多少立方厘米？（π取3.14）', operation: 'mixed', grades: [6, 6], unit: '立方厘米', steps: 1, answerType: 'cylinder_volume' },
    { template: '某班有{n1}人，体育达标人数是{n2}人，达标率是多少？', operation: 'division', grades: [6, 6], unit: '%', steps: 1 },
  ]
};

// ==================== 生成函数 ====================

/**
 * 从指定年级的模板库中随机选题生成应用题
 * @param {object} config - curriculum 配置
 * @param {number} count - 题目数量
 * @param {number} grade - 年级 (1-6)
 * @returns {array} 题目对象数组
 */
function generate(config, count, grade = 2) {
  const questions = [];
  const maxSteps = config.wordProblemSteps || 1;

  // 按年级筛选模板：优先当前年级，可扩展到 ±1 年级
  let pool = [];
  for (let g = Math.max(1, grade - 1); g <= Math.min(6, grade + 1); g++) {
    const key = `grade${g}`;
    if (TEMPLATES[key]) {
      // 筛选 templates.grades 包含当前年级的
      const filtered = TEMPLATES[key].filter(t => {
        const gr = t.grades || [g, g];
        return grade >= gr[0] && grade <= gr[1];
      });
      pool.push(...filtered);
    }
  }

  // 再根据步数筛选
  let filtered = pool.filter(t => t.steps <= maxSteps);
  if (filtered.length === 0) {
    // 降级：使用全部池子
    filtered = pool.slice();
  }

  // 随机选取 count 道
  const selected = [];
  const copy = filtered.slice();
  while (selected.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    selected.push(copy.splice(idx, 1)[0]);
  }

  // 如果模板不够，循环补充
  while (selected.length < count) {
    const t = filtered[Math.floor(Math.random() * filtered.length)];
    selected.push(t);
  }

  // 根据模板生成题目
  selected.slice(0, count).forEach((tpl, i) => {
    const numbers = generateNumbersForTemplate(tpl, grade);
    const questionText = fillTemplate(tpl.template, numbers);
    const answerData = calculateAnswer(tpl, numbers);

    questions.push({
      id: i + 1,
      type: 'word_problems',
      display: 'word',
      scenario: questionText,
      operands: numbers,
      operator: tpl.operation,
      answer: answerData.answer,
      unit: tpl.unit,
      steps: tpl.steps,
      workSteps: answerData.steps
    });
  });

  return questions;
}

/**
 * 根据模板生成合适的随机操作数
 * @param {object} tpl - 模板对象
 * @param {number} grade - 当前年级
 */
function generateNumbersForTemplate(tpl, grade = 2) {
  const count = (tpl.template.match(/\{n\d+\}/g) || []).length;
  const numbers = [];

  // 根据当前年级确定数字范围
  let max;
  switch (grade) {
    case 1: max = 20; break;
    case 2: max = 100; break;
    case 3: max = 999; break;
    case 4: max = 9999; break;
    case 5: max = 100; break;   // 分数/小数的分子分母
    case 6: max = 100; break;
    default: max = 100;
  }

  // 分数类模板（模板中含 / 符号），分子分母用更小的数
  if (tpl.template.includes('{n1}/{n2}') || tpl.template.includes('{n3}/{n4}')) {
    max = Math.min(max, 12);
  }

  for (let i = 0; i < count; i++) {
    const min = (tpl.operation === 'subtraction' && i === 1) ? 0 : 1;
    numbers.push(randInt(min, max));
  }

  // 减法：确保被减数 >= 减数
  if (tpl.operation === 'subtraction' && numbers.length >= 2) {
    if (numbers[1] > numbers[0]) {
      [numbers[0], numbers[1]] = [numbers[1], numbers[0]];
    }
  }

  // 除法：确保被除数 >= 除数，且除数不为0
  if (tpl.operation === 'division' && numbers.length >= 2) {
    if (numbers[1] === 0) numbers[1] = 2;
    if (numbers[0] < numbers[1]) {
      numbers[0] = numbers[1] * randInt(2, Math.floor(max / numbers[1]));
    }
  }

  // 分数场景：确保分母 > 分子（真分数），且分子不为0
  if (tpl.answerType === 'fraction_remain' && numbers.length >= 2) {
    if (numbers[1] >= numbers[0]) numbers[1] = randInt(1, numbers[0] - 1);
  }
  if ((tpl.answerType === 'fraction_of' || tpl.answerType === 'fraction_parts') && numbers.length >= 3) {
    if (numbers[2] <= numbers[1]) numbers[2] = numbers[1] + randInt(1, 10);
  }

  // subtract_divide 模板：确保被减数 >= 减数
  if (tpl.answerType === 'subtract_divide' && numbers.length >= 3) {
    if (numbers[1] > numbers[0]) numbers[1] = randInt(1, numbers[0] - 1);
  }

  return numbers;
}

/**
 * 计算应用题答案（基于 answerType 结构化计算）
 * @returns {{ answer: number|string, steps: string[] }}
 */
function calculateAnswer(tpl, numbers) {
  const n = numbers;
  let answer;
  const steps = [];
  const at = tpl.answerType || '';

  switch (tpl.operation) {
    case 'addition':
      answer = n[0] + n[1];
      steps.push(`${n[0]} + ${n[1]} = ${answer}`);
      break;

    case 'subtraction':
      answer = n[0] - n[1];
      steps.push(`${n[0]} - ${n[1]} = ${answer}`);
      break;

    case 'multiplication':
      answer = n[0] * n[1];
      steps.push(`${n[0]} × ${n[1]} = ${answer}`);
      break;

    case 'division':
      answer = Math.floor(n[0] / n[1]);
      const remainder = n[0] % n[1];
      if (remainder > 0) {
        steps.push(`${n[0]} ÷ ${n[1]} = ${answer}···${remainder}`);
        answer = `${answer}···${remainder}`;
      } else {
        steps.push(`${n[0]} ÷ ${n[1]} = ${answer}`);
      }
      break;

    case 'mixed':
      // 根据 answerType 分派到具体的计算函数
      switch (at) {
        case 'multiply_add': {
          const p1 = n[0] * n[2];
          const p2 = n[1] * n[3];
          answer = p1 + p2;
          steps.push(`${n[0]} × ${n[2]} = ${p1}`);
          steps.push(`${n[1]} × ${n[3]} = ${p2}`);
          steps.push(`${p1} + ${p2} = ${answer}`);
          break;
        }
        case 'add_diff_total': {
          const diff = n[0] + n[1];
          answer = n[0] + diff;
          steps.push(`${n[0]} + ${n[1]} = ${diff}`);
          steps.push(`${n[0]} + ${diff} = ${answer}`);
          break;
        }
        case 'subtract_divide': {
          const remain = n[0] - n[1];
          answer = Math.floor(remain / n[2]);
          steps.push(`${n[0]} - ${n[1]} = ${remain}`);
          steps.push(`${remain} ÷ ${n[2]} = ${answer}`);
          break;
        }
        case 'subtract_add': {
          const spent = n[1] + n[2];
          answer = n[0] - spent;
          steps.push(`${n[1]} + ${n[2]} = ${spent}`);
          steps.push(`${n[0]} - ${spent} = ${answer}`);
          break;
        }
        case 'perimeter': {
          answer = 2 * (n[0] + n[1]);
          steps.push(`(${n[0]} + ${n[1]}) × 2 = ${answer}`);
          break;
        }
        case 'speed_distance': {
          const speed = Math.floor(n[1] / n[0]);
          answer = speed * n[2];
          steps.push(`${n[1]} ÷ ${n[0]} = ${speed}(米/分钟)`);
          steps.push(`${speed} × ${n[2]} = ${answer}(米)`);
          break;
        }
        case 'remain_fraction': {
          answer = `${n[0] - n[1]}/${n[0]}`;
          steps.push(`${n[0]} - ${n[1]} = ${n[0] - n[1]}`);
          steps.push(`剩下：${n[0] - n[1]}/${n[0]}`);
          break;
        }
        case 'triangle_area': {
          answer = (n[0] * n[1]) / 2;
          steps.push(`${n[0]} × ${n[1]} ÷ 2 = ${answer}`);
          break;
        }
        case 'trapezoid_area': {
          answer = (n[0] + n[1]) * n[2] / 2;
          steps.push(`(${n[0]} + ${n[1]}) × ${n[2]} ÷ 2 = ${answer}`);
          break;
        }
        case 'interest': {
          const rate = parseFloat(`${n[1]}.${n[2]}`) / 100;
          const interest = Math.round(n[0] * rate);
          answer = n[0] + interest;
          steps.push(`利息：${n[0]} × ${n[1]}.${n[2]}% = ${interest}(元)`);
          steps.push(`本息：${n[0]} + ${interest} = ${answer}(元)`);
          break;
        }
        case 'percent_increase': {
          const increase = Math.round(n[0] * n[1] / 100);
          answer = n[0] + increase;
          steps.push(`增产：${n[0]} × ${n[1]}% = ${increase}(吨)`);
          steps.push(`${n[0]} + ${increase} = ${answer}(吨)`);
          break;
        }
        case 'circle_area': {
          answer = Math.round(3.14 * n[0] * n[0] * 100) / 100;
          steps.push(`3.14 × ${n[0]}² = ${answer}`);
          break;
        }
        case 'cylinder_volume': {
          answer = Math.round(3.14 * n[0] * n[0] * n[1] * 100) / 100;
          steps.push(`3.14 × ${n[0]}² × ${n[1]} = ${answer}`);
          break;
        }
        case 'ratio_split': {
          const total = n[1] + n[2];
          answer = Math.round(n[0] * n[1] / total);
          steps.push(`总份数：${n[1]} + ${n[2]} = ${total}`);
          steps.push(`${n[0]} × ${n[1]}/${total} = ${answer}(元)`);
          break;
        }
        case 'fraction_parts': {
          const p1 = Math.floor(n[0] * n[1] / n[2]);
          const p2 = Math.floor(n[0] * n[3] / n[4]);
          answer = p1 + p2;
          steps.push(`第一天：${n[0]} × ${n[1]}/${n[2]} = ${p1}(页)`);
          steps.push(`第二天：${n[0]} × ${n[3]}/${n[4]} = ${p2}(页)`);
          steps.push(`${p1} + ${p2} = ${answer}(页)`);
          break;
        }
        case 'half': {
          answer = Math.round(n[0] / 2);
          steps.push(`${n[0]} ÷ 2 = ${answer}(千克)`);
          break;
        }
        case 'fraction_of': {
          answer = Math.round(n[0] * n[1] / n[2]);
          steps.push(`${n[0]} × ${n[1]}/${n[2]} = ${answer}`);
          break;
        }
        case 'fraction_remain': {
          answer = `${n[0] - n[1]}/${n[0]}`;
          steps.push(`1 - ${n[1]}/${n[0]} = ${n[0] - n[1]}/${n[0]}`);
          break;
        }
        case 'fraction_whole': {
          answer = Math.round(n[0] * n[2] / n[1]);
          steps.push(`${n[0]} ÷ ${n[1]}/${n[2]} = ${n[0]} × ${n[2]}/${n[1]} = ${answer}`);
          break;
        }
        case 'discount80': {
          answer = Math.round(n[0] / 0.8);
          steps.push(`原价 × 80% = ${n[0]}`);
          steps.push(`原价 = ${n[0]} ÷ 0.8 = ${answer}(元)`);
          break;
        }
        case 'work_together': {
          const total = n[0] * n[1];
          const perDay = n[0] + n[1];
          answer = Math.round(total / perDay);
          steps.push(`甲效率：1/${n[0]}，乙效率：1/${n[1]}`);
          steps.push(`合作：1 ÷ (1/${n[0]} + 1/${n[1]}) ≈ ${answer}(天)`);
          break;
        }
        default: {
          // 默认：加法
          answer = n.reduce((a, b) => a + b, 0);
          steps.push(`${n.join(' + ')} = ${answer}`);
        }
      }
      break;

    default:
      answer = n.reduce((a, b) => a + b, 0);
      steps.push(`结果 = ${answer}`);
  }

  return { answer, steps };
}

module.exports = {
  TEMPLATES,
  generate
};
