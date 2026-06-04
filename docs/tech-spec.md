# 技术规范 — 小学数学练习题生成器

## 1. 技术栈

| 层级 | 选型 | 说明 |
|------|------|------|
| 框架 | 微信小程序原生 | WXML + WXSS + JavaScript |
| 绘图 | Canvas 2D API | 新版 Canvas 接口 |
| 存储 | 本地缓存 (wx.Storage) | 仅缓存用户偏好（上次选的年级等） |
| 依赖 | 无第三方库 | 保持轻量 |

## 2. 架构模式

```
┌─────────────────────────────────┐
│           UI 层 (pages)          │
│  index  ←→  type  ←→  preview  │
└──────────────┬──────────────────┘
               │ 调用
┌──────────────▼──────────────────┐
│         逻辑层 (utils)           │
│  generator  renderer  curriculum│
│  wordProblems  constants        │
└──────────────┬──────────────────┘
               │ 读写
┌──────────────▼──────────────────┐
│        数据层 (app.globalData)   │
│  grade  type  questions  config │
└─────────────────────────────────┘
```

- UI 层只负责交互和展示，不包含业务逻辑
- 逻辑层纯函数，可独立测试
- 数据通过 `app.globalData` 和页面间 `navigator` 参数传递

## 3. 模块接口约定

### 3.1 generator.js

```js
// 统一返回格式
{
  questions: [
    {
      id: 1,                    // 题号
      type: 'addition',         // 运算类型
      display: 'horizontal',    // 'horizontal' | 'vertical' | 'word'
      operands: [23, 15],       // 操作数数组
      operator: '+',            // 运算符
      answer: 38,               // 答案
      // 应用题额外字段
      scenario: '小明有23个苹果...',
      unit: '个'
    }
  ],
  meta: {
    grade: 1,
    semester: '上',
    type: 'addition',
    count: 15
  }
}
```

### 3.2 renderer.js

```js
// 初始化画布
initCanvas(canvas, width, height)

// 渲染题目页
renderQuestions(canvas, questions, meta)

// 渲染答案页
renderAnswers(canvas, questions, meta)
```

### 3.3 curriculum.js

```js
// 获取年级配置
getGradeConfig(grade) → { numberRange, operations, constraints }

// 获取可用题型列表
getAvailableTypes(grade) → ['addition', 'subtraction', ...]
```

## 4. Canvas 规格

| 参数 | 值 | 说明 |
|------|-----|------|
| 宽度 | 1240 px | A4 宽 210mm @150dpi |
| 高度 | 1754 px | A4 高 297mm @150dpi |
| 上边距 | 60 px | |
| 下边距 | 60 px | |
| 左边距 | 60 px | |
| 右边距 | 60 px | |
| 背景色 | #FFFFFF | 白色 |
| 标题字号 | 48 px | 顶部标题 |
| 题目字号 | 32 px | 算式正文 |
| 题号字号 | 28 px | 题号标记 |
| 列间距 | 40 px | 列与列之间 |

## 5. 页面路由

| 路径 | 页面 | 参数 |
|------|------|------|
| pages/index/index | 年级选择 | — |
| pages/type/type | 题型选择 | grade |
| pages/preview/preview | 预览保存 | grade, type |

## 6. 兼容性

- 微信基础库版本 ≥ 2.9.0（支持 Canvas 2D）
- iOS 12+ / Android 8+
- 屏幕适配：使用 rpx 单位，以 iPhone 6 (375px) 为基准
