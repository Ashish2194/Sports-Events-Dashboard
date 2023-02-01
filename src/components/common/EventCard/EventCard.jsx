import React from "react";
import { getFormattedTime } from "../../../util/util";

import "./EventCard.css";

const EventCard = ({id, category, name, startTime, endTime, onEventClick, type, disabled}) => {
    

    const getEnum = category => {
        switch(category) {
            case "Swimming": return "S";
            case "Boxing": return "B";
            case "Athletics": return "A";
            default:
                return "-";
        }
    }

    return <div className={`event__container${disabled ? ' disabled':''}`}>
        <div className="event__type">
           {getEnum(category)}
        </div>
        <div className="seperator"></div>
        <div className="event__details">
            <div className="event__details__title">{name}</div>
            <div className="event__details__category">{`(${category})`}</div>
            <div className="event__details__time">{getFormattedTime(startTime, endTime)}</div>
            <button className={`event__details__button-${type.toLowerCase()}${disabled ? ' disabled-btn ':''}`} onClick={() => onEventClick(id, category, type)}>{type}</button>
        </div>
    </div>
};

export default EventCard;