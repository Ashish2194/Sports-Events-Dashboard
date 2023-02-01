import React from "react";
import CONSTANTS from "../../constants";
import { getFormattedTime } from "../../util/util";
import EventCard from "../common/EventCard/EventCard";
import "./SportsEventsList.css";

const SportsEventsList = ({ events, tileType, selectedIds, onEventSelect }) => {

    const hasConflictingTime = (startTime, endTime) => {
        const timeValue = getFormattedTime(startTime, endTime);
        let flag = false;
        for (let value of Object.values(selectedIds)) {
            if (value === timeValue) {
                flag = true;
                break;
            }
        }
        return flag;
    };

    const renderEventList = (eventsObj, tileType) => {
        return <>
            {Object.entries(eventsObj).map(([categoryKey, categoryEvents], index) => {
                return <div className='events_category_container' key={`${categoryKey}-${index}`}>
                    <h3>{categoryKey}</h3>
                    <div className='events_tile_container'>
                        {categoryEvents.map(categoryEvent => {
                            return <EventCard
                                key={categoryEvent.id}
                                id={categoryEvent.id}
                                category={categoryKey}
                                name={categoryEvent.event_name}
                                startTime={categoryEvent.start_time}
                                endTime={categoryEvent.end_time}
                                onEventClick={onEventSelect}
                                type={tileType}
                                disabled={tileType === CONSTANTS.BUTTON_TYPES.SELECT && hasConflictingTime(categoryEvent.start_time, categoryEvent.end_time)}
                            />
                        })}
                    </div>
                </div>
            })}
        </>
    }

    return <div className='selected_events__list__container'>
        {renderEventList(events, tileType)}
    </div>
}

export default SportsEventsList;