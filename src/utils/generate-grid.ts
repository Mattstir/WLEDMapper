import { Grid } from "../types/grid";

export function generateGrid(rows: number, collumns: number): Grid {
    return fill2DArray(rows, collumns, {
        value: void 0
    });
}

function fill2DArray<T>(rows: number, cols: number, value: T): T[][] {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => value));
}