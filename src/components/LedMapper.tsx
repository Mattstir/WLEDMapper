import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { IMAGE_STATE } from "../types/imageState";
import "./LedMapper.css";
import { Grid } from "../types/grid";
import LedGrid from "./LedGrid";

interface LedMapperParams {
    image: string | IMAGE_STATE;
    setImage: React.Dispatch<React.SetStateAction<string | IMAGE_STATE>>;
}


function LedMapper({image, setImage}: LedMapperParams): ReactElement {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    // rows and collumns
    const [gridData, setGridData] = useState<Grid>([
        [{value: 1}, {value: 2}, {value: 3}],
        [{value: 2}, {value: 3}, {value: undefined}]
    ]); // DEMO DATA

    const imageSizeEquivalentRef = useRef<HTMLDivElement>(null);
    const backgroundImageRef = useRef<HTMLImageElement>(null);
    const mapperFieldRef = useRef<HTMLDivElement>(null);

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


    return <div className="mapperParent">
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
            {image !== IMAGE_STATE.DONT_USE && <img ref={backgroundImageRef} className="backgroundImage" src={image} />}
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