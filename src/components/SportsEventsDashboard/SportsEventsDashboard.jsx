import React, { useEffect, useState } from 'react';
import './SportsEventsDashboard.css';
import { getFormattedTime } from '../../util/util';
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
    const [error, setError] = useState(null);
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
                setError(err);
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

    const searchByEventsNameHandler = (e) => {
        const value = e.target.value.trim();
        if (!value) {
            const selectedIds = Object.keys(selectedIdMap).map(id => Number(id)) || [];
            if (selectedIds.length) {
                const eventsWithoutSelectedEvents = Object.entries(events).reduce((acc, [eventCategory, categoryEvents]) => {
                    acc[eventCategory] = categoryEvents.filter(item => {
                        return !selectedIds.includes(item.id);
                    });
                    return acc;
                }, {});
                setFilteredEvents(eventsWithoutSelectedEvents);
            } else
                setFilteredEvents(events);
        } else {
            const selectedIds = Object.keys(selectedIdMap).map(id => Number(id)) || [];
            const filteredResults = Object.entries(events).reduce((acc, [eventCategory, categoryEvents]) => {
                acc[eventCategory] = categoryEvents.filter(item => {
                    if (selectedIds.length) {
                        return (item.event_name.toLowerCase().includes(value.toLowerCase()) && !selectedIds.includes(item.id))
                    } else {
                        return item.event_name.toLowerCase().includes(value.toLowerCase())
                    }
                });
                return acc;
            }, {});
            setFilteredEvents(filteredResults);
        }
    }


    const selectEventHandler = (id, category, type) => {
        if (count === CONSTANTS.MAX_SELECTION_CAP && type === CONSTANTS.BUTTON_TYPES.SELECT) {
            setError(CONSTANTS.TOAST_ERROR_MESSAGE);
            setShowToast(true);
            return;
        }
        if (type === CONSTANTS.BUTTON_TYPES.SELECT) {
            const selectedEvent = events[category].filter(event => event.id === id);
            const { start_time, end_time } = selectedEvent[0];
            const time = getFormattedTime(start_time, end_time);

            const currentlySelectedEvents = { ...selectedEvents };
            if (category in currentlySelectedEvents) {
                currentlySelectedEvents[category].push(...selectedEvent)
            } else {
                currentlySelectedEvents[category] = [...selectedEvent]
            }
            const filteredResults = Object.entries(filteredEvents).reduce((acc, [eventCategory, categoryEvents]) => {
                acc[eventCategory] = categoryEvents.filter(item => item.id !== id);
                return acc;
            }, {});
            const currSelectedIdMap = { ...selectedIdMap };
            currSelectedIdMap[id] = time;
            setSelectedIdMap(currSelectedIdMap);

            setFilteredEvents(filteredResults);
            setSelectedEvents(currentlySelectedEvents);
            setCount(count + 1)
        } else {
            const currentlySelectedEvents = { ...selectedEvents };
            const selectedEventsFiltered = Object.entries(currentlySelectedEvents).reduce((acc, [eventCategory, categoryEvents]) => {
                acc[eventCategory] = categoryEvents.filter(item => item.id !== id);
                if (!acc[eventCategory].length)
                    delete acc[eventCategory];
                return acc;
            }, {});

            const getEventById = events[category].filter(event => event.id === id);
            const currSelectedIdMap = { ...selectedIdMap };
            delete currSelectedIdMap[id];
            const currentFilteredItems = { ...filteredEvents }
            currentFilteredItems[category].push(...getEventById);
            setSelectedIdMap(currSelectedIdMap);
            setSelectedEvents(selectedEventsFiltered)
            setFilteredEvents(currentFilteredItems);
            setCount(count - 1)
        }

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
        setError(null);
    };

    if (error && !showToast) {
        console.log(error)
        return <div>Something went wrong... try again</div>
    }
    return <div className='container'>
        {loading && <Loader />}
        {showToast && (
            <Toast
                message={error}
                onDismiss={onDismiss}
                type={CONSTANTS.TOAST_TYPE.ERROR}
            />
        )}
        {!loading && renderEvents()}
    </div>
}

export default SportsEventDashboard;