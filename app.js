"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const fp_1 = __importDefault(require("lodash/fp"));
const perf_hooks_1 = require("perf_hooks");
console.log("\nStart");
const TESTS = [
    {
        Input: "(1+(2*3)+((8)/4))+1",
        Output: 3
    },
    {
        Input: "(1)+((2))+(((3)))",
        Output: 3
    },
    {
        Input: "1+(2*3)/(2-1)",
        Output: 1
    },
    {
        Input: "1+((())2*3)/(2-1)",
        Output: 3
    },
    {
        Input: "1",
        Output: 0
    }
];
const LONG_TEST = {
    Input: "1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))",
    Output: 4
};
const obs = new perf_hooks_1.PerformanceObserver((items) => {
    console.log(...items.getEntries().map(i => `${i.name} \t\t ${i.duration}`));
    perf_hooks_1.performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });
repeat(runTest, [LONG_TEST, maxDepthImperative], 4);
repeat(runTest, [LONG_TEST, maxDepthLodash], 4);
repeat(runTest, [LONG_TEST, maxDepthFunctional], 4);
repeat(runTest, [LONG_TEST, maxDepthHybrid], 4);
function repeat(f, args, n) {
    for (let i = 0; i < n; i++) {
        f(...args);
    }
}
function runTest(T, f, n = 100) {
    perf_hooks_1.performance.mark('Start');
    for (let i = 0; i < n; i++) {
        const maxDepth = f(T.Input);
        if (maxDepth !== T.Output) {
            console.log("Wrong output: Got " + maxDepth + " expected " + T.Output);
            return null;
        }
    }
    perf_hooks_1.performance.mark('End');
    perf_hooks_1.performance.measure(`${f.name}, ${n}x: `, 'Start', 'End');
}
function maxDepthFunctional(s) {
    return Math.max(...s
        .split('')
        .filter(c => c === ')' || c === '(')
        .map(c => c === '(' ? 1 : -1)
        .reduce((acc, v) => {
        return acc.concat(v + (acc[acc.length - 1] || 0));
    }, [0]), 0);
}
function maxDepthHybrid(s) {
    let rollingSum = 0;
    return Math.max(...s
        .split('')
        .map(c => c === '(' ? 1 : c === ')' ? -1 : 0)
        .map(v => rollingSum += v));
}
function maxDepthImperative(s) {
    let rollingSum = 0;
    let max = 0;
    for (let c of s) {
        if (c === '(') {
            rollingSum += 1;
            if (rollingSum > max)
                max = rollingSum;
        }
        if (c === ')') {
            rollingSum -= 1;
        }
    }
    return max;
}
function maxDepthLodash(s) {
    return lodash_1.default.flow(fp_1.default.map(c => c === '(' ? 1 : c === ')' ? -1 : 0), fp_1.default.transform((acc, v) => {
        acc.push((lodash_1.default.last(acc) || 0) + v);
    }, []), fp_1.default.max)(s);
}
