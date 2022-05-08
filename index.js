const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
    res.send("Running My Curd Server");
});
// app.get('/hero', (req, res) => {
//     res.send("Connect With Heroku");
// });






const uri = `mongodb+srv://${process.env.mongo_user}:${process.env.mongo_pass}@cluster0.3bjrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('stock').collection('products');
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);

        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updateUser.quantity
                }
            };
            const result = await productCollection.updateOne(query, updatedDoc, options);
            res.send(result);

        })

        // Product Post
        app.post('/products', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            // const result = await collection.insertOne(newUser);
            const result = await productCollection.insertOne(newUser);
            // const result = { stutaus: "success" }
            res.send(result);
        })

    }
    finally {

    }

}
run().catch(console.dir);






app.listen(port, () => {
    console.log("CURD");

});