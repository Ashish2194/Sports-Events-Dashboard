import React, { useReducer } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import FallBackUI from './components/common/FallBackUI/FallBackUI';
import SportsEventDashboard from './components/SportsEventsDashboard/SportsEventsDashboard';
import SportsEventReducer from './reducers/SportsEventReducer/SportsEventReducer';

export const initialState = {
  events: null, // Since the api does not support search, we need to store the original set of events and filter on it and pass to filtered events
  filteredEvents: null,
  selectedEvents: null,
  selectedIdMap: {}, // Keep a map of selectedId:timeStamp to quickly disable events having same time as the selected one
  count: 0, // for maintaing max count of events user can select
  loading: false,
  showToast: false
};

export const SportsEventContext = React.createContext();

function App() {

  const [state, dispatch] = useReducer(SportsEventReducer, initialState);

  const myErrorHandler = (error, info) => {
    /**In real production code I would have used it to log errors to reporting service */
    console.log(error)
    console.log(info)
  }

  return (
    <>
      <ErrorBoundary FallbackComponent={FallBackUI} onError={myErrorHandler}>
        <SportsEventContext.Provider value={{state, dispatch}}>
          <SportsEventDashboard />
        </SportsEventContext.Provider>
      </ErrorBoundary>
    </>
  );
}

export default App;