export function rowClassFn(row: { index: number }) {
    return row.index % 2 === 0 ? '' : 'bg-teal-1'
}