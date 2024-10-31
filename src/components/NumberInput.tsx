import { ChangeEvent, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import plusSVG from "../svg/plus.svg";
import minusSVG from "../svg/minus.svg";
import "./NumberInput.css";
import { avoidImageDragging } from "../utils/avoid-image-drag";

interface NumberInputParams {
    stateValue: number;
    setStateValue: (n: number ) => void;
    labelName: string;
    guide: string;
    warning?: string;
}

function NumberInput({stateValue, setStateValue, labelName, guide, warning}: NumberInputParams): ReactElement {
    const [shouldShowWarning, setShouldShowWarning] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wholeNumberInputRef = useRef<HTMLDivElement>(null);
    const guideLabelRef = useRef<HTMLDivElement>(null);

    const changeValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const parsedNum = Number(e.target.value);
        if (isNaN(parsedNum)) {
            return;
        }
        // check if the new want to set value has a decimal
        if (parsedNum % 1 !== 0) {
            return;
        }
        setStateValue(Math.min(Math.max(parsedNum, 0), 100_000));
    }, [setStateValue]);

    const increase = () => {
        setStateValue(Math.min(stateValue + 1, 100_000));
    };

    const decrease = () => {
        setStateValue(Math.max(stateValue - 1, 0));
    };

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }

        const width = stateValue.toFixed().length * 0.5 + 1; // 1 = base width
        inputRef.current.style.width = `${width}rem`
    }, [stateValue, inputRef]);

    // set the left value of the guideLabel to allign wit the left point
    useEffect(() => {
        if (!wholeNumberInputRef.current || !guideLabelRef.current) {
            return;
        }

        const numberInputLeft = wholeNumberInputRef.current.offsetLeft;
        guideLabelRef.current.style.left = `${numberInputLeft}px`;
    }, [wholeNumberInputRef, guideLabelRef])

    return <div 
            className="numberInput"
            ref={wholeNumberInputRef}
            onMouseEnter={setShouldShowWarning.bind(null, true)}
            onMouseLeave={setShouldShowWarning.bind(null, false)}
        >

        { shouldShowWarning && warning && <div className="warning">{warning}</div>}
        <div className="guideLabel" ref={guideLabelRef}>{guide}</div>
        <div className="label">{labelName}</div>
        <input 
            className="value"
            ref={inputRef}
            value={stateValue}
            onChange={changeValue}
        />
        <div className="numberInputIconParent" onClick={decrease}>
            <img 
                src={minusSVG} 
                alt="" 
                onDragStart={avoidImageDragging}
            />
        </div>
        <div className="numberInputIconParent" onClick={increase}>
            <img 
                src={plusSVG} 
                alt="" 
                onDragStart={avoidImageDragging}
            />
        </div>
    </div>
}

export default NumberInput;