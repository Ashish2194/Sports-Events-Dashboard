import React, { useContext, useEffect } from 'react';
import './SportsEventsDashboard.css';
import { getFormattedTime, getEventNameInLowerCase } from '../../util/util';
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
                dispatch({ type: ACTION_TYPES.UPDATE_EVENTS, payload: { events: groupByResults(results) } })
                dispatch({ type: ACTION_TYPES.UPDATE_FILTERED_EVENTS, payload: { filteredEvents: groupByResults(results) } })
                dispatch({ type: ACTION_TYPES.TOGGLE_LOADING, payload: { loading: false } })
            } catch (err) {
                dispatch({ type: ACTION_TYPES.TOGGLE_LOADING, payload: { loading: false } });
                handleError(err);
            }
        }
        fetchEvents();
    }, []);

    const groupByResults = (results) => {
        return results.reduce((acc, curr) => {
            const { id, event_name, event_category, start_time, end_time } = curr;
            if (acc[event_category]) {
                acc[event_category].push({ id, event_name, start_time, end_time });
            } else {
                acc[event_category] = [{ id, event_name, start_time, end_time }];
            }
            return acc;
        }, {});
    }

    const getFilteredEvents = (id, eventSource, type) => {
        return Object.entries(eventSource).reduce((acc, [eventCategory, categoryEvents]) => {
            acc[eventCategory] = categoryEvents.filter(item => item.id !== id);
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
                    filteredEvents: !Object.keys(filteredResults).length ? null : filteredResults
                }
            });
        }
    }

    const selectEventHandler = (id, category, type) => {
        if (count === CONSTANTS.MAX_SELECTION_CAP && type === CONSTANTS.BUTTON_TYPES.SELECT) {
            dispatch({ type: ACTION_TYPES.SHOW_TOAST, payload: { showToast: true } })
            return;
        }
        const selectedEvent = events[category].filter(event => event.id === id);
        const currentlySelectedEvents = { ...selectedEvents };
        const currSelectedIdMap = { ...selectedIdMap };
        if (type === CONSTANTS.BUTTON_TYPES.SELECT) {
            const { start_time, end_time } = selectedEvent[0];
            const time = getFormattedTime(start_time, end_time);
            if (category in currentlySelectedEvents) {
                currentlySelectedEvents[category].push(...selectedEvent)
            } else {
                currentlySelectedEvents[category] = [...selectedEvent]
            }
            const filteredResults = getFilteredEvents(id, filteredEvents, type);
            currSelectedIdMap[id] = time;
            dispatch({ type: ACTION_TYPES.UPDATE_FILTERED_EVENTS, payload: { filteredEvents: filteredResults } });
            dispatch({ type: ACTION_TYPES.UPDATE_SELECTED_EVENTS, payload: { selectedEvents: currentlySelectedEvents } });
            dispatch({ type: ACTION_TYPES.UPDATE_EVENT_COUNT, payload: { count: count + 1 } });
        } else {
            const selectedEventsFiltered = getFilteredEvents(id, currentlySelectedEvents, type);
            delete currSelectedIdMap[id];
            if (filteredEvents) {
                const currentFilteredItems = { ...filteredEvents }
                currentFilteredItems[category].push(...selectedEvent);
                dispatch({ type: ACTION_TYPES.UPDATE_FILTERED_EVENTS, payload: { filteredEvents: currentFilteredItems } });
            }
            dispatch({
                type: ACTION_TYPES.UPDATE_SELECTED_EVENTS,
                payload: {
                    selectedEvents: !Object.keys(selectedEventsFiltered).length ? null : selectedEventsFiltered
                }
            });

            dispatch({ type: ACTION_TYPES.UPDATE_EVENT_COUNT, payload: { count: count - 1 } });
        }
        dispatch({ type: ACTION_TYPES.UPDATE_SELECTED_ID_MAP, payload: { selectedIdMap: currSelectedIdMap } });
    }

    const renderEvents = () => {
        console.log(filteredEvents)
        return <>
            <div className='all__events__container'>
                <Header
                    hasSearchBar
                    title={CONSTANTS.HEADER.ALL_EVENTS}
                    onSearchHandler={searchByEventsNameHandler}
                />
                {!filteredEvents ? <EmptyResults message={"No events found!!"} /> :
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
                {!selectedEvents ? <EmptyResults message={"No events selected!!"} /> :
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