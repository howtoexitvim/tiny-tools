<template>
  <div class="coin-wrapper flex flex-col items-center">
    <div class="relative w-16 h-16">
      <!-- Neutral "?" layer — OUTSIDE 3D context so it never rotates -->
      <transition name="neutral-fade">
        <div v-if="showNeutral" class="absolute inset-0 rounded-full flex items-center justify-center z-20">
          <div class="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 border-2 border-indigo-300/80 flex items-center justify-center shadow-md">
            <span class="text-indigo-500 font-bold text-lg select-none">?</span>
          </div>
        </div>
      </transition>

      <!-- 3D coin container -->
      <div ref="coinRef" class="w-full h-full preserve-3d">
        <!-- Front (正面) -->
        <div class="absolute inset-0 rounded-full flex items-center justify-center backface-hidden">
          <div class="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-2 border-amber-700 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-base select-none drop-shadow-md">正</span>
          </div>
        </div>
        <!-- Back (反面) -->
        <div class="absolute inset-0 rounded-full flex items-center justify-center backface-hidden rotate-y-180">
          <div class="w-full h-full rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 border-2 border-slate-600 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-base select-none drop-shadow-md">反</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  isHeads: Boolean,
  flipping: Boolean,
  neutral: Boolean
});

const coinRef = ref(null);
const showNeutral = ref(props.neutral);

watch(() => props.neutral, (val) => {
  showNeutral.value = val;
  if (val && !props.flipping && coinRef.value) {
    // When returning to neutral, reset the underlying 3D rotation to avoid Safari/Webkit 3D context bleeding
    gsap.set(coinRef.value, { rotateY: 0 });
  }
});

watch(() => props.flipping, async (isFlipping) => {
  if (isFlipping && coinRef.value) {
    showNeutral.value = false;
    await nextTick();

    // Determine target: even multiples of 360 = 正, +180 = 反
    const targetY = props.isHeads ? 1800 : 1980;
    gsap.fromTo(coinRef.value,
      { rotateY: 0 },
      {
        rotateY: targetY,
        duration: 1,
        ease: "power3.out",
      }
    );
  }
});

watch(() => props.isHeads, (val) => {
  if (!props.flipping && !props.neutral && coinRef.value) {
    gsap.set(coinRef.value, { rotateY: val ? 0 : 180 });
  }
}, { immediate: true });
</script>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
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
