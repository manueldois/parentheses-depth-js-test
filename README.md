# JS programming paradigm speed test

## The challenge
Take a string like `(1+(2*3))` and return the maximum parentheses depth. `2` for this example.

## Functional vs imperative programming computing on a string
td;dr : imperative programming is faster by ~100x

JS is a multiparadigm language.
For most applications you are free to choose to code imperative, functional, or class-oriented, without having to consider performance.

What is the actual difference in performance? Depends on the app, but by running tests like this one can get a notion.

Testing on four different ways to solve the challenge, for the same input:

- Imperative: ~2ms
- Functional: ~200ms
- Hybrid: ~10ms
- Functional with lodash: ~50ms

These are execution times for running the test 100x.
Being a run time interpreted language, actual execution times vary dramatically. 
