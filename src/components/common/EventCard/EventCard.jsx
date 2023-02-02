import React from "react";
import CONSTANTS from "../../../constants";
import { getFormattedTime } from "../../../util/util";

import "./EventCard.css";

const EventCard = ({ id, category, name, startTime, endTime, onEventClick, type, disabled }) => {
    const getEnum = category => {
        const { SPORTS_CATEGORY: { ATHLETICS, BOXING, SWIMMING } } = CONSTANTS;
        switch (category) {
            case SWIMMING.NAME: return SWIMMING.ABBREVIATION;
            case BOXING.NAME: return BOXING.ABBREVIATION;
            case ATHLETICS.NAME: return ATHLETICS.ABBREVIATION;
            default:
                return "-";
        }
    }

    return <div className={`event__container${disabled ? ' disabled' : ''}`}>
        <div className="event__type">
            {getEnum(category)}
        </div>
        <div className="seperator"></div>
        <div className="event__details">
            <div className="event__details__title">{name}</div>
            <div className="event__details__category">{`(${category})`}</div>
            <div className="event__details__time">{getFormattedTime(startTime, endTime)}</div>
            <button className={`event__details__button-${type.toLowerCase()}${disabled ? ' disabled-btn ' : ''}`} onClick={() => onEventClick(id, category, type)}>{type}</button>
        </div>
    </div>
};

export default EventCard;