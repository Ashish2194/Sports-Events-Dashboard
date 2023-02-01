import React from "react";
import CONSTANTS from "../../../constants";
import ErrorImage from "./ErrorImage";
import './FallBackUI.css';

const FallBackUI = () => {
    const refreshPageHandler = () => {
        window.location.reload();
    }
    return <>
        <div className="error-container">
            <ErrorImage />
            <h2>{CONSTANTS.FALLBACK_UI_MESSAGE}</h2>
            <button onClick={refreshPageHandler}>Retry</button>
        </div>
    </>;
}

export default FallBackUI;