/**
 * 预览页 — 练习题预览 & 保存
 * 串联：curriculum → generator → renderer → Canvas → 图片导出
 */

const app = getApp();
const generator = require('../../utils/generator');
const renderer = require('../../utils/renderer');
const constants = require('../../utils/constants');

Page({
  data: {
    grade: 1,
    semester: '上',
    questionType: '',
    typeLabel: '加法练习',

    // Tab: 'question' | 'answer'
    currentTab: 'question',

    // Canvas 渲染完成的图片路径
    questionImagePath: '',
    answerImagePath: '',

    // 加载状态
    loading: false,

    // 生成的题目数据（切换 Tab 时复用）
    questions: [],
    meta: {}
  },

  // Canvas 实例引用
  _canvas: null,
  _ctx: null,

  onLoad(options) {
    const grade = parseInt(options.grade) || 1;
    const semester = options.semester || '上';
    const questionType = options.type || 'addition';
    const typeLabel = constants.TYPE_LABELS[questionType] || '数学练习';
    const gradeLabel = constants.GRADE_LABELS[grade] || '一年级';

    this.setData({
      grade,
      gradeLabel,
      semester,
      questionType,
      typeLabel
    });

    // 初始化 Canvas 并生成题目
    this.initCanvas();
  },

  /**
   * 初始化 Canvas 2D
   */
  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#worksheetCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          console.error('Canvas 节点获取失败');
          wx.showToast({ title: 'Canvas 初始化失败', icon: 'none' });
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        // 设置 Canvas 实际像素尺寸（A4 150dpi）
        canvas.width = constants.CANVAS.WIDTH;
        canvas.height = constants.CANVAS.HEIGHT;

        this._canvas = canvas;
        this._ctx = ctx;

        // Canvas 就绪后自动生成
        this.generateWorksheet();
      });
  },

  /**
   * 生成练习题
   */
  generateWorksheet() {
    if (!this._ctx) {
      wx.showToast({ title: '画布未就绪，请稍后', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    try {
      // 1. 获取课程配置
      const config = app.curriculum.getConfig(this.data.grade, this.data.semester);
      if (!config) {
        throw new Error(`未找到年级 ${this.data.grade} 的课程配置`);
      }

      // 2. 生成题目
      const result = generator.generate(config, this.data.questionType, this.data.grade);
      const { questions, meta } = result;

      if (!questions || questions.length === 0) {
        throw new Error('题目生成为空');
      }

      // 更新 meta 信息
      meta.grade = this.data.grade;
      meta.semester = this.data.semester;

      // 3. 保存题目数据（切换 Tab 时复用）
      this.setData({ questions, meta });

      // 4. 渲染题目页
      renderer.renderQuestions(this._ctx, questions, meta);

      // 5. 导出题目图片
      this.exportCanvasToImage('question');

      // 6. 渲染答案页（后台进行）
      setTimeout(() => {
        if (this._ctx) {
          renderer.renderAnswers(this._ctx, questions, meta);
          this.exportCanvasToImage('answer');
        }
      }, 300);

      this.setData({ loading: false });

    } catch (err) {
      console.error('生成题目失败：', err);
      wx.showToast({ title: '生成失败，请重试', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  /**
   * 将 Canvas 导出为临时图片
   * @param {string} mode - 'question' | 'answer'
   */
  exportCanvasToImage(mode) {
    if (!this._canvas) return;

    wx.canvasToTempFilePath({
      canvas: this._canvas,
      success: (res) => {
        if (mode === 'question') {
          this.setData({ questionImagePath: res.tempFilePath });
        } else {
          this.setData({ answerImagePath: res.tempFilePath });
        }
      },
      fail: (err) => {
        console.error('Canvas 导出失败：', err);
      }
    }, this);
  },

  /**
   * 切换题目 / 答案 Tab
   * 切换时重新渲染对应页面
   */
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;

    if (tab === this.data.currentTab) return;

    this.setData({ currentTab: tab });

    // 如果已经有缓存图片，直接显示；否则重新渲染
    const cachedPath = tab === 'question'
      ? this.data.questionImagePath
      : this.data.answerImagePath;

    if (!cachedPath && this._ctx && this.data.questions.length > 0) {
      if (tab === 'question') {
        renderer.renderQuestions(this._ctx, this.data.questions, this.data.meta);
      } else {
        renderer.renderAnswers(this._ctx, this.data.questions, this.data.meta);
      }
      this.exportCanvasToImage(tab);
    }
  },

  /**
   * 换一题：重新生成
   */
  onRegenerate() {
    // 清除缓存图片
    this.setData({
      questionImagePath: '',
      answerImagePath: ''
    });
    this.generateWorksheet();
  },

  /**
   * 保存当前可见的图片到相册
   */
  onSaveImage() {
    const imagePath = this.data.currentTab === 'question'
      ? this.data.questionImagePath
      : this.data.answerImagePath;

    if (!imagePath) {
      wx.showToast({ title: '图片未就绪，请稍后', icon: 'none' });
      return;
    }

    // 先检查相册权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 未授权，发起授权请求
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => this.doSaveImage(imagePath),
            fail: () => {
              wx.showModal({
                title: '需要相册权限',
                content: '保存图片需要访问您的相册权限，请在设置中开启',
                confirmText: '去设置',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting();
                  }
                }
              });
            }
          });
        } else {
          this.doSaveImage(imagePath);
        }
      }
    });
  },

  /**
   * 执行保存图片到相册
   */
  doSaveImage(imagePath) {
    wx.saveImageToPhotosAlbum({
      filePath: imagePath,
      success: () => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success',
          duration: 2000
        });
      },
      fail: (err) => {
        console.error('保存图片失败：', err);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    });
  }
});
