// 瑞太zbc常用函数库(便携免安装版)
// Created in 2025-01-02
// Last modified: 2025-01-02
// ===========================================
// 将一个数据按照索引从数组中剔除（不改变原数组）
// 浅操作
export function deleteItemByIndex(arr = [], index = 1) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) {
      result.push(arr[i]);
    }
  }
  return result;
}
