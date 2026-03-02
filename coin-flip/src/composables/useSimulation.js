import { ref } from 'vue';

export function useSimulation() {
    // Results for 0 to 10 heads (index matching heads count)
    const stats = ref(new Array(11).fill(0));
    const totalFlips = ref(0);     // Total individual coin flips (each experiment = 10 flips)
    const totalRounds = ref(0);    // Total experiment rounds
    const history = ref([]);       // Last 10 results

    // Theoretical probabilities for B(10, 0.5)
    // P(X=k) = C(10, k) * (0.5)^10
    const combinations = [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1];
    const theoretical = combinations.map(c => c / 1024);

    const simulateOnce = () => {
        let heads = 0;
        const flips = [];
        for (let i = 0; i < 10; i++) {
            const isHeads = Math.random() > 0.5;
            if (isHeads) heads++;
            flips.push(isHeads);
        }

        const newStats = [...stats.value];
        newStats[heads]++;
        stats.value = newStats;
        totalRounds.value++;
        totalFlips.value += 10;

        history.value = [{ heads, flips, id: Date.now() }, ...history.value].slice(0, 10);

        return { heads, flips };
    };

    const batchSimulate = (count) => {
        const newStats = [...stats.value];
        const recentHistory = [];

        for (let i = 0; i < count; i++) {
            let heads = 0;
            const flips = [];
            for (let j = 0; j < 10; j++) {
                const isHeads = Math.random() > 0.5;
                if (isHeads) heads++;
                flips.push(isHeads);
            }
            newStats[heads]++;

            // Keep a sliding window of the last 10 rounds
            recentHistory.push({ heads, flips, id: Date.now() + i });
            if (recentHistory.length > 10) recentHistory.shift();
        }

        stats.value = newStats;
        totalRounds.value += count;
        totalFlips.value += count * 10;
        // Reverse so newest (last round) is first — history[0] = the very last round
        history.value = recentHistory.reverse();

        // Return the last round's flips (same as history[0].flips)
        return history.value[0].flips;
    };

    const reset = () => {
        stats.value = new Array(11).fill(0);
        totalFlips.value = 0;
        totalRounds.value = 0;
        history.value = [];
    };

    return {
        stats,
        totalFlips,
        totalRounds,
        history,
        theoretical,
        simulateOnce,
        batchSimulate,
        reset
    };
}
