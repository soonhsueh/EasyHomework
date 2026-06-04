/**
 * 题型选择页
 */

const app = getApp();

// 题型展示配置
const TYPE_CONFIG = {
  addition:      { label: '加法练习',       icon: '➕',  key: 'addition' },
  subtraction:   { label: '减法练习',       icon: '➖',  key: 'subtraction' },
  multiplication:{ label: '乘法练习',       icon: '✖️',  key: 'multiplication' },
  division:      { label: '除法练习',       icon: '➗',  key: 'division' },
  mixed:         { label: '混合运算',       icon: '🔀',  key: 'mixed' },
  vertical:      { label: '竖式计算',       icon: '📐',  key: 'vertical' },
  word_problems: { label: '应用题',         icon: '📝',  key: 'word_problems' }
};

Page({
  data: {
    grade: 1,
    gradeLabel: '一年级',
    semester: '上',
    types: []
  },

  onLoad(options) {
    const grade = parseInt(options.grade) || 1;
    const semester = options.semester || this.getDefaultSemester();
    const gradeLabels = app.constants.GRADE_LABELS;

    // 从 curriculum 获取当前年级+学期可用题型
    const availableKeys = app.curriculum.getAvailableTypes(grade, semester);
    const types = availableKeys.map(key => TYPE_CONFIG[key]).filter(Boolean);

    this.setData({
      grade,
      gradeLabel: gradeLabels[grade],
      semester,
      types
    });
  },

  /**
   * 根据当前月份自动判断默认学期
   * 2月-7月 → 下学期，8月-1月 → 上学期
   */
  getDefaultSemester() {
    const month = new Date().getMonth() + 1;
    return (month >= 2 && month <= 7) ? '下' : '上';
  },

  /**
   * 切换学期
   */
  onSemesterTap(e) {
    const semester = e.currentTarget.dataset.semester;
    if (semester === this.data.semester) return;

    const availableKeys = app.curriculum.getAvailableTypes(this.data.grade, semester);
    const types = availableKeys.map(key => TYPE_CONFIG[key]).filter(Boolean);

    this.setData({ semester, types });
  },

  /**
   * 选择题型，跳转预览页
   */
  onTypeTap(e) {
    const type = e.currentTarget.dataset.type;

    app.globalData.questionType = type;
    app.globalData.userPreferences.lastType = type;
    app.savePreferences();

    wx.navigateTo({
      url: `/pages/preview/preview?grade=${this.data.grade}&semester=${this.data.semester}&type=${type}`
    });
  }
});
