import React, { useState, useEffect } from 'react';
import api from './api';
import './Vehicle.css'; // Import the CSS file

const Vehicle = ({ setVehicles }) => {
  const [vehicle, setVehicle] = useState({
    id: '', // We'll generate this automatically
    name: '',
    x: '',
    y: '',
    speed: '',
    direction: '',
    scenarioId: ''
  });

  const [scenarios, setScenarios] = useState([]); // State to hold scenario list
  const [nextId, setNextId] = useState(1); // State to track the next available ID

  const [xError, setXError] = useState(''); // State to hold X-position error message
  const [yError, setYError] = useState(''); // State to hold Y-position error message
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch scenarios when the component mounts
    api.get('http://localhost:5000/scenarios')
      .then(response => {
        setScenarios(response.data);
        console.log('Scenarios:', response.data);
      })
      .catch(error => console.error('Error fetching scenarios:', error));

    // Fetch vehicles to determine the highest ID
    api.get('http://localhost:5000/vehicles')
      .then(response => {
        const vehicles = response.data;
        setVehicles(vehicles);

        // Determine the highest ID
        const highestId = vehicles.reduce((maxId, vehicle) => {
          return Math.max(maxId, vehicle.id);
        }, 0);

        setNextId(highestId + 1);
      })
      .catch(error => console.error('Error fetching vehicles:', error));
  }, [setVehicles]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'x') {
      // Validate X-position
      const newX = parseInt(value);
      if (newX > 800 || newX < 0) {
        setXError('Position X should be between 0 and 800');
      } else {
        setXError('');
      }
    } else if (name === 'y') {
      // Validate Y-position
      const newY = parseInt(value);
      if (newY > 800 || newY < 0) {
        setYError('Position Y should be between 0 and 800');
      } else {
        setYError('');
      }
    }

    setVehicle(prevVehicle => ({ ...prevVehicle, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there are errors in X or Y positions
    if (xError || yError) {
      console.log('Position errors detected. Vehicle details not sent to the backend.');
      setError('Position errors detected.');
      return; // Exit the function without submitting the form
    }

    const id = nextId; // Use the next available ID
    api.post('http://localhost:5000/vehicles', { ...vehicle, id })
      .then(response => {
        setVehicles(prevVehicles => [...prevVehicles, response.data]);
        setVehicle({ name: '', x: '', y: '', speed: '', direction: '', scenarioId: '' });
        setNextId(prevId => prevId + 1); // Increment the next available ID
      })
      .catch(error => console.error('Error creating vehicle:', error));
  };

  const handleReset = () => {
    setVehicle({ id: vehicle.id, name: '', x: '', y: '', speed: '', direction: '', scenarioId: '' });
  };

  const handleGoBack = () => {
    window.history.back(); // Navigate back to the previous page
  };

  return (
    <div className="vehicle-container">
  <h2>Add Vehicle</h2>
  <div className="form-fields">
  <div className="form-group">
      <label>Scenario:</label>
      <select name="scenarioId" value={vehicle.scenarioId} onChange={handleChange} required>
        <option value="">Select Scenario</option>
        {scenarios.map(scenario => (
          <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label>Vehicle Name:</label>
      <input type="text" name="name" placeholder='Vehicle Name' value={vehicle.name} onChange={handleChange} required />
    </div>
    <div className="form-group">
      <label>Speed:</label>
      <input type="number" name="speed" placeholder='Speed' value={vehicle.speed} onChange={handleChange} required />
    </div>
    <div className="form-group">
      <label>Initial Position X:</label>
      <input type="number" name="x" placeholder='Position X' value={vehicle.x} onChange={handleChange} required />
      {xError && <div className="error-message">{xError}</div>}
    </div>
    <div className="form-group">
      <label>Initial Position Y:</label>
      <input type="number" name="y" placeholder='Position Y' value={vehicle.y} onChange={handleChange} required />
      {yError && <div className="error-message">{yError}</div>}
    </div>
    
    <div className="form-group">
      <label>Direction:</label>
      <select name="direction" value={vehicle.direction} onChange={handleChange} required>
        <option value="">Select Direction</option>
        <option value="Towards">Towards</option>
        <option value="Backwards">Backwards</option>
        <option value="Upwards">Upwards</option>
        <option value="Downwards">Downwards</option>
      </select>
    </div>
    
  </div>
  <div>
          <button onClick={handleSubmit} type="submit" className="submit-button">Add</button>
          <button onClick={handleReset} type="button" className="reset-button">Reset</button>
          <button onClick={handleGoBack} type="button" className="goback-button">Go Back</button>
        </div>
  <p className="error-message">{error}</p>
</div>
  
  );
};

export default Vehicle;
