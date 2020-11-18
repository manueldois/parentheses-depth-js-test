import _ from 'lodash'
import __ from 'lodash/fp'
import { PerformanceObserver, performance } from 'perf_hooks'

console.log("\nStart")

interface Test {
    Input: string,
    Output: number
}

const TESTS: Test[] = [
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
]

const LONG_TEST: Test = {
    Input: "1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))1+((())2*3)/(2-1)1+(2*3)/(2-1)(1)+((2))+(((3)))(1+(2*3)+((8)/4))+1((((0))))",
    Output: 4
}

const obs = new PerformanceObserver((items) => {
    console.log(...items.getEntries().map(i => `${i.name} \t\t ${i.duration}`));
    performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });




repeat(runTest, [LONG_TEST, maxDepthImperative], 4)
repeat(runTest, [LONG_TEST, maxDepthLodash], 4)
repeat(runTest, [LONG_TEST, maxDepthFunctional], 4)
repeat(runTest, [LONG_TEST, maxDepthHybrid], 4)



function repeat(f: (...a: any) => any, args: any[], n: number) {
    for (let i = 0; i < n; i++) {
        f(...args)
    }
}

function runTest(T: Test, f: (s: string) => number, n = 100) {
    performance.mark('Start')
    for (let i = 0; i < n; i++) {
        const maxDepth = f(T.Input)
        if (maxDepth !== T.Output) {
            console.log("Wrong output: Got " + maxDepth + " expected " + T.Output)
            return null
        }
    }
    performance.mark('End')
    performance.measure(`${f.name}, ${n}x: `, 'Start', 'End')
}



function maxDepthFunctional(s: string) {
    return Math.max(...
        s
            .split('')
            .filter(c => c === ')' || c === '(')
            .map(c => c === '(' ? 1 : -1)
            .reduce((acc, v) => {
                return acc.concat(v + (acc[acc.length - 1] || 0))
            }, [0]) as any, 0
    )
}

function maxDepthHybrid(s: string) {
    let rollingSum = 0

    return Math.max(
        ...
        s
            .split('')
            .map(c => c === '(' ? 1 : c === ')' ? -1 : 0)
            .map(v => rollingSum += v)
    )
}

function maxDepthImperative(s: string) {
    let rollingSum = 0
    let max = 0

    for (let c of s) {

        if (c === '(') {
            rollingSum += 1;
            if (rollingSum > max) max = rollingSum
        }

        if (c === ')') {
            rollingSum -= 1;
        }

    }

    return max
}

function maxDepthLodash(s: string) {
    return _.flow(
        __.map(c => c === '(' ? 1 : c === ')' ? -1 : 0),
        __.transform((acc: number[], v) => {
            acc.push((_.last(acc) || 0) + v)
        }, []),
        __.max
    )(s)
}
