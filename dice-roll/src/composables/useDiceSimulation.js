import { ref, computed } from 'vue';

/**
 * Compute theoretical probability distribution for the sum of n six-sided dice
 * using discrete convolution.
 *
 * Single die: uniform [1/6, 1/6, 1/6, 1/6, 1/6, 1/6] for sums 1..6
 * n dice: convolve (n-1)-dice distribution with single-die distribution
 */
function computeTheoretical(n) {
    // Start with a single die: P(sum=k) for k=1..6
    let dist = [1, 1, 1, 1, 1, 1]; // unnormalized; will normalize at the end

    for (let d = 1; d < n; d++) {
        const newLen = dist.length + 5; // adding one more die extends range by 5
        const newDist = new Array(newLen).fill(0);
        for (let i = 0; i < dist.length; i++) {
            for (let face = 0; face < 6; face++) {
                newDist[i + face] += dist[i];
            }
        }
        dist = newDist;
    }

    const total = Math.pow(6, n);
    return dist.map(v => v / total);
}

export function useDiceSimulation() {
    const diceCount = ref(1);

    // Stats array: index 0 = min sum (diceCount), length = 5*diceCount + 1
    const stats = ref(new Array(6).fill(0));
    const totalRolls = ref(0);
    const history = ref([]);

    const minSum = computed(() => diceCount.value);
    const maxSum = computed(() => diceCount.value * 6);
    const statLength = computed(() => maxSum.value - minSum.value + 1);

    const theoretical = computed(() => computeTheoretical(diceCount.value));

    const labels = computed(() =>
        Array.from({ length: statLength.value }, (_, i) => minSum.value + i)
    );

    const rollDice = () => {
        const results = [];
        let sum = 0;
        for (let i = 0; i < diceCount.value; i++) {
            const face = Math.floor(Math.random() * 6) + 1;
            results.push(face);
            sum += face;
        }
        return { results, sum };
    };

    const simulateOnce = () => {
        const { results, sum } = rollDice();
        const idx = sum - minSum.value;
        const newStats = [...stats.value];
        newStats[idx]++;
        stats.value = newStats;
        totalRolls.value++;

        history.value = [{ sum, results, id: Date.now() }, ...history.value].slice(0, 10);
        return { results, sum };
    };

    const batchSimulate = (count) => {
        const newStats = [...stats.value];
        const recentHistory = [];

        for (let i = 0; i < count; i++) {
            const { results, sum } = rollDice();
            const idx = sum - minSum.value;
            newStats[idx]++;
            recentHistory.push({ sum, results, id: Date.now() + i });
            if (recentHistory.length > 10) recentHistory.shift();
        }

        stats.value = newStats;
        totalRolls.value += count;
        history.value = recentHistory.reverse();

        return history.value[0].results;
    };

    const setDiceCount = (n) => {
        diceCount.value = n;
        reset();
    };

    const reset = () => {
        stats.value = new Array(statLength.value).fill(0);
        totalRolls.value = 0;
        history.value = [];
    };

    return {
        diceCount,
        stats,
        totalRolls,
        history,
        theoretical,
        labels,
        minSum,
        maxSum,
        statLength,
        simulateOnce,
        batchSimulate,
        setDiceCount,
        reset,
    };
}
