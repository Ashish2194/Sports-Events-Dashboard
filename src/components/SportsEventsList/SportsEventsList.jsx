import React from "react";
import SportsEventCategory from "../SportsEventCategory/SportsEventCategory";
import "./SportsEventsList.css";

const SportsEventsList = ({ events, tileType, selectedIds, onEventSelect }) => {

    const renderEventList = (eventsObj, tileType) => {
        return <>
            {Object.entries(eventsObj).map(([categoryKey, categoryEvents], index) => {
                return <SportsEventCategory
                    key={`${categoryKey}-${index}`}
                    categoryName={categoryKey}
                    events={categoryEvents}
                    tileType={tileType}
                    selectedIds={selectedIds}
                    onEventSelect={onEventSelect}
                />
            })}
        </>
    }

    return <div className='selected_events__list__container'>
        {renderEventList(events, tileType)}
    </div>
}

export default SportsEventsList;