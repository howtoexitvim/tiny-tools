<template>
  <main class="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
    <!-- Header -->
    <header class="text-center mb-12 animate-fade-in">
      <h1 class="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-amber-500 mb-4">
        DiceRoll Stats - 概率实验室
      </h1>
      <p class="text-slate-500 text-lg max-w-2xl mx-auto">
        探索中心极限定理。选择骰子数量，观察求和分布如何从均匀分布演变为正态分布。
      </p>
    </header>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">

      <!-- Left: Simulation Area -->
      <section class="lg:col-span-2 space-y-8">
        <!-- Dice Interaction Card -->
        <div class="glass-dark p-8 flex flex-col items-center">
          <!-- Dice Display Area -->
          <div class="flex flex-wrap gap-5 justify-center mb-10">
            <Dice 
              v-for="(die, index) in currentDice" 
              :key="index" 
              :value="die" 
              :rolling="isRolling"
              :neutral="isNeutral"
            />
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 justify-center">
            <button @click="handleSimulate" :disabled="isRolling" class="btn-primary flex items-center gap-2">
              <span v-if="!isRolling">模拟投掷 1 次</span>
              <span v-else>投掷中...</span>
            </button>
            <button @click="handleBatch(10)" :disabled="isRolling" class="btn-secondary">批量 10 次</button>
            <button @click="handleBatch(100)" :disabled="isRolling" class="btn-secondary">批量 100 次</button>
            <button @click="handleBatch(1000)" :disabled="isRolling" class="btn-secondary">批量 1000 次</button>
            <button @click="handleReset" class="px-6 py-3 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
              清空数据
            </button>
          </div>
        </div>

        <!-- Chart Card -->
        <div class="glass-dark p-8">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
            <span class="w-2 h-6 bg-teal-500 rounded-full"></span>
            实时统计分布
          </h2>
          <DiceChart :stats="stats" :theoretical="theoretical" :labels="labels" :show-experimental="totalRolls > 0" />
        </div>
      </section>

      <!-- Right: Summary & Stats -->
      <aside class="flex flex-col gap-8">
        <!-- Dice Count Selector -->
        <div class="glass p-8">
          <h2 class="text-lg font-bold mb-5 text-slate-700">骰子数量</h2>
          <div class="flex gap-3 justify-center">
            <button 
              v-for="n in 6" 
              :key="n" 
              @click="handleSetDiceCount(n)"
              class="btn-dice-count"
              :class="{ active: diceCount === n }"
            >
              {{ n }}
            </button>
          </div>
          <p class="text-[11px] text-slate-400 text-center mt-3">
            切换骰子数量将清空当前数据
          </p>
        </div>

        <!-- Stats summary -->
        <div class="glass p-8">
          <h2 class="text-lg font-bold mb-5 text-slate-700">实验数据概览</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-500">实验轮次</span>
              <span class="text-xl font-mono text-teal-600 font-bold">{{ totalRolls }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-500">最近骰子和</span>
              <span class="text-xl font-mono text-amber-500 font-bold">{{ lastSum }}</span>
            </div>
          </div>
        </div>

        <!-- Sum Stats List -->
        <div class="glass p-6 h-[320px] overflow-hidden">
          <h2 class="text-lg font-bold mb-4 text-slate-700">各求和值统计</h2>
          <div class="space-y-1.5 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
            <div 
              v-for="(label, idx) in labels" 
              :key="label" 
              class="flex justify-between items-center px-3 py-1.5 rounded-lg transition-colors"
              :class="stats[idx] > 0 ? 'bg-teal-50/80 border border-teal-200/60' : 'bg-slate-100/80 border border-slate-200/60'"
            >
              <span class="text-sm text-slate-500">和 = {{ label }}</span>
              <div class="flex items-center gap-3">
                <span class="font-bold text-teal-600">{{ stats[idx] }}</span>
                <span class="text-xs text-slate-400 w-14 text-right">
                  {{ totalRolls > 0 ? ((stats[idx] / totalRolls) * 100).toFixed(1) + '%' : '-' }}
                </span>
              </div>
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
import Dice from './components/Dice.vue';
import DiceChart from './components/DiceChart.vue';
import { useDiceSimulation } from './composables/useDiceSimulation';

const { 
  diceCount, stats, totalRolls, history, theoretical, labels, 
  simulateOnce, batchSimulate, setDiceCount, reset 
} = useDiceSimulation();

const currentDice = ref([1]);
const isRolling = ref(false);
const isNeutral = ref(true);

const lastSum = computed(() => {
  if (history.value.length === 0) return '-';
  return history.value[0].sum;
});

const handleSimulate = () => {
  if (isRolling.value) return;

  // Step 1: Show "?" neutral state
  isNeutral.value = true;
  isRolling.value = false;

  // Step 2: Brief pause to show "?", then roll
  setTimeout(() => {
    const { results, sum } = simulateOnce();
    currentDice.value = results;
    isNeutral.value = false;
    isRolling.value = true;

    // Step 3: Wait for GSAP animation (1s) to finish
    setTimeout(() => {
      isRolling.value = false;
    }, 1100);
  }, 400);
};

const handleBatch = (count) => {
  if (isRolling.value) return;

  // Step 1: Show "?" neutral state
  isNeutral.value = true;
  isRolling.value = false;

  setTimeout(() => {
    const lastResults = batchSimulate(count);
    currentDice.value = lastResults;
    isNeutral.value = false;
    isRolling.value = true;

    setTimeout(() => {
      isRolling.value = false;
    }, 1100);
  }, 400);
};

const handleSetDiceCount = (n) => {
  setDiceCount(n);
  currentDice.value = new Array(n).fill(1);
  isNeutral.value = true;
  isRolling.value = false;
};

const handleReset = () => {
  reset();
  currentDice.value = new Array(diceCount.value).fill(1);
  isNeutral.value = true;
};
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}
</style>
