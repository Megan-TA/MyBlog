// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。


function lengthOfLongestSubstring(s) {
  let l = 0; // 定义左指针
	let res = 0; // 结果
	let map = new Map(); // 存放字符和对应下标
	for (let r = 0; r < s.length; r++) {
    const target = s[r]
		// 如果出现了重复字符，则把左指针移到重复字符的下一位。注意同时满足重复字符的索引大于左指针。
		if (
      map.has(target) && 
      map.get(target) >= l
    ) {
			l = map.get(target) + 1;
		}
		res = Math.max(res, r - l + 1); // 计算结果
		map.set(target, r); // 存下每个字符的下标
	}
	return res;
} 


const a = lengthOfLongestSubstring('abcabcbb')

console.log(a)

const b = lengthOfLongestSubstring('bbbbb')

console.log(b)