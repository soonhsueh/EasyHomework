/**
 * 小学数学练习题生成器
 * 北京版教材 · 纯前端 · Canvas 渲染 A4 打印
 */

const curriculum = require('./utils/curriculum');
const constants = require('./utils/constants');

App({
  // 挂载工具模块到全局，方便页面访问
  curriculum: curriculum,
  constants: constants,

  globalData: {
    // 当前选择的年级和题型
    grade: null,
    semester: '上',
    questionType: null,

    // 科目注册表（为语文、英语预留）
    subjects: {
      math: {
        name: '数学',
        icon: '📐',
        active: true
      },
      chinese: {
        name: '语文',
        icon: '📝',
        active: false
      },
      english: {
        name: '英语',
        icon: '🔤',
        active: false
      }
    },
    currentSubject: 'math',

    // 用户偏好（本地缓存）
    userPreferences: {
      lastGrade: null,
      lastType: null
    }
  },

  onLaunch() {
    // 读取用户偏好
    const prefs = wx.getStorageSync('userPreferences');
    if (prefs) {
      this.globalData.userPreferences = prefs;
    }
  },

  // 保存用户偏好
  savePreferences() {
    wx.setStorageSync('userPreferences', this.globalData.userPreferences);
  }
});
