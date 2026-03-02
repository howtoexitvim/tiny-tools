<template>
  <main class="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
    <!-- Header -->
    <header class="text-center mb-12 animate-fade-in">
      <h1 class="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 mb-4">
        CoinFlip Stats - 概率实验室
      </h1>
      <p class="text-slate-500 text-lg max-w-2xl mx-auto">
        探索大数定律。抛掷十枚硬币，观察实际频率如何趋近于完美的二项分布曲线。
      </p>
    </header>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
      
      <!-- Left: Simulation Area -->
      <section class="lg:col-span-2 space-y-8">
        <!-- Coin Interaction Card -->
        <div class="glass-dark p-8 flex flex-col items-center">
          <div class="grid grid-cols-5 gap-6 mb-12">
            <Coin 
              v-for="(coin, index) in currentFlips" 
              :key="index" 
              :is-heads="coin" 
              :flipping="isFlipping"
              :neutral="isNeutral"
            />
          </div>
          
          <div class="flex flex-wrap gap-4 justify-center">
            <button @click="handleSimulate" :disabled="isFlipping" class="btn-primary flex items-center gap-2">
              <span v-if="!isFlipping">模拟抛掷 (10枚)</span>
              <span v-else>抛掷中...</span>
            </button>
            <button @click="handleBatch(100)" :disabled="isFlipping" class="btn-secondary">批量模拟 100 次</button>
            <button @click="handleBatch(1000)" :disabled="isFlipping" class="btn-secondary">批量模拟 1000 次</button>
            <button @click="handleReset" class="px-6 py-3 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
              清空数据
            </button>
          </div>
        </div>

        <!-- Chart Card -->
        <div class="glass-dark p-8">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
            <span class="w-2 h-6 bg-indigo-500 rounded-full"></span>
            实时统计分布
          </h2>
          <StatsChart :stats="stats" :theoretical="theoretical" />
        </div>
      </section>

      <!-- Right: Summary & History -->
      <aside class="space-y-8">
        <!-- Stats summary -->
        <div class="glass p-8">
          <h2 class="text-xl font-bold mb-6 text-slate-700">实验数据概览</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-slate-500">实验轮次</span>
              <span class="text-2xl font-mono text-indigo-600 font-bold">{{ totalRounds }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500">总抛掷硬币数</span>
              <span class="text-2xl font-mono text-indigo-600 font-bold">{{ totalFlips }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-500">最近正面个数</span>
              <span class="text-2xl font-mono text-pink-500 font-bold">{{ lastHeads }}</span>
            </div>
          </div>
        </div>

        <!-- History -->
        <div class="glass p-8 flex-1 overflow-hidden">
          <h2 class="text-xl font-bold mb-6 text-slate-700">最近 10 次记录</h2>
          <div class="space-y-3">
            <div v-for="item in history" :key="item.id" class="flex justify-between items-center p-3 rounded-xl bg-slate-100/80 border border-slate-200/60 animate-slide-in">
              <span class="text-sm text-slate-400">{{ new Date(item.id).toLocaleTimeString() }}</span>
              <span class="font-bold text-indigo-600">{{ item.heads }} 正面</span>
            </div>
            <div v-if="history.length === 0" class="text-center py-12 text-slate-400">
              尚无实验数据
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Footer -->
    <footer class="mt-20 text-slate-400 text-sm">
      &copy; 2026 BNBU Math Zone - 寓教于乐，见证统计之美
    </footer>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import Coin from './components/Coin.vue';
import StatsChart from './components/StatsChart.vue';
import { useSimulation } from './composables/useSimulation';

const { stats, totalFlips, totalRounds, history, theoretical, simulateOnce, batchSimulate, reset } = useSimulation();

const currentFlips = ref(new Array(10).fill(true));
const isFlipping = ref(false);
const isNeutral = ref(true); // Start with "?" state

const lastHeads = computed(() => {
  if (history.value.length === 0) return '-';
  return history.value[0].heads;
});

const handleSimulate = () => {
  if (isFlipping.value) return;
  
  // Step 1: Show "?" neutral state
  isNeutral.value = true;
  isFlipping.value = false;

  // Step 2: Brief pause to show "?", then flip
  setTimeout(() => {
    const { heads, flips } = simulateOnce();
    currentFlips.value = flips;
    isNeutral.value = false;
    isFlipping.value = true;

    // Step 3: Wait for GSAP animation (1s) to finish
    setTimeout(() => {
      isFlipping.value = false;
    }, 1100);
  }, 400);
};

const handleBatch = (count) => {
  if (isFlipping.value) return;

  // Step 1: Show "?" neutral state
  isNeutral.value = true;
  isFlipping.value = false;

  setTimeout(() => {
    const lastFlip = batchSimulate(count);
    currentFlips.value = lastFlip;
    isNeutral.value = false;
    isFlipping.value = true;

    setTimeout(() => {
      isFlipping.value = false;
    }, 1100);
  }, 400);
};

const handleReset = () => {
  reset();
  currentFlips.value = new Array(10).fill(true);

  isNeutral.value = true;
};
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.4s ease-out;
}
</style>
