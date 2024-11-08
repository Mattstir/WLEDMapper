import { ChangeEvent, CSSProperties, EventHandler, MouseEvent, ReactElement, useMemo, useRef } from "react";
import "./LedGrid.css";
import { Grid } from "../types/grid";

interface LedGridParams {
    grid: Grid;
    setGrid: React.Dispatch<React.SetStateAction<Grid>>;
    ledNumToSet: number;
    setLedNumToSet: (newVal: number) => void;
    width: number;
    height: number;
}

function LedGrid({grid, setGrid, height, width, ledNumToSet, setLedNumToSet}: LedGridParams): ReactElement {
    const ledWidthAndHeight = useMemo(() => {
        if(!width || !height) {
            return [1, 1];
        }
        const rowCount = grid.length;
        const columnCount = grid[0]?.length || 0;

        return [
            Math.floor(width / columnCount / 2),
            Math.floor(height /  rowCount / 2)
        ];
    }, [height, width, grid]);

    const clickedOnLED: (rowIndex: number, columnIndex: number) => EventHandler<MouseEvent<HTMLDivElement>> = (rowIndex: number, columnIndex: number) => {
        return (e: MouseEvent<HTMLDivElement>) => {
            const oldValue = grid[rowIndex][columnIndex].value;
            // 1. check if somewherelse in the matrix the led NUM is already set and delete it
            const cleanedGrid = removeLedNumFromGrid([...grid], ledNumToSet);
            // 2. set the ledNum to the grid and set the grid
            // if the value is the same num as already set remove it
            cleanedGrid[rowIndex][columnIndex].value = oldValue === ledNumToSet ? void 0 : ledNumToSet;
            setGrid(cleanedGrid);
            // 3. increment the LEDcount to set
            setLedNumToSet(ledNumToSet + 1);
        };
    };
    

    return <div className="rowParent">
        {grid && grid.map((row, rowIndex) => {
            return <div className="columParent" key={"r" + rowIndex}>
                {row.map((gridPoint, columnIndex) => {
                    const isLED = gridPoint.value !== void 0;
                    const value = isLED ? gridPoint.value : "";
                    const classes = isLED ? "baseGridPoint ledGridPoint" : "baseGridPoint"
                    const smallerLength = Math.min(ledWidthAndHeight[0], ledWidthAndHeight[1]);
                    const style: CSSProperties = {
                        width: ledWidthAndHeight[0],
                        height: ledWidthAndHeight[1],
                        border: `${smallerLength / 10}px solid rgba(255, 255, 255, .6)`,
                        borderRadius: `${smallerLength / 10}px`,
                        fontSize: `${ledWidthAndHeight[1] / 2}px`
                    };
                    return <div className="gridPointCentering"key={"r" + rowIndex + "c" + columnIndex}>
                        <div 
                            className={classes} 
                            style={style}
                            onClick={clickedOnLED(rowIndex, columnIndex)}>
                            {value}
                        </div>
                    </div>;
                })}
            </div>;
        })}
    </div>
}
  
export default LedGrid;

function removeLedNumFromGrid(grid: Grid, numToRemove: number): Grid {
    return grid.map((row) => {
        return row.map((point) => {
            // clear the num from the Grid
            if (point.value === numToRemove) {
                return {
                    value: void 0
                }
            } else {
                return point;
            }
        });
    });
}