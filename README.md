# binary-find
a js small binary search function independent of container

## Features
- Safe gaurded against integer overflow
	- tested with `2e32-1` items (maximum items in JS)
	- can work with `Number.MAX_SAFE_INTEGER` items
- Any container can be used (using reader function)
- Any data structure can be used (using a comparator function)
- Support for asyncronous (suitable for working I/O)
- Tested

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
```
Checking every item in a list of 100 items:             0ms per item
Checking every item in a list of 1,000 items:           0.004ms per item
Checking every item in a list of 10,000 items:          0.0019ms per item
Checking every item in a list of 1,000,000 items:       0.001622ms per item
Checking every item in a list of 10,000,000 items:      0.0018433ms per item
Checking every item in a list of 100,000,000 items:     0.00223317ms per item
```