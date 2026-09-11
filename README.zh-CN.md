<div align="center">

# Tiny Tools

[English](README.md) · [简体中文](README.zh-CN.md)

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Build](https://img.shields.io/badge/build-Vite-646cff?logo=vite&logoColor=white)
![Type](https://img.shields.io/badge/type-teaching%20demos-2563eb)

</div>

两个浏览器里的小工具，用亲手跑一遍实验的方式，把一条概率定理变成看得见的东西。

它们是为大学开放日、科普展览和课堂教学做的：你按下按钮，结果一轮轮堆积，教科书里那条曲线自己浮现出来。

## 两个工具

| | 演示什么 | 说明 |
| --- | --- | --- |
| **[Coin Flip](coin-flip/)** | **大数定律**与**二项分布**。一次抛十枚硬币，或者一口气跑一千轮，看统计结果如何向理论曲线收敛。 | [README](coin-flip/README.md) |
| **[Dice Roll](dice-roll/)** | **中心极限定理**。把一到六颗骰子求和：单颗是均匀分布，颗数一多，分布就弯成钟形——无论原始分布长什么样。 | [README](dice-roll/README.md) |

两个都有 GSAP 的 3D 翻转动画、ECharts 实时图表（理论曲线叠在实测柱状图上），以及最近几轮的历史记录。

## 运行

每个工具都是独立的 Vite 项目，进到目录里操作：

```bash
cd coin-flip     # 或：cd dice-roll
npm install
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

`dice-roll` 通过 `vite-plugin-singlefile` 构建成单个 `index.html`，展台上插个 U 盘就能打开，不需要任何服务器。

## 技术栈

Vue 3（Composition API）、Vite、Tailwind CSS、ECharts 画图、GSAP 做动画。

## License

[MIT](LICENSE)
