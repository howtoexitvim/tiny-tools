<div align="center">

# Tiny Tools

[English](README.md) · [简体中文](README.zh-CN.md)

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vuedotjs&logoColor=white)
![Build](https://img.shields.io/badge/build-Vite-646cff?logo=vite&logoColor=white)
![Type](https://img.shields.io/badge/type-teaching%20demos-2563eb)

</div>

Two small browser tools that make a probability theorem visible by letting you run the experiment yourself.

Both were built for university open days, science exhibitions, and classroom use: you press a button, the results pile up, and the shape everyone has seen in a textbook appears on its own.

## The tools

| | What it shows | Try it |
| --- | --- | --- |
| **[Coin Flip](coin-flip/)** | The **law of large numbers** and the **binomial distribution**. Flip ten coins at a time, or run a batch of a thousand, and watch the tally settle toward the theoretical curve. | [README](coin-flip/README.md) |
| **[Dice Roll](dice-roll/)** | The **central limit theorem**. Sum one to six dice: a single die is flat and uniform, but add more and the distribution bends into a bell — whatever the original shape was. | [README](dice-roll/README.md) |

Each has a 3D flip animation (GSAP), a live ECharts plot with the theoretical curve drawn over the measured bars, and a running history of recent rounds.

## Running them

Each tool is a self-contained Vite project. Pick one and work inside it:

```bash
cd coin-flip     # or: cd dice-roll
npm install
npm run dev      # development server
npm run build    # production build
npm run preview  # preview the build
```

`dice-roll` builds to a single `index.html` via `vite-plugin-singlefile`, so it can be opened from a USB stick at an exhibition booth with no server at all.

## Stack

Vue 3 (Composition API), Vite, Tailwind CSS, ECharts for the plots, GSAP for the animation.

## License

[MIT](LICENSE)

<!-- rev 3 -->
