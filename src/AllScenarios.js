import React, { useState, useEffect } from 'react';
import api from './api';
import './AllScenarios.css';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';


const AllScenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const [vehicleCounts, setVehicleCounts] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedScenario, setEditedScenario] = useState({});
  const [open, setOpen] = useState(false); // State to control the visibility of the popup box

  useEffect(() => {
    // Fetch scenarios when the component mounts
    api.get('http://localhost:5000/scenarios')
      .then(response => {
        setScenarios(response.data);
        console.log('Scenarios:', response.data);
      })
      .catch(error => console.error('Error fetching scenarios:', error));

    // Fetch vehicle data to count the number of vehicles for each scenario
    api.get('http://localhost:5000/vehicles')
      .then(response => {
        const counts = {};
        response.data.forEach(vehicle => {
          counts[vehicle.scenarioId] = counts[vehicle.scenarioId] ? counts[vehicle.scenarioId] + 1 : 1;
        });
        setVehicleCounts(counts);
      })
      .catch(error => console.error('Error fetching vehicles:', error));
  }, []);
 
  const handleNewScenario = () => {
    window.location.href = '/createScenario'; // Navigate to the createScenario route
  };

  const handleAddVehicle = () => {
    window.location.href = '/createVehicle'; // Navigate to the addVehicle route
  };

  const handleEdit = (scenario) => {
    setEditMode(true);
    setEditedScenario({ ...scenario, scenarioId: scenario._id });
  };

  const handleUpdate = () => {

    api.put(`http://localhost:5000/scenarios/${editedScenario.id}`, editedScenario)
    .then(response => {
      // Update state with the new data returned from the server
      const updatedData = response.data;
      const updatedScenarios = scenarios.map(scenario => {
        if (scenario.id === updatedData.id) {
          return updatedData;
        }
        return scenario;
      });
      setScenarios(updatedScenarios);
      setEditMode(false);
      console.log('Updated scenario:', updatedData);
    })
  .catch(error => console.error('Error updating scenario:', error));
   
    console.log("Edited Scenario:", editedScenario);
  
  };


  const handleDelete = (id) => {
    api.delete(`http://localhost:5000/scenarios/${id}`)
      .then(response => {
        // Filter out the deleted scenario from the state
        const filteredScenarios = scenarios.filter(scenario => scenario.id !== id);
        setScenarios(filteredScenarios);
        console.log('Scenario deleted:', id);
      })
      .catch(error => console.error('Error deleting scenario:', error));
  };
  

  const handleDeleteAll = () => {
    // Make a DELETE request to delete all scenarios
    axios.delete('http://localhost:5000/scenarios')
      .then(response => {
        console.log('All scenarios deleted:', response.data);
        // After scenarios are deleted, make a DELETE request to delete all vehicles
        axios.delete('http://localhost:5000/vehicles')
          .then(response => {
            console.log('All vehicles deleted:', response.data);
            // Update the component state to reflect the changes
            setScenarios([]);
            setVehicleCounts({});
            // Optionally, perform any additional actions after both scenarios and vehicles are deleted
          })
          .catch(error => {
            console.error('Error deleting all vehicles:', error);
          });
      })
      .catch(error => {
        console.error('Error deleting all scenarios:', error);
      });
  };
  
  return (
    <div className="all-scenarios-container">
      <h2>All Scenarios</h2>
      <div className="action-buttons">
        <button className="new-scenario-button" onClick={handleNewScenario}>New Scenario</button>
        <button className="add-vehicle-button" onClick={handleAddVehicle}>Add Vehicle</button>   
        <button className="delete-all-button" onClick={handleDeleteAll}>Delete All</button>
      </div>
      <table className="all-scenarios-table">
        <thead>
          <tr>
            <th>Scenario ID</th>
            <th>Scenario Name</th>
            <th>Scenario Time</th>
            <th>Number of Vehicles</th>
            <th>Add Vehicle</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map(scenario => (
            <tr key={scenario.id}>
              <td>{scenario.id}</td>
              <td>{scenario.name}</td>
              <td>{scenario.time}s</td>
              {/* Display the count of vehicles for the scenario */}
              <td>{vehicleCounts[scenario.id] || 0}</td>
              <td>
                <svg onClick={handleAddVehicle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                  <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                </svg>
              </td>
              <td>
                <svg onClick={() => handleEdit(scenario)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                  <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
                </svg>
              </td>
              <td>
        <svg onClick={() => handleDelete(scenario.id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
        </svg>
      </td>
      </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={editMode} onClose={() => setEditMode(false)}>
        <DialogTitle>Edit Scenario</DialogTitle>
        <DialogContent>
          <TextField
            label="Scenario Name"
            type="text"
            name="scenarioName"
            value={editedScenario.name}
            onChange={(e) => setEditedScenario({ ...editedScenario, name: e.target.value })}
            variant="outlined"
            margin="normal"
            required
          />
          <TextField
            label="Scenario Time"
            type="text"
            name="scenarioTime"
            value={editedScenario.time}
            onChange={(e) => setEditedScenario({ ...editedScenario, time: e.target.value })}
            variant="outlined"
            margin="normal"
            required
          />
         

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllScenarios;