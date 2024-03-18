const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 5000; // Set the port number

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle stopping the service
app.post('/stop-service', (req, res) => {
  const { Name } = req.body; // Extract the service name from the request body
  const powershellCommand = `powershell Stop-Service -Name "${Name}"`;

  exec(powershellCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error stopping service:', error);
      res.status(500).send('Error stopping service');
      return;
    }
    console.log('Service stopped successfully.');
    res.send('Service stopped successfully');
  });
});

// Endpoint to handle stopping the service
app.post('/start-service', (req, res) => {
    const { Name } = req.body; // Extract the service name from the request body
    const powershellCommand = `powershell Start-Service -Name "${Name}"`;
  
    exec(powershellCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Error stopping service:', error);
        res.status(500).send('Error stopping service');
        return;
      }
      console.log('Service started successfully.');
      res.send('Service started successfully');
    });
  });

// Endpoint to handle stopping the service
app.post('/restart-service', (req, res) => {
    const { Name } = req.body; // Extract the service name from the request body
    const powershellCommand = `powershell Restart-Service -Name "${Name}"`;
  
    exec(powershellCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Error stopping service:', error);
        res.status(500).send('Error stopping service');
        return;
      }
      console.log('Service restarted successfully.');
      res.send('Service restarted successfully');
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
