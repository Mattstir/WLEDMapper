import { RefObject } from "react";
import { EmptyLEDStyle } from "../types/empty-led-style";

export function detectLedStyleToUse(imageRef: RefObject<HTMLImageElement>): EmptyLEDStyle {
    const img = imageRef.current;
    if (!img) {
        return EmptyLEDStyle.BRIGHT;
    }
    // create canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return EmptyLEDStyle.BRIGHT;
    }

    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let avg = 0;

    let colorSum = 0;
    for(let x = 0, len = data.length; x < len; x+=4) {
        r = data[x];
        g = data[x+1];
        b = data[x+2];

        avg = Math.floor((r+g+b)/3);
        colorSum += avg;
    }

    const brightness = Math.floor(colorSum / (img.width * img.height));
    console.log("brightness", brightness);
    return brightness > 100 ? EmptyLEDStyle.DARK : EmptyLEDStyle.BRIGHT;
}