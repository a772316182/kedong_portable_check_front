export function rowClassFn(_row: any, index: number): string {
    return index % 2 === 1 ? 'bg-teal-1' : ''
}