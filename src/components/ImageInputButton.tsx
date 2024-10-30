import { ChangeEventHandler, ReactElement } from "react";
import { IMAGE_STATE } from "../types/imageState";
import { readFileAsUrl } from "../utils/read-file-as-url";
import "./ImageInputButton.css";

interface FullSizeImagePickerParams {
    setImage: React.Dispatch<React.SetStateAction<string | IMAGE_STATE>>
}

function ImageInputButton({setImage}: FullSizeImagePickerParams): ReactElement {
    const onChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file: File | undefined = e.target.files?.[0];
        if (file) {
            const fileAsUrl = await readFileAsUrl(file);
            if (fileAsUrl) {
                setImage(fileAsUrl);
            } 
        }
    };

    return <div className="ButtonParent">
        <label htmlFor="fileInput" className="fileUploadButton">
            Upload Image
        </label>
        <input 
            type="file" 
            id="fileInput"
            accept="image/*"
            onChange={onChange}
        />
    </div>;
}
  
export default ImageInputButton;