<template>
  <div ref="chartRef" class="w-full h-80"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  stats: Array,
  theoretical: Array
});

const chartRef = ref(null);
let chart = null;
let resizeHandler = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  chart = echarts.init(chartRef.value);
  updateOptions();
  
  resizeHandler = () => chart?.resize();
  window.addEventListener('resize', resizeHandler);
};

const updateOptions = () => {
  if (!chart) return;
  
  const options = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e2e8f0',
      textStyle: { color: '#334155' }
    },
    legend: {
      data: ['实验次数', '理论概率'],
      bottom: 0,
      textStyle: { color: '#64748b' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 11 }, (_, i) => `${i} 正面`),
      axisLabel: { color: '#64748b', fontSize: 11 },
      axisLine: { lineStyle: { color: '#cbd5e1' } }
    },
    yAxis: [
      {
        type: 'value',
        name: '次数',
        nameTextStyle: { color: '#64748b' },
        axisLabel: { color: '#64748b' },
        splitLine: { lineStyle: { color: '#e2e8f0' } }
      },
      {
        type: 'value',
        name: '概率',
        max: 0.3,
        nameTextStyle: { color: '#64748b' },
        axisLabel: { color: '#64748b' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '实验次数',
        type: 'bar',
        data: [...props.stats],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#818cf8' },
            { offset: 1, color: '#6366f1' }
          ]),
          borderRadius: [6, 6, 0, 0]
        },
        barMaxWidth: 40
      },
      {
        name: '理论概率',
        type: 'line',
        yAxisIndex: 1,
        data: props.theoretical,
        smooth: true,
        lineStyle: { color: '#ec4899', width: 3 },
        itemStyle: { color: '#ec4899' },
        symbol: 'circle',
        symbolSize: 6
      }
    ],
    animationDuration: 600
  };
  
  chart.setOption(options);
};

onMounted(initChart);

watch(() => props.stats, updateOptions, { deep: true });

onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  chart?.dispose();
});
</script>
