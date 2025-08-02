const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
const bodyparser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000

app.use(bodyparser.json())
app.use(cors())
dotenv.config()

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
client.connect();

// Database Name
const dbName = 'passman';

//Get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})
//Save a Password
app.post('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({ sucess: true, result: findResult });
})
//Delete a Password  by site name
app.delete('/', async (req, res) => {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    res.send({ sucess: true, result: findResult });
})
//Edit password by site name
app.put('/', async (req, res) => {
    const updatedData = req.body;
    if (!updatedData.site) {
        return res.status(400).send({ success: false, error: "Site is required for update." });
    }
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        // Remove _id before update to avoid immutable field error
        const { site, _id, ...fieldsToUpdate } = updatedData;

        const result = await collection.updateOne(
            { site },                      // Find by unique site
            { $set: fieldsToUpdate }       // Only set updatable fields
        );
        res.send({ success: true, result });
    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).send({ success: false, error: err.message });
    }
});



app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})