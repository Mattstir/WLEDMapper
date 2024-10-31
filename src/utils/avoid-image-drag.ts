import { DragEvent } from "react";

export function avoidImageDragging(e: DragEvent<HTMLDivElement>): boolean {
    e.preventDefault();
    return false;
}