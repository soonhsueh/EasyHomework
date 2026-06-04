/**
 * 首页 — 年级选择
 */

const app = getApp();

Page({
  data: {
    subjects: [],
    currentSubject: 'math',
    grades: [
      { id: 1, label: '一年级', semester: '上/下', color1: '#FFB3BA', color2: '#FF8A80' },
      { id: 2, label: '二年级', semester: '上/下', color1: '#FFDFBA', color2: '#FFCC80' },
      { id: 3, label: '三年级', semester: '上/下', color1: '#FFFFBA', color2: '#FFEA80' },
      { id: 4, label: '四年级', semester: '上/下', color1: '#BAFFC9', color2: '#80E890' },
      { id: 5, label: '五年级', semester: '上/下', color1: '#BAE1FF', color2: '#80C8FF' },
      { id: 6, label: '六年级', semester: '上/下', color1: '#D4BAFF', color2: '#B080E0' }
    ]
  },

  onLoad() {
    this.setData({
      subjects: app.globalData.subjects,
      currentSubject: app.globalData.currentSubject
    });
  },

  /**
   * 选择年级，跳转到题型选择页
   */
  onGradeTap(e) {
    const grade = e.currentTarget.dataset.grade;
    app.globalData.grade = grade;

    // 保存偏好
    app.globalData.userPreferences.lastGrade = grade;
    app.savePreferences();

    wx.navigateTo({
      url: `/pages/type/type?grade=${grade}`
    });
  },

  /**
   * 科目切换（预留，当前仅数学可用）
   */
  onSubjectTap(e) {
    const key = e.currentTarget.dataset.subject;
    const subject = app.globalData.subjects[key];

    if (!subject || !subject.active) {
      wx.showToast({
        title: '即将推出，敬请期待',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    app.globalData.currentSubject = key;
    this.setData({ currentSubject: key });
  }
});
