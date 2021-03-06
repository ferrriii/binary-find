# binary-find
<img alt="downloads" src="https://img.shields.io/npm/dt/binary-find?style=flat-square"> <img alt="version" src="https://img.shields.io/npm/v/binary-find?style=flat-square"> <img alt="issues" src="https://img.shields.io/github/issues/ferrriii/binary-find?style=flat-square"> <img alt="package size" src="https://img.shields.io/bundlephobia/minzip/binary-find?style=flat-square"> <img alt="forks" src="https://img.shields.io/github/forks/ferrriii/binary-find?style=flat-square"> <img alt="stars" src="https://img.shields.io/github/stars/ferrriii/binary-find?style=flat-square"> <img alt="license" src="https://img.shields.io/github/license/ferrriii/binary-find?style=flat-square"> <img alt="programming language" src="https://img.shields.io/github/languages/top/ferrriii/binary-find?style=flat-square"> <img alt="test status" src="https://img.shields.io/github/workflow/status/ferrriii/binary-find/test?label=test&style=flat-square">

a small binary search function independent of container in js 

## Features
- Safe guarded against integer overflow
	- Tested with 2<sup>32</sup>-1 items (maximum items in JS array)
	- Can work with up to `Number.MAX_SAFE_INTEGER` items
- Any container can be used (using a reader function)
- Any data structure can be used (using a comparator function)
- Support for asyncronous reads (suitable for working with I/O like files, network resources, etc.)
- Can be used for binary insertion sort
- Tested (Nodejs 10.x, 12.x, 14.x)

## Install
```
npm i binary-find
```

## Usage
`binaryFind(start, end, valueToFind, readFunction, compareFunction)`
- `start` *integer* Start index of your list for search (inclusive)
- `end` *integer* End index of your list for search (inclusive)
- `valueToFind` *any* Value to look for in your list
- `readFunction` *Function* to read from your sorted list. Below argument is passed when called
	- `index` *integer* Index of item to be read (starting from 0)
	- This function should return the item at `index`
	- This function can be `async`
- `compareFunction` *Function* to compare your list items. Below arguments are passed when called.
	- `firstEl` *any* First value to compare. This value has been read using `readFunction`
	- `secondEl` *any* Second value to compare. This value has been read using `readFunction`
	- This function should return one of below values:
		- `-1 or less` If `firstEl` is less than `secondEl`
		- `0` If `firstEl` and `secondEl` are equal
		- `1 or higher` If `firstEl` is greater than `secondEl`
	- **Note:** This function is same as function used for sorting your list
- `binaryFind()` returns *Promise* to be resolved with below values
	- `0 or any positive integer` If the `valueToFind` is found, the return value would be index of it in the list
	- `negative integer` If the `valueToFind` is not found, the `Math.abs(return value)` indicates the position in the list that the value should be inserted (offset starting at 0)
	- `null` If the `valueToFind` was not found and it should be inserted at index `0` in the list

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

### Binary Insert Sort
```javascript
const binaryFind = require('binary-find')

function insert(list, value, foundIndex) {
  // insert value in the list based on foundIndex which is result of binaryFind()
  // insert as first element
  if (foundIndex === null) return list.splice(0, 0, value)
  // item already exist, ignore
  if (foundIndex >= 0) return
  let absIndex = Math.abs(foundIndex)
  // item is greater than any item in the list, add to end
  if (absIndex > list.length - 1) return list.push(value)
  // item should be inserted at |foundIndex|
  list.splice(absIndex, 0, value)
}

async function binaryInsertionSort() {
  // add random numbers to the list in the sorted index
  list = []
  var comparator = (a, b) => a - b
  var reader = index => list[index]

  for (let i = 0; i < 10; i++) {
    let val
    // find unique random value
    do {
      val = Math.floor(Math.random() * 100)
    } while (list.indexOf(val) >= 0)

    let p = await binaryFind(0, list.length - 1, val, reader, comparator);
    insert(list, val, p)
  }

  console.log(list)
  // output:
  /*
  [
    30, 43, 48, 64, 65,
    69, 79, 86, 92, 93
  ]
  */
}

binaryInsertionSort()
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
Checking every item in a list of         100 items: 0.01ms per item
Checking every item in a list of       1,000 items: 0.005ms per item
Checking every item in a list of      10,000 items: 0.002ms per item
Checking every item in a list of   1,000,000 items: 0.001905ms per item
Checking every item in a list of  10,000,000 items: 0.0022008ms per item
Checking every item in a list of 100,000,000 items: 0.00246802ms per item
```
