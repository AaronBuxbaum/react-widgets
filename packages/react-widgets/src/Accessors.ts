import { useMemo } from 'react'
import { DataItem, Value } from './types'

export type Accessors = ReturnType<typeof useAccessors>

export type DataKeyAccessorFn = (item: DataItem) => DataItem

export type DataKeyAccessor = string | DataKeyAccessorFn

export type TextAccessorFn = (item: DataItem) => string

export type TextAccessor = string | TextAccessorFn

export const dataValue = (
  dataItem: DataItem,
  field?: DataKeyAccessor,
): unknown => {
  if (typeof field === 'function') return field(dataItem)
  if (dataItem == null) return dataItem
  if (
    typeof field === 'string' &&
    typeof dataItem === 'object' &&
    field in dataItem!
  )
    return (dataItem as any)![field]

  return dataItem
}

export const dataText = (
  dataItem: DataItem,
  textField?: TextAccessor,
): string => {
  const value = dataValue(dataItem, textField)
  return value == null ? '' : String(value)
}

/**
 * I don't know that the shallow equal makes sense here but am too afraid to
 * remove it.
 */
export function valueMatcher(
  a: DataItem,
  b: DataItem,
  dataKey?: DataKeyAccessor,
) {
  return dataValue(a, dataKey) === dataValue(b, dataKey)
}

export function dataIndexOf(
  data: readonly DataItem[],
  value: Value,
  dataKey?: DataKeyAccessor,
) {
  const valueDataKey = dataValue(value, dataKey)
  let idx = -1

  while (++idx < data.length) {
    const datum = data[idx]
    if (datum === value || dataValue(datum, dataKey) === valueDataKey)
      return idx
  }

  return -1
}

export function dataItem<TDataItem = DataItem>(
  data: readonly TDataItem[],
  value: Value,
  dataKey?: DataKeyAccessor,
): TDataItem {
  const idx = dataIndexOf(data, value, dataKey)
  // This isn't strictly safe, but we want to allow items that aren't in the list
  return idx !== -1 ? data[idx] : (value as TDataItem)
}

export const useAccessors = (
  textField?: TextAccessor,
  dataKey?: DataKeyAccessor,
) => {
  return useMemo(
    () => ({
      text: (item: DataItem) => dataText(item, textField),
      value: (item: DataItem) => dataValue(item, dataKey),
      indexOf: (data: readonly DataItem[], value: Value) =>
        dataIndexOf(data, value, dataKey),
      matches: (a: DataItem, b: DataItem) => valueMatcher(a, b, dataKey),
      findOrSelf: <TDataItem>(data: readonly TDataItem[], value: Value) =>
        dataItem(data, value, dataKey),
      includes: (data: readonly DataItem[], value: Value) =>
        dataIndexOf(data, value, dataKey) !== -1,
    }),
    [textField, dataKey],
  )
}
