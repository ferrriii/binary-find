const binarySearch = require('./index.js')

function check(expr, test) {
  if (expr) {
    console.log('\x1b[32m%s\x1b[0m', 'Passed:', test)
  } else {
    console.log('\x1b[31m%s\x1b[0m', 'Failed:', test)
    process.exit(1);
  }
}

async function testSearch(count) {
  var list = [...Array(count).keys()]
  var comparator = (a, b) => a - b
  var reader = index => list[index]

  for (let i = 0; i < count; i++) {
    let foundIndex = await binarySearch(0, list.length - 1, i, reader, comparator);
    check(foundIndex === i, `Found ${i} in ${count} items`)
  }

  let foundIndex
  foundIndex = await binarySearch(0, list.length - 1, -1, reader, comparator);
  check(foundIndex === null, `null returned for item (-1) lesser than any item in the list`)
  foundIndex = await binarySearch(0, list.length - 1, -10, reader, comparator);
  check(foundIndex === null, `null returned for item (-10) lesser than any item in the list`)
  foundIndex = await binarySearch(0, list.length - 1, count, reader, comparator);
  check(foundIndex < 0 && Math.abs(foundIndex) === count, `negative and at the end index returned for item ${count} greated than any item in the list`)
  foundIndex = await binarySearch(0, list.length - 1, count + 1, reader, comparator);
  check(foundIndex < 0 && Math.abs(foundIndex) === count, `negative and at the end index returned for item ${count + 1} greated than any item in the list`)
}

async function testMissingSearch(count, mod) {
  var list = []
  var comparator = (a, b) => a - b
  var reader = index => list[index]
  for (let i = 0; i < count; i++) {
    if (i % mod === 0) {
      list.push(i)
    } else {
      list.push(i + 0.5)
    }
  }

  for (let i = 0; i < count; i++) {
    let foundIndex = await binarySearch(0, list.length - 1, i, reader, comparator);
    check(foundIndex === (i % mod === 0 ? list.indexOf(i) : (-1 * i)), `Found ${i} in ${count} items`)
  }

  let foundIndex
  foundIndex = await binarySearch(0, list.length - 1, -1, reader, comparator);
  check(foundIndex === null, `null returned for item (-1) lesser than any item in the list`)
  foundIndex = await binarySearch(0, list.length - 1, -10, reader, comparator);
  check(foundIndex === null, `null returned for item (-10) lesser than any item in the list`)
  foundIndex = await binarySearch(0, list.length - 1, count, reader, comparator);
  check(foundIndex < 0 && Math.abs(foundIndex) === count, `negative and at the end index returned for item ${count} greated than any item in the list`)
  foundIndex = await binarySearch(0, list.length - 1, count + 1, reader, comparator);
  check(foundIndex < 0 && Math.abs(foundIndex) === count, `negative and at the end index returned for item ${count + 1} greated than any item in the list`)
}

async function limitedRangeSearch(start, end) {
  var list = [0, 1, 2, 4, 5, 6, 7, 8, 9, 11]
  var comparator = (a, b) => a - b
  var reader = index => list[index]

  let foundIndex
  foundIndex = await binarySearch(start, end, list[end], reader, comparator);
  check(foundIndex === list.indexOf(list[end]), `Found ${list[end]} at ${list.indexOf(end)} in range(${start},${end}) in ${list.length} items`)

  foundIndex = await binarySearch(start, end, list[start], reader, comparator);
  check(foundIndex === list.indexOf(list[start]), `Found ${list[start]} at ${list.indexOf(start)} in range(${start},${end}) in ${list.length} items: ${foundIndex}`)

  foundIndex = await binarySearch(start, end, list[end + 1] || 100, reader, comparator);
  check(foundIndex === -1 * (end + 1), `Found ${list[end + 1] || 100} in range(${start},${end}) in ${list.length} items`)

  foundIndex = await binarySearch(start, end, start - 1, reader, comparator);
  check(foundIndex === null, `Found ${start - 1} in range(${start},${end}) in ${list.length} items`)

  if (3 >= start && 3 <= end) {
    foundIndex = await binarySearch(start, end, 3, reader, comparator);
    check(foundIndex === -3, `Found 3 in range(${start},${end}) in ${list.length} items`)
  }

  if (9 >= start && 9 <= end) {
    foundIndex = await binarySearch(start, end, 10, reader, comparator);
    check(foundIndex === -9, `Found 10 in range(${start},${end}) in ${list.length} items`)
  }
}

function insert(list, value, foundIndex) {
  // insert value in the list based on foundIndex which is result of binarySearch()
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

async function testBinaryInsertionSort() {
  list = []
  var comparator = (a, b) => a - b
  var reader = index => list[index]

  for (let i = 0; i < 200; i++) {
    let val
    // find unique random value
    do {
      val = Math.floor(Math.random() * 1000)
    } while (list.indexOf(val) >= 0)

    let p = await binarySearch(0, list.length - 1, val, reader, comparator);
    insert(list, val, p)
  }

  for (i = 0; i < list.length - 1; i++) {
    if (list[i] > list[i + 1]) return check(false, `Wrong binary insertion sort: ${i}:${list[i]} > ${i + 1}:${list[i + 1]}`)
  }

  check(true, 'Binary insertion sort')
}

async function testMaxIntegerBoundary() {
  let count = 10
  // maximum array length = https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Invalid_array_length
  const N = Math.pow(2, 32) - 1
  list = Array(N)
  for (i = 1; i <= count; i++) {
    list[list.length - i] = count - i
  }
  var comparator = (a, b) => a - b
  var reader = index => list[index]

  for (let i = list.length - count; i < list.length; i++) {
    let foundIndex = await binarySearch(list.length - count, list.length - 1, list[i], reader, comparator);
    check(foundIndex === i, `Found at index ${i} in ${N} items`)
  }
}

async function testString() {
  var list = ['a', 'ab', 'abc', 'abcd', 'b']
  var comparator = (a, b) => a.localeCompare(b)
  var reader = index => list[index]

  for (let i = 0; i < list.length; i++) {
    let foundIndex = await binarySearch(0, list.length - 1, list[i], reader, comparator);
    check(foundIndex === i, `Found '${list[i]}' in ${list.length} strings`)
  }

  let foundIndex
  foundIndex = await binarySearch(0, list.length - 1, 'abcde', reader, comparator);
  check(foundIndex === -4, `Found missing abcde`)

  foundIndex = await binarySearch(0, list.length - 1, '1', reader, comparator);
  check(foundIndex === null, `Found missing '1'`)

  foundIndex = await binarySearch(0, list.length - 1, 'c', reader, comparator);
  check(foundIndex === -5, `Found missing 'c'`)
}

async function searchTime(count) {
  const list = [...Array(count).keys()]
  const comparator = (a, b) => a - b
  const reader = index => list[index]
  const end = list.length - 1
  let startTime = Date.now()
  for (let i = 0; i < count; i++) {
    await binarySearch(0, end, i, reader, comparator);
  }
  let endTime = Date.now()
  return (endTime - startTime) / count
}

async function testPerformance() {
  console.log(`Checking every item in a list of         100 items: ${await searchTime(100)}ms per item`)
  console.log(`Checking every item in a list of       1,000 items: ${await searchTime(1000)}ms per item`)
  console.log(`Checking every item in a list of      10,000 items: ${await searchTime(10000)}ms per item`)
  console.log(`Checking every item in a list of   1,000,000 items: ${await searchTime(1000000)}ms per item`)
  console.log(`Checking every item in a list of  10,000,000 items: ${await searchTime(10000000)}ms per item`)
  console.log(`Checking every item in a list of 100,000,000 items: ${await searchTime(100000000)}ms per item`)
}

async function test() {
  console.log('Testing random item count from 1-99')
  await testSearch((Math.random() * 100 >>> 1) + 1)
  console.log('Testing 1000 items')
  await testSearch(1000)
  console.log('Testing limited range search')
  await limitedRangeSearch(0, 5)
  await limitedRangeSearch(1, 5)
  await limitedRangeSearch(5, 9)
  console.log('Testing missing items')
  await testMissingSearch(100, 2)
  await testMissingSearch(16, 3)
  console.log('Test binary insertion sort')
  await testBinaryInsertionSort()
  console.log('Testing with maximum array length')
  await testMaxIntegerBoundary()
  console.log('Testing string list')
  await testString()
  console.log('Testing performance')
  await testPerformance()
}

test()