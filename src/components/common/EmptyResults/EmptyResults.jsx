import React from "react";
import './EmptyResults.css';

const EmptyResults = ({message}) => {
    return <div className="empty-results">
        {message}
    </div>
}
export default EmptyResults;