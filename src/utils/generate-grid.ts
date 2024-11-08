import { Grid } from "../types/grid";

export function generateGrid(rows: number, collumns: number): Grid {
    return create2DArray(rows, collumns, {
        value: void 0
    });
}

function create2DArray<T>(rows: number, cols: number, defaultValue: T): T[][] {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ ...defaultValue })));
}