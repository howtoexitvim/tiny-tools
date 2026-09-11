# DiceRoll Stats — 概率实验室

一个基于 Vue 3 构建的骰子投掷概率可视化工具，直观展示中心极限定理（Central Limit Theorem）。通过多颗骰子的求和分布，观察实验结果如何随样本量增大逐渐趋近正态分布。

## 功能特性

- **自由选择骰子数量**（1 ~ 6 颗），即时切换并重置数据
- **单次或批量投掷**（1 / 10 / 100 / 1000 次），快速积累数据
- **实时统计图表**：柱状图显示各和值出现次数，折线叠加理论概率与实验概率
- **各求和值统计列表**：可滚动，展示每个和值的出现次数与频率
- **3D 骰子动画**：基于 GSAP 的翻转动效，前面显示骰子点数
- **Glassmorphism 界面风格**，Teal/Amber 配色，响应式布局

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`) |
| 构建工具 | [Vite 7](https://vitejs.dev/) |
| 样式 | [Tailwind CSS v4](https://tailwindcss.com/) |
| 图表 | [ECharts 6](https://echarts.apache.org/) |
| 动画 | [GSAP 3](https://gsap.com/) |
| 产物 | [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)（单 HTML 文件输出） |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本（输出为单个 index.html）
npm run build

# 本地预览构建产物
npm run preview
```

## 项目结构

```
dice-roll/
├── src/
│   ├── App.vue                  # 主应用布局与交互逻辑
│   ├── components/
│   │   ├── Dice.vue             # 3D 骰子组件（GSAP 动画）
│   │   └── DiceChart.vue        # ECharts 统计图表组件
│   └── composables/
│       └── useDiceSimulation.js # 骰子模拟核心逻辑（概率计算）
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## 背景

项目核心演示的是**中心极限定理**：

> 多个独立同分布随机变量之和的分布，当数量足够大时，趋向于正态分布 — 无论原始分布形态如何。

单颗骰子的求和分布是均匀分布（1~6 等概率），而多颗骰子之和的分布则随骰子数量增加逐渐演变成钟形曲线，本工具让这一过程可视化、可交互。

## License

MIT
