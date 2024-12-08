const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://admin353:project353@edgesystems.4ulnz.mongodb.net/";

// CREATE a new room with water heating status
async function createWaterHeating(roomData) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect(); // connect to database
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems"); // name of the database
        const collection = database.collection("WaterHeating"); // name of collection(table)

        // Check if the room already exists
        const existingRoom = await collection.findOne({ roomName: roomData.roomName });

        if (existingRoom) {
            console.log("Room already exists");
            return;
        }

        // Insert new room data
        await collection.insertOne(roomData);
        console.log("Room water heating created successfully");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await client.close();
    }
}

// READ a room's water heating status by room name
async function findWaterHeating(roomName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("WaterHeating");

        // Find the room based on its name
        const room = await collection.findOne({ roomName: roomName });

        if (room) {
            console.log("Room found:", room);
            return room;
        } else {
            console.log("Room not found");
            return null;
        }
    } catch (e) {
        console.error("Error:", e);
        return null;
    } finally {
        await client.close();
    }
}

// UPDATE the water heating status of a room
async function updateWaterHeating(roomName, newStatus) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Validate input: Ensure newStatus is "On" or "Off"
    if (!["On", "Off"].includes(newStatus)) {
        console.log("Invalid status. Use 'On' or 'Off'.");
        return false;
    }

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("WaterHeating");

        // Update the water heating status
        const result = await collection.updateOne(
            { roomName: roomName },
            { $set: { heating: newStatus } }
        );

        if (result.modifiedCount > 0) {
            console.log("Room water heating updated successfully");
            return true;
        } else {
            console.log("No room found to update");
            return false;
        }
    } catch (e) {
        console.error("Error:", e);
        return false;
    } finally {
        await client.close();
    }
}

// DELETE a room's water heating entry by room name
async function deleteWaterHeating(roomName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("WaterHeating");

        // Delete the room's water heating entry
        const result = await collection.deleteOne({ roomName: roomName });

        if (result.deletedCount > 0) {
            console.log("Room water heating deleted successfully");
            return true;
        } else {
            console.log("No room found with the provided name");
            return false;
        }
    } catch (e) {
        console.error("Error:", e);
        return false;
    } finally {
        await client.close();
    }
}

// Fetch all room states
async function fetchAllRoomStates() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("WaterHeating");

        // Fetch all rooms and their states
        const rooms = await collection.find({}).toArray();
        const roomStates = rooms.reduce((acc, room) => {
            acc[room.roomName] = room.heating; // "On" or "Off"
            return acc;
        }, {});

        console.log(roomStates); // shows in an array the states of each room
        return roomStates;
    } catch (err) {
        console.error("Error fetching room states:", err);
        throw err;
    } finally {
        await client.close();
    }
}


// Example Usage
const roomData = {
    roomName: "master",
    heating: "Off" // "On" or "Off"
};

// Add a new room
//createWaterHeating(roomData);
///*
// Fetch a room's status
//findWaterHeating("Master");

// Update a room's status
//updateWaterHeating("master", "On");

// Delete a room
//deleteWaterHeating("Master");
//*/
//fetchAllRoomStates();

module.exports = {
    createWaterHeating,
    findWaterHeating,
    updateWaterHeating,
    deleteWaterHeating,
    fetchAllRoomStates, // Export the new function
};