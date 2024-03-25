// 两个有序数组合并成一个有序数组


function merge(a, b) {
  let m = a.length
  let n = b.length 

  while(n > 0) {
    if (a[m - 1] > b[n - 1]) {
      a[n + m - 1] = a[m - 1]
      m--
    } else {
      a[n + m - 1] = b[n - 1]
      n--
    }
  }
  return a
}


const result = merge(
  [4,5,6],
  [3,7]
)

console.log(result)