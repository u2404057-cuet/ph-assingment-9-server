const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        app.get("/cars", async (req, res) => {
            const cursor = carsCollection.find();
            const cars = await cursor.toArray();
            res.send(cars);
        })

        app.get("/cars/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carsCollection.findOne(query);
            res.send(result);
        })

        // app.patch("/cars/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const updateData = req.body;
        //     const query = { _id: new ObjectId(id) };
        //     const updateDoc = {
        //         $set: updateData,
        //     };
        //     const result = await carsCollection.updateOne(query, updateDoc);
        //     res.send(result);
        // })

        const bookingsCollection = db.collection("bookings");

        app.post("/bookings", async (req, res) => {
            const bookingData = req.body;
            const result = await bookingsCollection.insertOne(bookingData);
            res.send(result);
        })

        app.get("/bookings", async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }
            const cursor = bookingsCollection.find(query);
            const bookings = await cursor.toArray();
            res.send(bookings);
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