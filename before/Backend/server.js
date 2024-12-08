const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { // functions from water.js
    createWaterHeating, 
    findWaterHeating, 
    updateWaterHeating, 
    deleteWaterHeating, 
    fetchAllRoomStates 
} = require('./water');

const { // functions from alarms.js
    createAlarm,
    findAlarm,
    updateAlarm,
    deleteAlarm,
    fetchAllAlarms,
} = require('./alarms');

const { // functions from lights.js
    createLight,
    findLight,
    updateLight,
    deleteLight,
    fetchAllLights,
} = require('./lights');

const { 
    createHeating, 
    findHeating, 
    incrementTemperature, 
    decrementTemperature, 
    deleteHeating, 
    fetchAllHeating 
} = require('./heating');

// the authentication functions
const { registerUser, loginUser } = require('./auth');  


const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// ---------------------------- Authentication Routes -----------------------------

// User signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const result = await registerUser({ username, email, password });

        if (result.success) {
            res.json({ success: true, message: result.message });
        } else {
            res.json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// User login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Assume "username" is email for simplicity

    try {
        const result = await loginUser(username, password);

        if (result.success) {
            res.json({ success: true, message: "Login successful!" });
        } else {
            res.json({ success: false, message: result.message }); // Send failure message
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


//----------------------- Endpoints for water heating -------------------------------

// Create a new room
app.post('/api/room', async (req, res) => {
    const { roomName, isHeatingOn } = req.body;

    if (!roomName || !["On", "Off"].includes(isHeatingOn)) {
        return res.status(400).json({ error: "Invalid input. Provide 'roomName' and 'isHeatingOn' as 'On' or 'Off'." });
    }

    try {
        await createWaterHeating({ roomName, isHeatingOn });
        res.status(201).json({ message: "Room created successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create room." });
    }
});

// Get a room's heating status
app.get('/api/room/:roomName', async (req, res) => {
    const roomName = req.params.roomName;

    try {
        const room = await findWaterHeating(roomName);

        if (room) {
            res.status(200).json(room);
        } else {
            res.status(404).json({ error: "Room not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve room." });
    }
});



// Update a room's heating status
app.put('/api/room/:roomName', async (req, res) => {
    const roomName = req.params.roomName;
    const { heating } = req.body;

    //console.log("Received room name:", roomName);  // Logs the room name
    //console.log("Received heating status:", heating);  // Logs the heating status



    if (!["On", "Off"].includes(heating)) {
        return res.status(400).json({ error: "Invalid status. Use 'On' or 'Off'." });
    }

    try {
        const success = await updateWaterHeating(roomName, heating);

        if (success) {
            res.status(200).json({ message: "Room updated successfully." });
        } else {
            res.status(404).json({ error: "Room not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update room." });
    }
});

// Delete a room
app.delete('/api/room/:roomName', async (req, res) => {
    const roomName = req.params.roomName;

    try {
        const success = await deleteWaterHeating(roomName);

        if (success) {
            res.status(200).json({ message: "Room deleted successfully." });
        } else {
            res.status(404).json({ error: "Room not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete room." });
    }
});


// Get all room states
app.get('/api/room-states', async (req, res) => {
    try {
        const roomStates = await fetchAllRoomStates();
        console.log(roomStates);
        res.status(200).json(roomStates);
    } catch (err) {
        console.error("Failed to retrieve room states:", err);
        res.status(500).json({ error: "Failed to retrieve room states." });
    }
});

//-------------------------- Endpoints for Alarms-----------------------

// Create a new alarm
app.post('/api/alarm', async (req, res) => {
    const { alarmName, status } = req.body;

    if (!alarmName || !["Active", "Inactive"].includes(status)) {
        return res.status(400).json({ error: "Invalid input. Provide 'alarmName' and 'status' as 'Active' or 'Inactive'." });
    }

    try {
        await createAlarm({ alarmName, status });
        res.status(201).json({ message: "Alarm created successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create alarm." });
    }
});

// Get an alarm's status by name
app.get('/api/alarm/:alarmName', async (req, res) => {
    const alarmName = req.params.alarmName;

    try {
        const alarm = await findAlarm(alarmName);

        if (alarm) {
            res.status(200).json(alarm);
        } else {
            res.status(404).json({ error: "Alarm not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve alarm." });
    }
});

// Update an alarm's status
app.put('/api/alarm/:alarmName', async (req, res) => {
    const alarmName = req.params.alarmName;
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use 'Active' or 'Inactive'." });
    }

    try {
        const success = await updateAlarm(alarmName, status);

        if (success) {
            res.status(200).json({ message: "Alarm updated successfully." });
        } else {
            res.status(404).json({ error: "Alarm not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update alarm." });
    }
});

// Delete an alarm
app.delete('/api/alarm/:alarmName', async (req, res) => {
    const alarmName = req.params.alarmName;

    try {
        const success = await deleteAlarm(alarmName);

        if (success) {
            res.status(200).json({ message: "Alarm deleted successfully." });
        } else {
            res.status(404).json({ error: "Alarm not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete alarm." });
    }
});

// Get all alarm states
app.get('/api/alarms', async (req, res) => {
    try {
        const alarmStates = await fetchAllAlarms();
        console.log(alarmStates);
        res.status(200).json(alarmStates);
    } catch (err) {
        console.error("Failed to retrieve alarm states:", err);
        res.status(500).json({ error: "Failed to retrieve alarm states." });
    }
});


//-------------------------- Endpoints for Lights -----------------------

// Create a new light
app.post('/api/light', async (req, res) => {
    const { lightName, status } = req.body;

    if (!lightName || !["On", "Off"].includes(status)) {
        return res.status(400).json({ error: "Invalid input. Provide 'lightName' and 'status' as 'On' or 'Off'." });
    }

    try {
        await createLight({ lightName, status });
        res.status(201).json({ message: "Light created successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create light." });
    }
});

// Get a light's status by name
app.get('/api/light/:lightName', async (req, res) => {
    const lightName = req.params.lightName;

    try {
        const light = await findLight(lightName);

        if (light) {
            res.status(200).json(light);
        } else {
            res.status(404).json({ error: "Light not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve light." });
    }
});

// Update a light's status
app.put('/api/light/:lightName', async (req, res) => {
    const lightName = req.params.lightName;
    const { status } = req.body;

    if (!["On", "Off"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Use 'On' or 'Off'." });
    }

    try {
        const success = await updateLight(lightName, status);

        if (success) {
            res.status(200).json({ message: "Light updated successfully." });
        } else {
            res.status(404).json({ error: "Light not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update light." });
    }
});

// Delete a light
app.delete('/api/light/:lightName', async (req, res) => {
    const lightName = req.params.lightName;

    try {
        const success = await deleteLight(lightName);

        if (success) {
            res.status(200).json({ message: "Light deleted successfully." });
        } else {
            res.status(404).json({ error: "Light not found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete light." });
    }
});

// Get all light states
app.get('/api/lights', async (req, res) => {
    try {
        const lightStates = await fetchAllLights();
        console.log(lightStates);
        res.status(200).json(lightStates);
    } catch (err) {
        console.error("Failed to retrieve light states:", err);
        res.status(500).json({ error: "Failed to retrieve light states." });
    }
});


//----------------------- Endpoints for Heating -------------------------------

// Endpoint to create a new heating system
app.post('/heating', async (req, res) => {
    const { heatingName, temperature } = req.body;

    if (!heatingName || temperature === undefined) {
        return res.status(400).json({ error: "Missing heatingName or temperature" });
    }

    try {
        await createHeating({ heatingName, temperature });
        res.status(201).json({ message: "Heating system created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating heating system" });
    }
});

// Endpoint to get a heating system by name
app.get('/heating/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const heating = await findHeating(name);
        if (heating) {
            res.status(200).json(heating);
        } else {
            res.status(404).json({ error: "Heating system not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching heating system" });
    }
});

// Endpoint to increment the temperature of a heating system
app.patch('/heating/:name/increment', async (req, res) => {
    const { name } = req.params;

    try {
        const updatedHeating = await incrementTemperature(name);
        if (updatedHeating) {
            res.status(200).json(updatedHeating);
        } else {
            res.status(404).json({ error: "Heating system not found or already at maximum temperature" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error incrementing temperature" });
    }
});

// Endpoint to decrement the temperature of a heating system
app.patch('/heating/:name/decrement', async (req, res) => {
    const { name } = req.params;

    try {
        const updatedHeating = await decrementTemperature(name);
        if (updatedHeating) {
            res.status(200).json(updatedHeating);
        } else {
            res.status(404).json({ error: "Heating system not found or already at minimum temperature" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error decrementing temperature" });
    }
});

// Endpoint to delete a heating system
app.delete('/heating/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const success = await deleteHeating(name);
        if (success) {
            res.status(200).json({ message: "Heating system deleted successfully" });
        } else {
            res.status(404).json({ error: "Heating system not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting heating system" });
    }
});

// Endpoint to fetch all heating systems and their temperatures
app.get('/heating', async (req, res) => {
    try {
        const heatingData = await fetchAllHeating();
        res.status(200).json(heatingData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching heating systems" });
    }
});


// Default Route 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');  // Assuming you have a login page to serve
});

//-------------------------- Server Setup -----------------------
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//git pull --no-rebase origin test