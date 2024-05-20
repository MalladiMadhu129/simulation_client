import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import './Home.css';
import api from './api';

const Home = () => {
  const [selectedScenario, setSelectedScenario] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState({
    id: '',
    name: '',
    x: '',
    y: '',
    speed: '',
    direction: ''
  });
  const [simulationRunning, setSimulationRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch scenarios when the component mounts
    api.get('http://localhost:5000/scenarios')
      .then(response => {
        setScenarios(response.data);
        console.log('Scenarios:', response.data);
      })
      .catch(error => console.error('Error fetching scenarios:', error));

    if (selectedScenario) {
      api.get('http://localhost:5000/vehicles')
        .then(response => {
          const scenarioVehicles = response.data.filter(vehicle => vehicle.scenarioId === selectedScenario);
          console.log('selectedScenario', selectedScenario);
          setVehicles(scenarioVehicles);
        })
        .catch(error => console.error('Error fetching vehicles:', error));
    } else {
      setVehicles([]);
    }
  }, [selectedScenario]);

  const handleScenarioChange = (e) => {
    setSelectedScenario(e.target.value);
  };

  const handleEdit = (vehicle) => {
    setEditedVehicle(vehicle);
    setEditMode(true);
  };

  const handleUpdate = () => {
    api.put(`http://localhost:5000/vehicles/${editedVehicle.id}`, editedVehicle)
      .then(response => {
        setVehicles(prevVehicles => prevVehicles.map(vehicle =>
          vehicle.id === editedVehicle.id ? editedVehicle : vehicle
        ));
        setEditMode(false);
      })
      .catch(error => console.error('Error updating vehicle:', error));
  };

  const handleDelete = (id) => {
    api.delete(`http://localhost:5000/vehicles/${id}`)
      .then(response => {
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id));
        console.log('Vehicle deleted:', id);
      })
      .catch(error => console.error('Error deleting vehicle:', error));
  };

  const startSimulation = () => {
    setSimulationRunning(true);
    intervalRef.current = setInterval(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => {
          // Calculate new position based on direction and speed
          let { x, y, speed, direction } = vehicle;
          switch (direction) {
            case 'Towards':
              x += speed;
              break;
            case 'Backwards':
              x -= speed;
              break;
            case 'Upwards':
              y -= speed;
              break;
            case 'Downwards':
              y += speed;
              break;
            default:
              break;
          }

          // Hide vehicle if it goes outside the container
          if (x < 0 || x > 800 || y < 0 || y > 800) {
            return { ...vehicle, hidden: true };
          }

          return { ...vehicle, x, y };
        })
      );
    }, 100); // Update every 100ms
  };

  const stopSimulation = () => {
    setSimulationRunning(false);
    clearInterval(intervalRef.current);
  };

  function generateColor(id) {
    // Generate a color based on the ID
    const hue = (id * 137.5) % 360; // Change the multiplier as needed for different colors
    return `hsl(${hue}, 70%, 70%)`; // Use HSL color space for better variation
  }
  


  return (
    <div className="home">
      <h1>Simulation Home</h1>
      <div className="controls">
        <label htmlFor="scenario-select">Select Scenario:</label>
        <select id="scenario-select" onChange={handleScenarioChange}>
          <option value="">Select a Scenario</option>
          {scenarios.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
          ))}
        </select>
        

          
      
      </div>
      <table className="all-scenarios-table">
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>Vehicle Name</th>
            <th>Position X</th>
            <th>Position Y</th>
            <th>Speed</th>
            <th>Direction</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>{vehicle.name}</td>
              <td>{vehicle.x}</td>
              <td>{vehicle.y}</td>
              <td>{vehicle.speed}</td>
              <td>{vehicle.direction}</td>
              <td>
                <svg onClick={() => handleEdit(vehicle)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                  <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
                </svg>
              </td>
              <td>
                <svg onClick={() => handleDelete(vehicle.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
                  <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-container">
  <button className="start" onClick={startSimulation}>Start Simulation</button>
  <button className="stop" onClick={stopSimulation}>Stop Simulation</button>
</div>
      <Dialog open={editMode} onClose={() => setEditMode(false)}>
      <DialogTitle>Edit Vehicle</DialogTitle>
      <DialogContent>
        <TextField
          label="Vehicle ID"
          type="text"
          name="id"
          value={editedVehicle.id}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, id: e.target.value })}
          variant="outlined"
          margin="normal"
          required
          disabled
          fullWidth
        />
        <TextField
          label="Vehicle Name"
          type="text"
          name="name"
          value={editedVehicle.name}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, name: e.target.value })}
          variant="outlined"
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Position X"
          type="number"
          name="x"
          value={editedVehicle.x}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, x: e.target.value })}
          variant="outlined"
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Position Y"
          type="number"
          name="y"
          value={editedVehicle.y}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, y: e.target.value })}
          variant="outlined"
          margin="normal"
          required
          fullWidth
        />
        <TextField
          label="Speed"
          type="number"
          name="speed"
          value={editedVehicle.speed}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, speed: e.target.value })}
          variant="outlined"
          margin="normal"
          required
          fullWidth
        />
         <FormControl fullWidth variant="outlined" margin="normal" required>
          <InputLabel>Direction</InputLabel>
          <Select
            value={editedVehicle.direction}
            onChange={(e) => setEditedVehicle({ ...editedVehicle, direction: e.target.value })}
            label="Direction"
          >
            <MenuItem value="Towards">Towards</MenuItem>
            <MenuItem value="Backwards">Backwards</MenuItem>
            <MenuItem value="Upwards">Upwards</MenuItem>
            <MenuItem value="Downwards">Downwards</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Scenario ID"
          type="number"
          name="scenarioId"
          value={editedVehicle.scenarioId}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, scenarioId: e.target.value })}
          variant="outlined"
          margin="normal"
          required
          fullWidth
        />
      </DialogContent>
      <DialogActions>
      <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Save Changes</Button>
      </DialogActions>
    </Dialog>
      <div className="graph-container">
        {vehicles.map(vehicle => (
  !vehicle.hidden && (
    <div
      key={vehicle.id}
      className="vehicle"
      style={{
        left: `${vehicle.x}px`,
        top: `${vehicle.y}px`,
        backgroundColor: generateColor(vehicle.id), // Generate unique color based on ID
      }}
    >
      {Math.round(vehicle.id)} {/* Round the ID */}
    </div>
  )
))}

      </div>
    </div>
  );
};

export default Home;
