import { cloneDeep } from 'lodash'
// **************************** 重复使用的龙套逻辑 ****************************
// 生成瑞太框架查表格专用的参数格式数据
export function arrangeObjForTableQuery(obj) {
  const result = []
  for (let key in obj) {
    const {
      group,
      operation = 'EQUAL',
      parentGroup,
      relation = 'AND',
      value,
    } = obj[key]

    result.push({
      property: key,
      group,
      operation,
      parentGroup,
      relation,
      value,
    })
  }
  return result
}

// 向上查找$parent直到发现某一方法名为止，并调用之
export function callParentFn(instance, fnKey, ...args) {
  function looper(_inst, key) {
    const target = _inst.$parent
    if (target.hasOwnProperty(key) && typeof target[key] === 'function') {
      target[key](...args)
    } else {
      looper(target, key)
    }
  }

  looper(instance, fnKey)
}

function _putThemAllIn(resultArr, targetItem, { childStr = 'children' }) {
  resultArr.push(targetItem)
  if (targetItem[childStr] && targetItem[childStr].length) {
    targetItem[childStr].forEach((_item) => {
      _putThemAllIn(resultArr, _item, childStr)
    })
  }
}

// --------------------------------------------------------
// 将树形数据扁平化平铺成一维数组（包含所有属性）
// 输出一个完整的新对象，不改变原对象
// Author:zbc
// Last maintain time: 2023-02-13
// --------------------------------------------------------
export const tilingTreeData = (
  dataArr = [],
  option = { childStr: 'children' }
) => {
  // 深克隆
  let _opDataArr = cloneDeep(dataArr)
  const result = []
  _opDataArr.forEach((item) => {
    _putThemAllIn(result, item, option)
  })

  return result
}
