import { DragEvent, MouseEvent, ReactElement, useCallback, useRef } from "react";
import { IMAGE_STATE } from "../types/imageState";
import ImageInputButton from "./ImageInputButton";
import uploadCloudSVG from "../svg/upload-cloud-icon.svg";
import "./FullSizeImagePicker.css";
import { readFileAsUrl } from "../utils/read-file-as-url";

interface FullSizeImagePickerParams {
    setImage: React.Dispatch<React.SetStateAction<string | IMAGE_STATE>>
}

function FullSizeImagePicker({setImage}: FullSizeImagePickerParams): ReactElement {
    const imageAreaRef = useRef<HTMLDivElement>(null);

    const onDragOver = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (imageAreaRef.current) {
            imageAreaRef.current.style.borderColor = "#ff6b6b";
        }
    }, [imageAreaRef]);

    const onDragLeave = useCallback(() => {
        if (imageAreaRef.current) {
            imageAreaRef.current.style.borderColor = "#f7fff7";
        }
    }, [imageAreaRef]);

    const onDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const fileAsUrl = await readFileAsUrl(file);
            if (fileAsUrl) {
                setImage(fileAsUrl);
            } 
        }
        if (imageAreaRef.current) {
            imageAreaRef.current.style.borderColor = "#f7fff7";
        }
    }, [setImage, imageAreaRef]);

    const goToMapperWithoutImage = useCallback((e: MouseEvent<HTMLDivElement>) => {
        setImage(IMAGE_STATE.DONT_USE);
    }, [setImage]);

    const onCloudIconDragStart = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        return false;
    }, []);

    return <div className="fullsizeImagePickerParent">
        <div className="midField">
            1. Step: Add image, drawing or the plan of your WLED project
            <div className="imageArea">
                <div 
                    id="dropzone"
                    ref={imageAreaRef}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <img 
                        className="cloudSVG" 
                        src={uploadCloudSVG} 
                        alt="Upload Icon"
                        onDragStart={onCloudIconDragStart}
                    />
                    Drop an image here
                </div>
                <ImageInputButton setImage={setImage} />
            </div>
            <div 
                className="withoutImageButton" 
                onClick={goToMapperWithoutImage}
                title="Forward to the Mapper tool without using the Mapper based on an image"
            >Alternative: Go to mapper without base image</div>
        </div>
    </div>;
}
  
export default FullSizeImagePicker;