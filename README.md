# binary-find
a js small binary search function independent of container

## Features
- Safe gaurded against integer overflow
	- Tested with 2e<sup>32</sup>-1 items (maximum items in JS array)
	- Can work with up to `Number.MAX_SAFE_INTEGER` items
- Any container can be used (using a reader function)
- Any data structure can be used (using a comparator function)
- Support for asyncronous reads (suitable for working with I/O like files, etc.)
- Suitable for binary insertion sort
- Tested (Nodejs 10.x, 12.x, 14.x)

## Install
```
npm i binary-find
```

## Usage

## Test
```
npm run test
```

## Performance
Following is test results from github actions with below setup:
 - Operating System: `Ubuntu  18.04.4  LTS`
 - Nodejs: `v14.7.0`
 - npm: `6.14.7`
```
Checking every item in a list of         100 items: 0ms per item
Checking every item in a list of       1,000 items: 0.004ms per item
Checking every item in a list of      10,000 items: 0.0019ms per item
Checking every item in a list of   1,000,000 items: 0.002144ms per item
Checking every item in a list of  10,000,000 items: 0.0024571ms per item
Checking every item in a list of 100,000,000 items: 0.00281341ms per item
```