// 生成等差数列
// start: 数组第一项
// num: 数列长度
// spliter: 邻项差值
export function genNumArray(start = 0, num = 100, spliter = 1) {
  const result = []
  for (let i = 0; i < num; i++) {
    result.push(start + spliter * i)
  }
  return result
}

// 生成一个随机数
// min: 最小值
// max: 最大值
// fix: 小数点后几位
export function genRandomNumber(min = 0, max = 100, fix = 0) {
  let num = (min + (max - min) * Math.random()).toFixed(fix)
  if (fix > 0) {
    num = parseFloat(num)
  } else {
    num = parseInt(num)
  }
  return num
}

// 生成随机数组
// min: 最小值
// max: 最大值
// length: 数组长度
// fix: 小数点后几位
export function genRandomNumArr(min = 0, max = 100, length = 10, fix = 0) {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(genRandomNumber(min, max, fix))
  }
  return result
}
