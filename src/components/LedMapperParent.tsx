import { ReactElement, useState } from "react";
import "./LedMapperParent.css";
import FullSizeImagePicker from "./FullSizeImagePicker";
import { IMAGE_STATE } from "../types/imageState";
import LedMapper from "./LedMapper";

function LedMapperParent(): ReactElement {
    // want to try to run this thing without any extra state management lib. therfore most of the state is kept in here!
    const [image, setImage] = useState<string | IMAGE_STATE>(IMAGE_STATE.NOT_SET);

    const getContent = (): ReactElement => {
        if (image === IMAGE_STATE.NOT_SET) {
            return <FullSizeImagePicker setImage={setImage} />;
        }
        return <LedMapper image={image} setImage={setImage}/>;
    };

    return (
      <div className="parentMapper">
          {getContent()}
      </div>
    );
  }
  
  export default LedMapperParent;