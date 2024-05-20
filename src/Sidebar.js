import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      
      <Link to="/">Home</Link>
      <Link to="/createScenario">Add Scenario</Link>
      <Link to="/allScenarios">All Scenarios</Link>
      <Link to="/createVehicle">Add Vehicle</Link>
     
     
    </div>
  );
};

export default Sidebar;
