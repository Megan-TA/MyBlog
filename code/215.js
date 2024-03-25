// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
// 堆排序处理第K大元素（复杂度nlogn）
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
function findKthLargest(nums, k) {
  let len = nums.length

  function buildMaxHeap() {
    for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
      maxHeapify(i)
    }
  }

  function maxHeapify(i) {
    const left = 2 * i + 1
    const right = 2 * i + 2

    let largest = i

    if (
      left < len &&
      nums[left] > nums[largest]
    ) {
      largest = left
    }

    if (
      right < len &&
      nums[right] > nums[largest]
    ) {
      largest = right
    }

    // 2. 当前节点最大元素与当前元素交换
    if (largest !== i) {
      swap(i, largest)
      // 3. 对当前节点的堆顶元素执行 max_heapify 过程
      maxHeapify(largest)
    }
  }

  function swap(i, j) {
    const tmp = nums[i]
    nums[i] =nums[j]
    nums[j] = tmp
  }
  
  // 1. 构建最大堆
  buildMaxHeap()
  // 4. 循环
  for (let i = nums.length - 1; i >= nums.length - k + 1; i--) {
    // 5. 堆顶最大元素和末尾元素交换位置
    swap(0, i)
    // 6. 去掉末尾元素
    --len
    // 7. 执行一次max heapify过程
    maxHeapify(0)
  }

  return nums[0]

};  




const target = findKthLargest([
  6,3,1, 7, 4, 5, 8, 9
], 3)

console.log(target)