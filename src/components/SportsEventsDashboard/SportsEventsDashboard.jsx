import React, { useContext, useEffect } from 'react';
import './SportsEventsDashboard.css';
import { getFormattedTime, getEventNameInLowerCase, groupByResults } from '../../util/util';
import Toast from '../common/Toast/Toast';
import CONSTANTS from '../../constants';
import Header from '../common/Header/Header';
import SportsEventsList from '../SportsEventsList/SportsEventsList';
import { useErrorHandler } from 'react-error-boundary'
import Loader from '../common/Loader/Loader';
import { SportsEventContext } from '../../App';
import { ACTION_TYPES } from '../../reducers/SportsEventReducer/actionTypes';
import EmptyResults from '../common/EmptyResults/EmptyResults';

const SportsEventDashboard = () => {
    const { state, dispatch } = useContext(SportsEventContext);
    const { events, filteredEvents, selectedEvents, selectedIdMap, count, loading, showToast } = state;
    const handleError = useErrorHandler();

    useEffect(() => {
        const fetchEvents = async () => {
            dispatch({ type: ACTION_TYPES.TOGGLE_LOADING, payload: { loading: true } })
            try {
                const response = await fetch(CONSTANTS.API_URL);
                const results = await response.json();
                const groupedByCategoryResults = groupByResults(results);
                dispatch({ type: ACTION_TYPES.UPDATE_EVENTS, payload: { events: groupedByCategoryResults } })
                dispatch({ type: ACTION_TYPES.UPDATE_FILTERED_EVENTS, payload: { filteredEvents: groupedByCategoryResults } })
                dispatch({ type: ACTION_TYPES.TOGGLE_LOADING, payload: { loading: false } })
            } catch (err) {
                dispatch({ type: ACTION_TYPES.TOGGLE_LOADING, payload: { loading: false } });
                handleError(err);
            }
        }
        fetchEvents();
    }, []);


    const getFilteredEvents = (id, eventSource, type) => {
        // filter based on event id and group events based on category
        return Object.entries(eventSource).reduce((acc, [eventCategory, categoryEvents]) => {
            acc[eventCategory] = categoryEvents.filter(item => item.id !== id);
            // Remove any categoryKey that does not have events and operation type was remove
            if (!acc[eventCategory].length && type === CONSTANTS.BUTTON_TYPES.REMOVE)
                delete acc[eventCategory];
            return acc;
        }, {});
    }

    const searchByEventsNameHandler = ({ target: { value } }) => {
        const trimmedValue = value.trim();
        const selectedIds = Object.keys(selectedIdMap).map(id => Number(id)) || [];
        if (!trimmedValue) { // If search is empty reset the events but not include the already selected events
            if (selectedIds.length) {
                const eventsWithoutSelectedEvents = Object.entries(events).reduce((acc, [eventCategory, categoryEvents]) => {
                    acc[eventCategory] = categoryEvents.filter(item => {
                        return !selectedIds.includes(item.id);
                    });
                    return acc;
                }, {});
                dispatch({ type: ACTION_TYPES.UPDATE_FILTERED_EVENTS, payload: { filteredEvents: eventsWithoutSelectedEvents } });
            } else
                dispatch({ type: ACTION_TYPES.UPDATE_FILTERED_EVENTS, payload: { filteredEvents: events } }); // If no selected events, reset to all events loaded initially
        } else {
            // Search by event name but not include the already selected events
            const filteredResults = Object.entries(events).reduce((acc, [eventCategory, categoryEvents]) => {
                acc[eventCategory] = categoryEvents.filter(item => {
                    if (selectedIds.length) {
                        return (getEventNameInLowerCase(item.event_name).includes(trimmedValue.toLowerCase()) && !selectedIds.includes(item.id))
                    }
                    return getEventNameInLowerCase(item.event_name).includes(trimmedValue.toLowerCase())
                });
                if (!acc[eventCategory].length)
                    delete acc[eventCategory]; // remove event categoryKey if no events match the search
                return acc;
            }, {});
            dispatch({
                type: ACTION_TYPES.UPDATE_FILTERED_EVENTS,
                payload: {
                    // if filtered events are null, update state with null to show empty message
                    filteredEvents: !Object.keys(filteredResults).length ? null : filteredResults
                }
            });
        }
    }

    const selectEventHandler = (id, category, type) => {
        // Show error toast if user tries to select more than 3 events
        if (count === CONSTANTS.MAX_SELECTION_CAP && type === CONSTANTS.BUTTON_TYPES.SELECT) {
            dispatch({ type: ACTION_TYPES.SHOW_TOAST, payload: { showToast: true } })
            return;
        }
        const selectedEvent = events[category].filter(event => event.id === id);
        const currentlySelectedEvents = { ...selectedEvents };
        const currSelectedIdMap = { ...selectedIdMap };
        // Update filteredResults to not include selected events and increase count
        if (type === CONSTANTS.BUTTON_TYPES.SELECT) {
            const { start_time, end_time } = selectedEvent[0];
            const time = getFormattedTime(start_time, end_time);
            if (category in currentlySelectedEvents) {
                currentlySelectedEvents[category].push(...selectedEvent)
            } else {
                currentlySelectedEvents[category] = [...selectedEvent]
            }
            const filteredResults = getFilteredEvents(id, filteredEvents, type);
            // here we are storing selectedId: timestamp in string, so that we can quickly lookup for event ids having same timestamp.
            currSelectedIdMap[id] = time;
            dispatch({ type: ACTION_TYPES.UPDATE_FILTERED_EVENTS, payload: { filteredEvents: filteredResults } });
            dispatch({ type: ACTION_TYPES.UPDATE_SELECTED_EVENTS, payload: { selectedEvents: currentlySelectedEvents } });
            dispatch({ type: ACTION_TYPES.UPDATE_EVENT_COUNT, payload: { count: count + 1 } });
        } else {
            // If user removes an event, decrement the count and update the filtered items to again include the event
            const selectedEventsFiltered = getFilteredEvents(id, currentlySelectedEvents, type);
            // delete from selectedIdMap if user remove the event
            delete currSelectedIdMap[id];
            /**
             * Added functionality where once you select an item and then do search and then deselect the item from  selected item list,
             *  now it would again be part of search results
             */
            if (filteredEvents) {
                const currentFilteredItems = { ...filteredEvents }
                currentFilteredItems[category].push(...selectedEvent);
                dispatch({ type: ACTION_TYPES.UPDATE_FILTERED_EVENTS, payload: { filteredEvents: currentFilteredItems } });
            }
            dispatch({
                type: ACTION_TYPES.UPDATE_SELECTED_EVENTS,
                payload: {
                    // if selected events are null, update state with null to show empty message
                    selectedEvents: !Object.keys(selectedEventsFiltered).length ? null : selectedEventsFiltered
                }
            });

            dispatch({ type: ACTION_TYPES.UPDATE_EVENT_COUNT, payload: { count: count - 1 } });
        }
        dispatch({ type: ACTION_TYPES.UPDATE_SELECTED_ID_MAP, payload: { selectedIdMap: currSelectedIdMap } });
    }

    const renderEvents = () => {
        return <>
            <div className='all__events__container'>
                <Header
                    hasSearchBar
                    title={CONSTANTS.HEADER.ALL_EVENTS}
                    onSearchHandler={searchByEventsNameHandler}
                />
                {!filteredEvents ? <EmptyResults message={CONSTANTS.EMPTY_ALL_EVENTS} /> :
                    <SportsEventsList
                        events={filteredEvents}
                        onEventSelect={selectEventHandler}
                        tileType={CONSTANTS.BUTTON_TYPES.SELECT}
                    />
                }

            </div>
            <div className='selected__events__container'>
                <Header
                    hasSearchBar={false}
                    title={CONSTANTS.HEADER.SELECTED_EVENTS}
                />
                {!selectedEvents ? <EmptyResults message={CONSTANTS.EMPTY_SELECTED_EVENTS} /> :
                    <SportsEventsList
                        events={selectedEvents}
                        onEventSelect={selectEventHandler}
                        tileType={CONSTANTS.BUTTON_TYPES.REMOVE}
                    />
                }
            </div>
        </>
    }

    const onDismiss = () => {
        dispatch({ type: ACTION_TYPES.SHOW_TOAST, payload: { showToast: false } })
    };

    return <div className='container'>
        {loading && <Loader />}
        {showToast && (
            <Toast
                message={CONSTANTS.TOAST_ERROR_MESSAGE}
                onDismiss={onDismiss}
                type={CONSTANTS.TOAST_TYPE.ERROR}
            />
        )}
        {!loading && renderEvents()}
    </div>
}

export default SportsEventDashboard;