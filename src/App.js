import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './Sidebar';
import Home from './Home';
import Scenario from './Scenario';
import Vehicle from './Vehicle';

import api from './api';
import AllScenarios from './AllScenarios';

function App() {
  const [scenarios, setScenarios] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  /*useEffect(() => {
    api.get('/')
      .then(response => setScenarios(response.data))
      .catch(error => console.error('Error fetching scenarios:', error));

    api.get('/vehicles')
      .then(response => setVehicles(response.data))
      .catch(error => console.error('Error fetching vehicles:', error));
  }
  , []);*/

  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home scenarios={scenarios} />} />
            <Route path="/createScenario" element={<Scenario setScenarios={setScenarios} />} />
            <Route path="/createVehicle" element={<Vehicle setVehicles={setVehicles} />} />
            <Route path="/allScenarios" element={<AllScenarios />} /> {/* Add the route for AllScenarios */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
