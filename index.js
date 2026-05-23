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
            const result = await carsCollection.insertOne(req.body);
            res.json(result);
        })

        app.get("/cars", async (req, res) => {
            const result = await carsCollection.find().toArray();
            res.json(result);
        })

        app.get("/cars/:id", async (req, res) => {
            const result = await carsCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.json(result);
        })

        app.patch("/cars/:id", async (req, res) => {
            const result = await carsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
            res.json(result);
        })

        app.delete("/cars/:id", async (req, res) => {
            const result = await carsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            res.json(result);
        })

        const bookingsCollection = db.collection("bookings");

        app.post("/bookings", async (req, res) => {
            const result = await bookingsCollection.insertOne(req.body);
            res.json(result);
        })

        app.get("/bookings", async (req, res) => {
            const query = req.query?.email ? { userEmail: req.query.email } : {};
            const result = await bookingsCollection.find(query).toArray();
            res.json(result);
        })

        app.delete("/bookings/:id", async (req, res) => {
            const result = await bookingsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            res.json(result);
        })

        const myCarsCollection = db.collection("my-cars");

        app.post("/my-cars", async (req, res) => {
            const result = await myCarsCollection.insertOne(req.body);
            res.json(result);
        });

        app.get("/my-cars", async (req, res) => {
            const query = req.query?.email ? { userEmail: req.query.email } : {};
            const result = await myCarsCollection.find(query).toArray();
            res.json(result);
        });

        app.delete("/my-cars/:id", async (req, res) => {
            const result = await myCarsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
            res.json(result);
        })

        app.patch("/my-cars/:id", async (req, res) => {
            const result = await myCarsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
            res.json(result);
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