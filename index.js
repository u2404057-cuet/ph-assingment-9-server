const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        const db = client.db("driveFleet");
        const carsCollection = db.collection("cars");

        app.post("/cars", async (req, res) => {
            const carData = req.body;
            const result = await carsCollection.insertOne(carData);
            res.send(result);
        })

        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is running");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});