const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://admin353:project353@edgesystems.4ulnz.mongodb.net/";

// CREATE a new light
async function createLight(lightData) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("Lighting");

        // Check if the light already exists
        const existingLight = await collection.findOne({ lightName: lightData.lightName });

        if (existingLight) {
            console.log("Light already exists");
            return;
        }

        // Insert new light data
        await collection.insertOne(lightData);
        console.log("Light created successfully");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await client.close();
    }
}

// READ a light by name
async function findLight(lightName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("Lighting");

        // Find the light based on its name
        const light = await collection.findOne({ lightName: lightName });

        if (light) {
            console.log("Light found:", light);
            return light;
        } else {
            console.log("Light not found");
            return null;
        }
    } catch (e) {
        console.error("Error:", e);
        return null;
    } finally {
        await client.close();
    }
}

// UPDATE a light's status
async function updateLight(lightName, newStatus) {
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
        const collection = database.collection("Lighting");

        // Update the light status
        const result = await collection.updateOne(
            { lightName: lightName },
            { $set: { status: newStatus } }
        );

        if (result.modifiedCount > 0) {
            console.log("Light updated successfully");
            return true;
        } else {
            console.log("No light found to update");
            return false;
        }
    } catch (e) {
        console.error("Error:", e);
        return false;
    } finally {
        await client.close();
    }
}

// DELETE a light by name
async function deleteLight(lightName) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("Lighting");

        // Delete the light entry
        const result = await collection.deleteOne({ lightName: lightName });

        if (result.deletedCount > 0) {
            console.log("Light deleted successfully");
            return true;
        } else {
            console.log("No light found with the provided name");
            return false;
        }
    } catch (e) {
        console.error("Error:", e);
        return false;
    } finally {
        await client.close();
    }
}

// Fetch all light states
async function fetchAllLights() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("EdgeSystems");
        const collection = database.collection("Lighting");

        // Fetch all lights and their states
        const lights = await collection.find({}).toArray();
        const lightStates = lights.reduce((acc, light) => {
            acc[light.lightName] = light.status; // "On" or "Off"
            return acc;
        }, {});

        console.log(lightStates); // shows in an object the states of each light
        return lightStates;
    } catch (err) {
        console.error("Error fetching light states:", err);
        throw err;
    } finally {
        await client.close();
    }
}

// Example usage of data
const lightData = {
    lightName: "living",
    status: "Off" // "On" or "Off"
};

// Add a new light
//createLight(lightData);

// Fetch a light's status
//findLight("kitchen");

// Update a light's status
//updateLight("kitchen", "On");

// Delete a light
//deleteLight("Kitchen");

// Fetch all lights
//fetchAllLights();

module.exports = { // to export all functions
    createLight,
    findLight,
    updateLight,
    deleteLight,
    fetchAllLights, 
};
