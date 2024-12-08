const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://admin353:project353@edgesystems.4ulnz.mongodb.net/";

// CREATE a new alarm
async function createAlarm(alarmData) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect(); // connect to database
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems"); // name of the database
        const collection = database.collection("Alarms"); // name of collection

        // Check if the alarm already exists
        const existingAlarm = await collection.findOne({ alarmName: alarmData.alarmName });

        if (existingAlarm) {
            console.log("Alarm already exists");
            return;
        }

        // Insert new alarm data
        await collection.insertOne(alarmData);
        console.log("Alarm created successfully");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await client.close();
    }
}

// READ an alarm by name
async function findAlarm(alarmName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("Alarms");

        // Find the alarm based on its name
        const alarm = await collection.findOne({ alarmName: alarmName });

        if (alarm) {
            console.log("Alarm found:", alarm);
            return alarm;
        } else {
            console.log("Alarm not found");
            return null;
        }
    } catch (e) {
        console.error("Error:", e);
        return null;
    } finally {
        await client.close();
    }
}

// UPDATE an alarm's status
async function updateAlarm(alarmName, newStatus) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Validate input: Ensure newStatus is "Active" or "Inactive"
    if (!["Active", "Inactive"].includes(newStatus)) {
        console.log("Invalid status. Use 'Active' or 'Inactive'.");
        return false;
    }

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("Alarms");

        // Update the alarm status
        const result = await collection.updateOne(
            { alarmName: alarmName },
            { $set: { status: newStatus } }
        );

        if (result.modifiedCount > 0) {
            console.log("Alarm updated successfully");
            return true;
        } else {
            console.log("No alarm found to update");
            return false;
        }
    } catch (e) {
        console.error("Error:", e);
        return false;
    } finally {
        await client.close();
    }
}

// DELETE an alarm by name
async function deleteAlarm(alarmName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("Alarms");

        // Delete the alarm entry
        const result = await collection.deleteOne({ alarmName: alarmName });

        if (result.deletedCount > 0) {
            console.log("Alarm deleted successfully");
            return true;
        } else {
            console.log("No alarm found with the provided name");
            return false;
        }
    } catch (e) {
        console.error("Error:", e);
        return false;
    } finally {
        await client.close();
    }
}

// Fetch all alarm states
async function fetchAllAlarms() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("Alarms");

        // Fetch all alarms and their states
        const alarms = await collection.find({}).toArray();
        const alarmStates = alarms.reduce((acc, alarm) => {
            acc[alarm.alarmName] = alarm.status; // "Active" or "Inactive"
            return acc;
        }, {});

        console.log(alarmStates); // shows in an object the states of each alarm
        return alarmStates;
    } catch (err) {
        console.error("Error fetching alarm states:", err);
        throw err;
    } finally {
        await client.close();
    }
}

// Example usage of data
const alarmData = {
    alarmName: "entrance",
    status: "Inactive" // "Active" or "Inactive"
};

// Add a new alarm
//createAlarm(alarmData);
///*
// Fetch an alarm's status
//findAlarm("master");

// Update an alarm's status
//updateAlarm("guest", "Active");

// Delete an alarm
//deleteAlarm("Master");
//*/
//fetchAllAlarms();


module.exports = { // to export our functions
    createAlarm,
    findAlarm,
    updateAlarm,
    deleteAlarm,
    fetchAllAlarms, 
};
