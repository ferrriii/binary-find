async function binarySearch(startOffset, endOffset, value, readFunc, compareFunc) {
  // https://en.wikipedia.org/wiki/Binary_search_algorithm
  const initialStartOffset = startOffset
  if (endOffset < startOffset) return null
  const initialEndOffset = endOffset
  while (startOffset !== endOffset) {
    // reference: https://ai.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html
    var mid = startOffset + Math.ceil((endOffset - startOffset) / 2)
    const valueAtOffset = await readFunc(mid)
    let cmp = compareFunc(valueAtOffset, value)
    if (cmp > 0) {
      endOffset = mid - 1
    } else if (cmp < 0) {
      startOffset = mid
    } else {
      return mid
    }
  }

  // handle the exception
  if (startOffset === initialStartOffset) {
    const valueAtOffset = await readFunc(startOffset)
    const cmp = compareFunc(valueAtOffset, value)
    if (cmp === 0) {
      // search matched the first item
      return startOffset
    }
    else if (cmp < 0) {
      // item is greater that first item
      // item doesn't exist but be inserted after the first item
      return -1
    }
    else {
      // item is less than first item
      return null
    }
  }

  // couldn't find the item
  // return the index where it should be inserted
  return (startOffset + 1) * -1
}

module.exports = binarySearch
// export default binarySearch