import { ReactElement, useEffect, useRef, useState } from "react";
import { IMAGE_STATE } from "../types/imageState";
import "./LedMapper.css";
import { Grid } from "../types/grid";
import LedGrid from "./LedGrid";
import NumberInput from "./NumberInput";
import { avoidImageDragging } from "../utils/avoid-image-drag";
import { generateGrid } from "../utils/generate-grid";

interface LedMapperParams {
    image: string | IMAGE_STATE;
    setImage: React.Dispatch<React.SetStateAction<string | IMAGE_STATE>>;
}

const START_ROWS = 5;
const START_COLLUMNS = 5;
const START_REAL_COUNT = 10;

function LedMapper({image, setImage}: LedMapperParams): ReactElement {
    const [realLedCount, setRealLedCount] = useState(START_REAL_COUNT);
    const [rows, setRows] = useState(START_ROWS);
    const [collumns, setCollumns] = useState(START_COLLUMNS);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    // rows and collumns
    const [gridData, setGridData] = useState<Grid>(generateGrid(START_ROWS, START_COLLUMNS))

    const imageSizeEquivalentRef = useRef<HTMLDivElement>(null);
    const backgroundImageRef = useRef<HTMLImageElement>(null);
    const mapperFieldRef = useRef<HTMLDivElement>(null);

    const guardedSetRows = (newVal: number) => {
        setGridData(generateGrid(newVal, collumns));
        setRows(newVal);
    };  
    
    const guardedSetCollumns = (newVal: number) => {
        setGridData(generateGrid(rows, newVal));
        setCollumns(newVal);
    };

    // recalc imageSizeEquivalent size
    useEffect(() => {
        if (!mapperFieldRef.current) {
            return;
        }
        if (!imageSizeEquivalentRef.current || !backgroundImageRef.current || image === IMAGE_STATE.DONT_USE) {
            // get width and height from the mapperField instead
            const mapperWidth = mapperFieldRef.current.clientWidth;
            const mapperHeight = mapperFieldRef.current.clientHeight;
            console.log("mapper", mapperWidth, mapperHeight);
            setDimensions({
                width: mapperWidth,
                height: mapperHeight
            });
            return;
        }
        const [imageWith, imageHeight] = getContainedSize(backgroundImageRef.current);

        imageSizeEquivalentRef.current.style.width = imageWith + "px";
        imageSizeEquivalentRef.current.style.height = imageHeight + "px";

        console.log("backgroundImageRef", imageWith, imageHeight);
        setDimensions({
            width: imageWith,
            height: imageHeight
        });
    }, [image]);

    const gridHasMarkedLeds = gridData.some((row) => row.some(elem => elem.value !== void 0));
    const rowsORCallWarning = gridHasMarkedLeds ? "Caution: Changing size wipes the LED grid!" : "";

    return <div className="mapperParent">
        <div className="toolbarparent">
            <div className="toolbarGuidePlaceholder"/>
            <div className="toolbar">
                <NumberInput 
                    labelName="Number of real LEDs:"
                    stateValue={realLedCount}
                    setStateValue={setRealLedCount}
                    guide="Step 2: Set the amount of LEDs your build has"
                />
                <NumberInput 
                    labelName="Rows:"
                    stateValue={rows}
                    setStateValue={guardedSetRows}
                    guide="Step 3: Scale the matrix so you can match LEDS nicely"
                    warning={rowsORCallWarning}
                />
                <NumberInput 
                    labelName="Collumns:"
                    stateValue={collumns}
                    setStateValue={guardedSetCollumns}
                    guide=""
                    warning={rowsORCallWarning}
                />
            </div>
        </div>
        <div 
            className="mapperField"
            ref={mapperFieldRef}
        >
            <div ref={imageSizeEquivalentRef} id="imageSizeEquivalent">
                <LedGrid
                    grid={gridData} 
                    setGrid={setGridData}
                    width={dimensions.width}
                    height={dimensions.height}
                />
            </div>
            {
                image !== IMAGE_STATE.DONT_USE && <img 
                    ref={backgroundImageRef} 
                    className="backgroundImage" 
                    src={image}
                    alt=""
                    onDragStart={avoidImageDragging}
                />
            }
        </div>
    </div>;
}
  
export default LedMapper;

function getContainedSize(img: HTMLImageElement): [number, number] {
    const ratio = img.naturalWidth/img.naturalHeight
    let width = img.height*ratio
    let height = img.height
    if (width > img.width) {
        width = img.width
        height = img.width/ratio
    }
    return [width, height]
}