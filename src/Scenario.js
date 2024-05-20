import React, { useState, useEffect } from 'react';
import api from './api';
import './Scenario.css'; // Import the CSS file

const Scenario = ({ setScenarios }) => {
  const [scenario, setScenario] = useState({
    id: 0, // Initialize ID to 0
    name: '',
    time: ''
  });

  const [nameError, setNameError] = useState('');
  const [timeError, setTimeError] = useState('');

  useEffect(() => {
    // Fetch the last used ID from the backend when the component mounts
    api.get('http://localhost:5000/scenarios/last-id')
      .then(response => {
        const lastId = response.data.lastId || 0; // Get the last used ID or default to 0
        setScenario(prevScenario => ({ ...prevScenario, id: lastId + 1 })); // Set the next available ID
      })
      .catch(error => console.error('Error fetching last scenario ID:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScenario(prevScenario => ({ ...prevScenario, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scenario.name) {
      setNameError('Scenario name is required');
      return;
    }
    if (!scenario.time) {
      setTimeError('Time is required');
      return;
    }

    api.post('http://localhost:5000/scenarios', { ...scenario })
      .then(response => {
        setScenarios(prevScenarios => [...prevScenarios, response.data]);
        setScenario({ id: scenario.id + 1, name: '', time: '' }); // Increment ID for the next scenario
        setNameError(''); // Clear name error message
        setTimeError(''); // Clear time error message
      })
      .catch(error => console.error('Error creating scenario:', error));
  };
  
  const handleReset = () => {
    setScenario({ id: scenario.id, name: '', time: '' });
    setNameError('');
    setTimeError('');
  };

  const handleGoBack = () => {
    window.history.back(); // Navigate back to the previous page
  };

  return (
    <div className="scenario-container"> {/* Apply the CSS class */}
      <h2>Add Scenario</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Scenario Name</label>
          <input type="text" name="name" placeholder='Text Scenario' value={scenario.name} onChange={handleChange} required />
          {nameError && <p className="error-message">{nameError}</p>}
        </div>
        <div className="input-group">
          <label>Scenario Time (Seconds)</label>
          <input type="text" name="time" placeholder='Scenario Time' value={scenario.time} onChange={handleChange} required />
          {timeError && <p className="error-message">{timeError}</p>}
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">Create</button>
          <button type="button" onClick={handleReset} className="reset-button">Reset</button>
          <button type="button" onClick={handleGoBack} className="goback-button">Go Back</button>
        </div>
      </form>
    </div>
  );
};

export default Scenario;
