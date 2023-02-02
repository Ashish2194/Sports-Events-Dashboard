import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './App.css';
import FallBackUI from './components/common/FallBackUI/FallBackUI';
import SportsEventDashboard from './components/SportsEventsDashboard/SportsEventsDashboard';

function App() {

  const myErrorHandler = (error, info) => {
    /**In real production code I would have used it to log errors to reporting service */
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