async function binarySearch(startOffest, endOffset, value, readFunc, compareFunc) {
  const initialStartOffset = startOffest
  if (endOffset < startOffest) return null
  const initialEndOffset = endOffset
  while (startOffest !== endOffset) {	
    // reference: https://ai.googleblog.com/2006/06/extra-extra-read-all-about-it-nearly.html
    var mid = startOffest + Math.ceil((endOffset-startOffest)/2) // (startOffest+endOffset) >>> 1 // Math.ceil((startOffest+endOffset)/2)
	//mid++
 	const valueAtOffset = await readFunc(mid)
	let cmp = compareFunc(valueAtOffset, value)
    if (cmp > 0) {
      endOffset = mid - 1
    } else if (cmp < 0) {
      startOffest = mid
    } else {
	  return mid
	}
  }
  if (startOffest === initialStartOffset) {
   	const valueAtOffset = await readFunc(startOffest)
    const cmp = compareFunc(valueAtOffset, value)
    if (cmp === 0)
		return startOffest
	else if (cmp < 0)
		return -1
	else
      return null
  }
  return (startOffest+1)* -1
}

    module.exports = binarySearch
// export default binarySearch