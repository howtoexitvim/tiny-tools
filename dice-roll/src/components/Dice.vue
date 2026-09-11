<template>
  <div class="dice-wrapper flex flex-col items-center">
    <div class="relative w-16 h-16">
      <!-- Neutral "?" layer -->
      <transition name="neutral-fade">
        <div v-if="showNeutral" class="absolute inset-0 rounded-xl flex items-center justify-center z-20">
          <div class="w-full h-full rounded-xl bg-gradient-to-br from-teal-100 via-teal-200 to-teal-300 border-2 border-teal-300/80 flex items-center justify-center shadow-md">
            <span class="text-teal-600 font-bold text-lg select-none">?</span>
          </div>
        </div>
      </transition>

      <!-- 3D dice container -->
      <div ref="diceRef" class="w-full h-full dice-3d">
        <!-- Front face with dots -->
        <div class="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden">
          <div class="dice-face-inner" :class="faceGridClass">
            <span v-for="(dot, i) in dotLayout" :key="i" class="dice-dot" :style="dot.style"></span>
          </div>
        </div>
        <!-- Back face (hidden during rotation) -->
        <div class="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden rotate-y-180">
          <div class="w-full h-full rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 border-2 border-teal-700 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xl select-none drop-shadow-md">D</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  value: { type: Number, default: 1 },
  rolling: Boolean,
  neutral: Boolean
});

const diceRef = ref(null);
const showNeutral = ref(props.neutral);

// Dot layouts for dice faces 1-6
const dotPatterns = {
  1: [{ row: 2, col: 2 }],
  2: [{ row: 1, col: 3 }, { row: 3, col: 1 }],
  3: [{ row: 1, col: 3 }, { row: 2, col: 2 }, { row: 3, col: 1 }],
  4: [{ row: 1, col: 1 }, { row: 1, col: 3 }, { row: 3, col: 1 }, { row: 3, col: 3 }],
  5: [{ row: 1, col: 1 }, { row: 1, col: 3 }, { row: 2, col: 2 }, { row: 3, col: 1 }, { row: 3, col: 3 }],
  6: [{ row: 1, col: 1 }, { row: 1, col: 3 }, { row: 2, col: 1 }, { row: 2, col: 3 }, { row: 3, col: 1 }, { row: 3, col: 3 }],
};

const dotLayout = computed(() => {
  const pattern = dotPatterns[props.value] || dotPatterns[1];
  return pattern.map(p => ({
    style: {
      gridRow: p.row,
      gridColumn: p.col,
    }
  }));
});

const faceGridClass = computed(() => 'dice-face-grid');

watch(() => props.neutral, (val) => {
  showNeutral.value = val;
  if (val && !props.rolling && diceRef.value) {
    gsap.set(diceRef.value, { rotateX: 0, rotateY: 0 });
  }
});

watch(() => props.rolling, async (isRolling) => {
  if (isRolling && diceRef.value) {
    showNeutral.value = false;
    await nextTick();

    // Random rotation ending on front face
    const rotX = 360 * (3 + Math.floor(Math.random() * 3));
    const rotY = 360 * (3 + Math.floor(Math.random() * 3));
    gsap.fromTo(diceRef.value,
      { rotateX: 0, rotateY: 0 },
      {
        rotateX: rotX,
        rotateY: rotY,
        duration: 1,
        ease: "power3.out",
      }
    );
  }
});

watch(() => props.value, () => {
  if (!props.rolling && !props.neutral && diceRef.value) {
    gsap.set(diceRef.value, { rotateX: 0, rotateY: 0 });
  }
}, { immediate: true });
</script>

<style scoped>
.dice-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}

.dice-face-inner {
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  background: linear-gradient(to bottom right, #ffffff, #f8fafc, #f1f5f9);
  border: 2px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(3, 1fr);
  padding: 8px;
  place-items: center;
}

.dice-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #0f766e, #0d9488);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(255, 255, 255, 0.3);
}

.neutral-fade-enter-active {
  transition: opacity 0.25s ease-in;
}
.neutral-fade-leave-active {
  transition: opacity 0.15s ease-out;
}
.neutral-fade-enter-from,
.neutral-fade-leave-to {
  opacity: 0;
}
</style>
