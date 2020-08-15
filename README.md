# binary-find
<img alt="downloads" src="https://img.shields.io/npm/dt/binary-find?style=flat-square"> <img alt="version" src="https://img.shields.io/npm/v/binary-find?style=flat-square"> <img alt="issues" src="https://img.shields.io/github/issues/ferrriii/binary-find?style=flat-square"> <img alt="package size" src="https://img.shields.io/bundlephobia/minzip/binary-find?style=flat-square"> <img alt="forks" src="https://img.shields.io/github/forks/ferrriii/binary-find?style=flat-square"> <img alt="stars" src="https://img.shields.io/github/stars/ferrriii/binary-find?style=flat-square"> <img alt="license" src="https://img.shields.io/github/license/ferrriii/binary-find?style=flat-square"> <img alt="programming language" src="https://img.shields.io/github/languages/top/ferrriii/binary-find?style=flat-square"> <img alt="test status" src="https://img.shields.io/github/workflow/status/ferrriii/binary-find/test?label=test">

a small binary search function independent of container in js 

## Features
- Safe guarded against integer overflow
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
`binaryFind(start, end, valueToFind, readFunction, compareFunction)`
- `start` *integer* Start index for search (inclusive)
- `end` *integer* End index for search (inclusive)
- `valueToFind` *any* Value to look for
- `readFunction` *Function* Function to read from your sorted list. Below argument is passed when called
	- `index` *integer* Index of item to be read (starting from 0)
	- This function should return the item at `index`
- `compareFunction` *Function* Function to compare your list items. Below arguments are passed when called.
	- `firstEl` *any* First value to compare. This value has been read using `readFunction`
	- `secondEl` *any* Second value to compare. This value has been read using `readFunction`
	- This function should return one of below values:
		- `-1 or less` If `firstEl` is less than `secondEl`
		- `0` If `firstEl` is same as `secondEl`
		- `1 or higher` If `firstEl` is greater than `secondEl`
	- **Note:** This function is same as function used for sorting your list

### Simple Usage
```javascript
const binaryFind = require('binary-find')

async function find() {
  // list of sorted items
  const list = [0,1,2,3,4,5]
  // function for comparing list items (same as what you use for sorting)
  const comparator = (a, b) => a - b
  // function for reading list item at index
  const reader = index => list[index]

  let foundIndex

  foundIndex = await binaryFind(0, list.length-1, 3, reader, comparator);
  console.log(foundIndex) // output: 3

  foundIndex = await binaryFind(0, list.length-1, 0, reader, comparator);
  console.log(foundIndex) // output: 0

  foundIndex = await binaryFind(0, list.length-1, 3.5, reader, comparator);
  console.log(foundIndex) // output: -4

  foundIndex = await binaryFind(0, list.length-1, 100, reader, comparator);
  console.log(foundIndex) // output: -6

  foundIndex = await binaryFind(0, list.length-1, 0.5, reader, comparator);
  console.log(foundIndex) // output: -1

  foundIndex = await binaryFind(0, list.length-1, -1, reader, comparator);
  console.log(foundIndex) // output: null
}

find()
```

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
