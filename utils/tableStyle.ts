export function rowClassFn({ rowIndex }: { rowIndex: number }) {
    return rowIndex % 2 !== 0 ? 'bg-teal-1' : ''
}