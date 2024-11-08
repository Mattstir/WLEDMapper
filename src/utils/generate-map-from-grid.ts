import { Grid, GridPoint } from "../types/grid";

export function generateMapFromGrid(grid: Grid): string {
    const mapArray = grid
        .map((row) => row.map(toMapValue))
        .flat()
    
    return JSON.stringify({
        map: mapArray
    });
}

function toMapValue(point: GridPoint): number {
    return point.value || -1;
}
