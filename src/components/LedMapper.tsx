import { EventHandler, ReactElement, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IMAGE_STATE } from "../types/imageState";
import "./LedMapper.css";
import { Grid } from "../types/grid";
import LedGrid from "./LedGrid";
import NumberInput from "./NumberInput";
import { avoidImageDragging } from "../utils/avoid-image-drag";
import { generateGrid } from "../utils/generate-grid";
import VerticalDivider from "./VerticalDivider";
import copySVG from "../svg/copy.svg";
import saveFileSVG from "../svg/save-file.svg";
import { generateMapFromGrid } from "../utils/generate-map-from-grid";
import { copyToClipboard } from "../utils/copyToClipboard";
import { downloadFile } from "../utils/download-file";
import { EmptyLEDStyle } from "../types/empty-led-style";
import { detectLedStyleToUse } from "../utils/detect-led-style-to-use";

interface LedMapperParams {
    image: string | IMAGE_STATE;
    setImage: React.Dispatch<React.SetStateAction<string | IMAGE_STATE>>;
}

const START_ROWS = 5;
const START_COLLUMNS = 5;
const START_REAL_COUNT = 10;

function LedMapper({image, setImage}: LedMapperParams): ReactElement {
    const [realLedCount, setRealLedCount] = useState(START_REAL_COUNT);
    const realLedCountReduced = realLedCount - 1;
    const [rows, setRows] = useState(START_ROWS);
    const [collumns, setCollumns] = useState(START_COLLUMNS);
    const [ledNumToSet, setLedNumToSet] = useState(0);
    const [emptyLedColor, setEmptyLedColor] = useState<EmptyLEDStyle>(EmptyLEDStyle.BRIGHT);
    const [copiedDoneStyle, setCopiedDoneStyle] = useState({
        display: "none"
    });

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    // rows and collumns
    const [gridData, setGridData] = useState<Grid>(generateGrid(START_ROWS, START_COLLUMNS));
    const [generatedMap, setGeneratedMap] = useState("");

    const imageSizeEquivalentRef = useRef<HTMLDivElement>(null);
    const backgroundImageRef = useRef<HTMLImageElement>(null);
    const mapperFieldRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setGeneratedMap(generateMapFromGrid(gridData));
    }, [gridData]);

    const guardedSetRows = (newVal: number) => {
        setGridData(generateGrid(newVal, collumns));
        setRows(newVal);
    };  
    
    const guardedSetCollumns = (newVal: number) => {
        setGridData(generateGrid(rows, newVal));
        setCollumns(newVal);
    };

    // TODO add guard to the setRealLedCount that removes bigger counts when decreased

    const guardedSetLedNumToSet = (newVal: number): void => {
        // only set the new value if its not bigger than the realLedCount - 1 (as indexed started with 0)
        setLedNumToSet(Math.min(newVal, realLedCount - 1));
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

    const backgroundImageOnload = () => {
        setEmptyLedColor(detectLedStyleToUse(backgroundImageRef));
    }

    const [setLEDInfo, detailedLEDInfo] = useMemo((): [string, string] => {
        const setLedNums = extractLedNums([...gridData]);
        let info = `(${setLedNums.length}/${realLedCount})`;
        let detailedInfo = generateMissingLedInfo(realLedCount, setLedNums);
        if (setLedNums.length === realLedCount) {
            info = "All Set!";
            detailedInfo = "All LEDS are set, you can use the map now!";
        }
        return [info, detailedInfo];
    }, [gridData, realLedCount]);

    const copyMapToClipboard = useCallback(() => {
        copyToClipboard(generatedMap, () => {
            setCopiedDoneStyle({
                display: "flex"
            });
            setTimeout(() => {
                setCopiedDoneStyle({
                    display: "none"
                });
            }, 1_500);
        });
    }, [generatedMap]);

    const downloadLedMapFile = useCallback(() => {
        downloadFile(generatedMap, "ledmap.json");
    }, [generatedMap]);

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
                <VerticalDivider />
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
                <VerticalDivider />
                <NumberInput 
                    labelName="LED-Num to set:"
                    stateValue={ledNumToSet}
                    setStateValue={setLedNumToSet}
                    hidePlusMinus={true}
                    max={realLedCountReduced}
                    guide="Step 4: Set LEDs on Matrix by clicking pixels"
                />
                <div 
                    className="setInfo"
                    title={detailedLEDInfo}
                >
                    {setLEDInfo}
                </div>
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
                    ledNumToSet={ledNumToSet}
                    setLedNumToSet={guardedSetLedNumToSet}
                    emptyLedColor={emptyLedColor}
                />
            </div>
            {
                image !== IMAGE_STATE.DONT_USE && <img 
                    ref={backgroundImageRef} 
                    className="backgroundImage"
                    onLoad={backgroundImageOnload}
                    src={image}
                    alt=""
                    onDragStart={avoidImageDragging}
                />
            }
        </div>
        <div className="toolbar">
            <div>Generated WLED Map: </div>
            <input 
                className="mapOutputInputfield"
                value={generatedMap}
            />
            <VerticalDivider />
            <img 
                className="copyIcon"
                src={copySVG} 
                alt="Copy LED to clipboard"
                title="Copy WLED ledmap to clipboard"
                onClick={copyMapToClipboard}
            />
            <div 
                className="copiedDone"
                style={copiedDoneStyle}
            >
                ✔ Copied to Clipboard! ✔
            </div>
            <VerticalDivider />
            <img 
                className="copyIcon"
                src={saveFileSVG} 
                alt="Save ledmap.json"
                title="Download WLED ledmap.json file"
                onClick={downloadLedMapFile}
            />
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

function extractLedNums(grid: Grid): number[] {
    const alreadySetNums: number[] = (
        grid
            .map((row) => row.map((point) => point.value))
            .flat()
            .filter((ledNum: number | undefined) => ledNum !== void 0)
    //not sure why Ts doesn't get that this is number[], therfore cast it
    ) as number[];
    return alreadySetNums;
}

function generateMissingLedInfo(realLedCount: number, setLedNums: number[]): string {
    let missingLedNums = [];
    for (let i = 0; i < realLedCount; i++) {
        if (!setLedNums.includes(i)) {
            missingLedNums.push(i);
        }
    }
    return `Please set the following LED Numbers: [${missingLedNums.join(", ")}]`;
}