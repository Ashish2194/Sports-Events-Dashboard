import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import FallBackUI from './components/common/FallBackUI/FallBackUI';
import SportsEventDashboard from './components/SportsEventsDashboard/SportsEventsDashboard';

function App() {

  const myErrorHandler = (error, info) => {
    // Do something with the error
    // E.g. log to an error logging client here
    console.log(error)
    console.log(info)
  }

  return (
    <>
      <ErrorBoundary FallbackComponent={FallBackUI} onError={myErrorHandler}>
        <SportsEventDashboard />
      </ErrorBoundary>

    </>
  );
}

export default App;