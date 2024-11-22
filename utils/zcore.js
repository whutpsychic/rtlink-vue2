// 重复使用的龙套逻辑
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
