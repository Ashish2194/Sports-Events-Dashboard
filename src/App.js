import { useEffect, useState } from 'react';
import './App.css';
import EventCard from './components/common/EventCard/EventCard';
import SearchBar from './components/common/SearchBar/SearchBar';
import { getFormattedTime } from './util/util';

function App() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [selectedIdMap, setSelectedIdMap] = useState({});
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false);
  const [error, setError] =  useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response =  await fetch("https://run.mocky.io/v3/2744c231-8991-4ae8-bc45-1f645437585a");
      const results = await response.json();
      const groupByResults = results.reduce((acc, curr) => {
        const {id, event_name, event_category, start_time, end_time} = curr;
        if(acc[event_category]){
            acc[event_category].push({id, event_name, start_time, end_time});
        } else {
            acc[event_category] = [{id, event_name, start_time, end_time}];
        }
        return acc;
    }, {});
      setEvents(groupByResults);
      setFilteredEvents(groupByResults);
      setLoading(false)
      } catch(err) {
        setLoading(false)
        setError(err);
      }
      
    }
    fetchEvents();
  }, []);

  const searchByEventsNameHandler = (e) => {
    e.preventDefault();
    const value = e.target.value.trim();
    if(!value) {
      const selectedIds = Object.keys(selectedIdMap).map(id=> Number(id)) || [];
      if(selectedIds.length) {
        const eventsWithoutSelectedEvents = Object.entries(events).reduce((acc, [eventCategory, categoryEvents]) => {
          acc[eventCategory] = categoryEvents.filter(item => {
            return !selectedIds.includes(item.id);
          });
          return acc;
      },{});
        setFilteredEvents(eventsWithoutSelectedEvents);
      } else
        setFilteredEvents(events);
    }else {
      const selectedIds = Object.keys(selectedIdMap).map(id=> Number(id)) || [];
      const filteredResults = Object.entries(events).reduce((acc, [eventCategory, categoryEvents]) => {
        acc[eventCategory] = categoryEvents.filter(item => {
          if(selectedIds.length) {
            return (item.event_name.toLowerCase().includes(value.toLowerCase()) && !selectedIds.includes(item.id))
          }else {
            return item.event_name.toLowerCase().includes(value.toLowerCase())
          }
        });
        return acc;
    },{});
    console.log(filteredResults)
      setFilteredEvents(filteredResults);
    } 
  }

  const hasConflictingTime = (id, startTime, endTime) => {
    const timeValue = getFormattedTime(startTime, endTime);
    let flag = false;
    for(let value of Object.values(selectedIdMap)){
      if(value === timeValue){
        flag =  true;
        break;
      }
    }
    return flag;
  };

  const selectEventHandler = (id, category, type) => {
    if(count === 3 && type === "Select") {
      alert("Can't select more than 3 events")
      return;
    }
    if(type === "Select") {
      const selectedEvent = events[category].filter(event => event.id === id);
      const {start_time, end_time} = selectedEvent[0];
      const time = getFormattedTime(start_time, end_time);

      const currentlySelectedEvents = {...selectedEvents};
      if(category in currentlySelectedEvents) {
        currentlySelectedEvents[category].push(...selectedEvent)
      }else {
        currentlySelectedEvents[category] = [...selectedEvent]
      }
      const filteredResults = Object.entries(filteredEvents).reduce((acc, [eventCategory, categoryEvents]) => {
        acc[eventCategory] = categoryEvents.filter(item => item.id!==id);
        return acc;
    },{});
    const currSelectedIdMap = {...selectedIdMap};
    currSelectedIdMap[id] = time;
      setSelectedIdMap(currSelectedIdMap);

      setFilteredEvents(filteredResults);
      setSelectedEvents(currentlySelectedEvents);
      setCount(count+1)
    } else {
      const currentlySelectedEvents = {...selectedEvents};
      const selectedEventsFiltered = Object.entries(currentlySelectedEvents).reduce((acc, [eventCategory, categoryEvents]) => {
        acc[eventCategory] = categoryEvents.filter(item => item.id!==id);
        if(!acc[eventCategory].length)
          delete acc[eventCategory];
        return acc;
    },{});

    const getEventById = events[category].filter(event => event.id === id);
    const currSelectedIdMap = {...selectedIdMap};
    delete currSelectedIdMap[id];
    const currentFilteredItems = {...filteredEvents}
    currentFilteredItems[category].push(...getEventById);
    setSelectedIdMap(currSelectedIdMap);
    setSelectedEvents(selectedEventsFiltered)
    setFilteredEvents(currentFilteredItems);
    setCount(count-1)
    }
    
  }

  const renderEventList = () => {
    return <>
      {Object.entries(filteredEvents).map(([categoryKey, categoryEvents], index) => {
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
                      onEventClick={selectEventHandler}
                      type="Select"
                      disabled={hasConflictingTime(categoryEvent.id, categoryEvent.start_time, categoryEvent.end_time)}
                    />
                  })}
                </div>
              </div>
          })}
    </>
  }

  const renderEvents = () => {
    return <>
     <div className='all__events__container'>
        <header className="header">
          <h2>All Events</h2>
          <SearchBar onChange={searchByEventsNameHandler} />
        </header>
        <div className='events__list__container'>
          {renderEventList()}
        </div>
        </div>
        <div className='selected__events__container'>
        <header className="header">
          <h2>Selected Events</h2>
        </header>
        <div className='selected_events__list__container'>
        {Object.entries(selectedEvents).map(([categoryKey, categoryEvents], index) => {
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
                      onEventClick={selectEventHandler}
                      type="Remove"
                    />
                  })}
                </div>
              </div>
          })}
        </div>
        </div>
    </>
  }

  if(error) {
    return  <div>Something went wrong... try again</div>
  }
  return (
    <>
      <div className='container'>
        {loading && <div>Loading events....</div>}
        {!loading && renderEvents()}
      </div>
    </>
  );
}

export default App;