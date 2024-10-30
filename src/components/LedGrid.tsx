import { CSSProperties, ReactElement, useMemo, useRef } from "react";
import "./LedGrid.css";
import { Grid } from "../types/grid";

interface LedGridParams {
    grid: Grid;
    setGrid: React.Dispatch<React.SetStateAction<Grid>>;
    width: number;
    height: number;
}

function LedGrid({grid, setGrid, height, width}: LedGridParams): ReactElement {
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
                        <div className={classes} style={style}>
                            {value}
                        </div>
                    </div>;
                })}
            </div>;
        })}
    </div>
}
  
export default LedGrid;