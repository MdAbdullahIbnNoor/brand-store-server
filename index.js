const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.hiprwon.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();


        const productCollection = client.db('productDB').collection('productCollection');
        const cartProductCollection = client.db('productDB').collection('cartProductCollection');

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.get('/brand/:name', async (req, res) => {
            const name = req.params.name;
            const query = { brand: name }
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })



        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = req.body;

            const product = {
                $set: {
                    name: updatedProduct.name,
                    brand: updatedProduct.brand,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    photo: updatedProduct.photo
                }
            }

            const result = await productCollection.updateOne(filter, product, options);
            res.send(result);
        })

        // cart related apis
        app.post('/cartProducts', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await cartProductCollection.insertOne(newProduct);
            res.send(result);
        })

        app.get('/cartProducts', async (req, res) => {
            const cursor = cartProductCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/cartProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartProductCollection.findOne(query);
            res.send(result);
        })

        app.delete('/cartProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            const result = await cartProductCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running');
})

app.listen(port, () => {
    console.log(`brand server is running on port ${port}`);
})



// github-server-repo: https://github.com/programming-hero-web-course-4/b8a10-brandshop-server-side-MdAbdullahIbnNoor

// github-client-repo: https://github.com/programming-hero-web-course-4/b8a10-brandshop-client-side-MdAbdullahIbnNoor