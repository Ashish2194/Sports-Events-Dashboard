import React, { useContext } from "react";
import { SportsEventContext } from "../../App";
import CONSTANTS from "../../constants";
import { getFormattedTime } from "../../util/util";
import EventCard from "../common/EventCard/EventCard";
import './SportsEventCategory.css';

const SportsEventCategory = ({ categoryName, events, tileType, onEventSelect }) => {

    const {state: {selectedIdMap}} = useContext(SportsEventContext);

    const hasConflictingTime = (startTime, endTime) => {
        const timeValue = getFormattedTime(startTime, endTime);
        let flag = false;
        for (let value of Object.values(selectedIdMap)) {
            if (value === timeValue) {
                flag = true;
                break;
            }
        }
        return flag;
    };

    const checkDisabled = (tileType, start_time, end_time) => {
        return tileType === CONSTANTS.BUTTON_TYPES.SELECT && hasConflictingTime(start_time, end_time);
    }

    if(!events.length)
        return null;

    return <>
        <div className='events_category_container'>
            <h3>{categoryName}</h3>
            <div className='events_tile_container'>
                {events.map(categoryEvent => {
                    return <EventCard
                        key={categoryEvent.id}
                        id={categoryEvent.id}
                        category={categoryName}
                        name={categoryEvent.event_name}
                        startTime={categoryEvent.start_time}
                        endTime={categoryEvent.end_time}
                        onEventClick={onEventSelect}
                        type={tileType}
                        disabled={checkDisabled(tileType, categoryEvent.start_time, categoryEvent.end_time)}
                    />
                })}
            </div>
        </div>
    </>
}

export default SportsEventCategory;