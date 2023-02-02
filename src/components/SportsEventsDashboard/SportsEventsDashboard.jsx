import React, { useEffect, useState } from 'react';
import './SportsEventsDashboard.css';
import { getFormattedTime, getEventNameInLowerCase } from '../../util/util';
import Toast from '../common/Toast/Toast';
import CONSTANTS from '../../constants';
import Header from '../common/Header/Header';
import SportsEventsList from '../SportsEventsList/SportsEventsList';
import { useErrorHandler } from 'react-error-boundary'
import Loader from '../common/Loader/Loader';

const SportsEventDashboard = () => {

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState({});
    const [selectedIdMap, setSelectedIdMap] = useState({});
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const handleError = useErrorHandler();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch(CONSTANTS.API_URL);
                const results = await response.json();
                setEvents(groupByResults(results));
                setFilteredEvents(groupByResults(results));
                setLoading(false)
            } catch (err) {
                handleError(err);
                setLoading(false)
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
                setFilteredEvents(eventsWithoutSelectedEvents);
            } else
                setFilteredEvents(events); // If no selected events, reset to all events loaded initially
        } else {
            // Search by event name but not include the already selected events
            const filteredResults = Object.entries(events).reduce((acc, [eventCategory, categoryEvents]) => {
                acc[eventCategory] = categoryEvents.filter(item => {
                    if (selectedIds.length) {
                        return (getEventNameInLowerCase(item.event_name).includes(trimmedValue.toLowerCase()) && !selectedIds.includes(item.id))
                    } 
                    return getEventNameInLowerCase(item.event_name).includes(trimmedValue.toLowerCase())
                });
                return acc;
            }, {});
            setFilteredEvents(filteredResults);
        }
    }

    const selectEventHandler = (id, category, type) => {
        if (count === CONSTANTS.MAX_SELECTION_CAP && type === CONSTANTS.BUTTON_TYPES.SELECT) {
            setShowToast(true);
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
            setFilteredEvents(filteredResults);
            setSelectedEvents(currentlySelectedEvents);
            setCount(count + 1)
        } else {
            const selectedEventsFiltered = getFilteredEvents(id, currentlySelectedEvents, type);
            delete currSelectedIdMap[id];
            const currentFilteredItems = { ...filteredEvents }
            currentFilteredItems[category].push(...selectedEvent);
            setSelectedEvents(selectedEventsFiltered)
            setFilteredEvents(currentFilteredItems);
            setCount(count - 1)
        }
        setSelectedIdMap(currSelectedIdMap);
    }

    const renderEvents = () => {
        return <>
            <div>
                <Header
                    hasSearchBar
                    title={CONSTANTS.HEADER.ALL_EVENTS}
                    onSearchHandler={searchByEventsNameHandler}
                />
                <SportsEventsList
                    events={filteredEvents}
                    selectedIds={selectedIdMap}
                    onEventSelect={selectEventHandler}
                    tileType={CONSTANTS.BUTTON_TYPES.SELECT}
                />
            </div>
            <div className='selected__events__container'>
                <Header
                    hasSearchBar={false}
                    title={CONSTANTS.HEADER.SELECTED_EVENTS}
                />
                <SportsEventsList
                    events={selectedEvents}
                    selectedIds={selectedIdMap}
                    onEventSelect={selectEventHandler}
                    tileType={CONSTANTS.BUTTON_TYPES.REMOVE}
                />
            </div>
        </>
    }

    const onDismiss = () => {
        setShowToast(false);
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