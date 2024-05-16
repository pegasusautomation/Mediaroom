const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 5000; // Set the port number

// Middleware to parse JSON bodies
app.use(bodyParser.json());

let isExecutingStatusScript = false; // Flag to track script execution status

// Endpoint to handle getting service status
app.post('/getstatus-service', (req, res) => {
  if (isExecutingStatusScript) {
    // If the script is already executing, return a 503 Service Unavailable response
    res.status(503).send('Service status script is already executing. Please wait.');
    return;
  }

  isExecutingStatusScript = true; // Set the flag to true to indicate script execution
  const powershellCommand = `powershell.exe -File C:/Mediaroom/src/mrserverdeatils.ps1`;

  exec(powershellCommand, (error, stdout, stderr) => {
    isExecutingStatusScript = false; // Reset the flag after script execution
    if (error) {
      console.error('Error getting service status:', error);
      res.status(500).send('Error getting service status');
      return;
    }

    // Log the status received from PowerShell script
    console.log('Service status:', stdout);

    // Assuming your PowerShell script returns the status, you can send it back as response
    res.send("Service status updated successfully");
  });
});


// Endpoint to handle stopping the service
app.post('/stop-service', (req, res) => {
  const { roleName } = req.body;// Extract the service name from the request body
  const { computerName } = req.body;
  const { message } = req.body;
  // const powershellCommand = `powershell Stop-Service -Name "${Name}"`;
  // Construct the PowerShell command with the service name as an argument
  // const powershellCommand = `powershell.exe -File C:/Mediaroom/src/stopps.ps1`;
  const powershellCommand = `powershell.exe -File C:/Mediaroom/src/stopdomainservice.ps1 -ComputerName "${computerName}" -ServiceName "${roleName}" -Message "${message}"`;

  exec(powershellCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error stopping service:', error);
      res.status(500).send('Error stopping service');
      return;
    }
    console.log('Service stopped successfully.');
    res.send('Service stoped successfully');
  });
});

// Endpoint to handle stopping the service
app.post('/start-service', (req, res) => {
  const { roleName } = req.body;// Extract the service name from the request body
  const { computerName } = req.body;
  const { message } = req.body;
  const powershellCommand = `powershell.exe -File C:/Mediaroom/src/startdomainservice.ps1 -ComputerName "${computerName}" -ServiceName "${roleName}" -Message "${message}"`;  
    exec(powershellCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Error starting service:', error);
        res.status(500).send('Error starting service');
        return;
      }
      console.log('Service started successfully.');
      res.send('Service started successfully');
    });
  });

// Endpoint to handle stopping the service
app.post('/restart-service', (req, res) => {
    const { roleName } = req.body; // Extract the service name from the request body
	const { computerName } = req.body;
	 const { message } = req.body;
    const powershellCommand = `powershell.exe -File C:/Mediaroom/src/restartdomainservice.ps1 -ComputerName "${computerName}" -ServiceName "${roleName}" -Message "${message}"`;
  
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

  // Endpoint to handle stopping the service
app.post('/stopall-services', (req, res) => {
  const { roleName } = req.body;// Extract the service name from the request body
  const { computerName } = req.body;
  const { message } = req.body;
  const powershellCommand = `powershell.exe -File C:/Mediaroom/src/stopAllDomainServices.ps1 -ComputerName "${computerName}" -Message "${message}"`;

  exec(powershellCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error stopping services:', error);
      res.status(500).send('Error stopping services');
      return;
    }
    console.log('Services stopped successfully.');
    res.send('Services stopped successfully');
  });
});

  // Endpoint to handle stopping the service
  app.post('/startall-services', (req, res) => {
    const { roleName } = req.body;// Extract the service name from the request body
    const { computerName } = req.body;
	const { message } = req.body;
    const powershellCommand = `powershell.exe -File C:/Mediaroom/src/startAllDomainServices.ps1 -ComputerName "${computerName}" -Message "${message}"`;
  
    exec(powershellCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Error stopping services:', error);
        res.status(500).send('Error stopping services');
        return;
      }
      console.log('Services stopped successfully.');
      res.send('Services stopped successfully');
    });
  });

    // Endpoint to handle stopping the service
app.post('/restartall-services', (req, res) => {
  const { roleName } = req.body;// Extract the service name from the request body
  const { computerName } = req.body;
  const { message } = req.body;
  const powershellCommand = `powershell.exe -File C:/Mediaroom/src/restartAllDomainServices.ps1 -ComputerName "${computerName}" -ServiceName "${roleName} -Message "${message}"`;

  exec(powershellCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error stopping services:', error);
      res.status(500).send('Error stopping services');
      return;
    }
    console.log('Services stopped successfully.');
    res.send('Services stopped successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
