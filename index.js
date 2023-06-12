const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


/*Middleware*/
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zqrmsxk.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const dataBaseOfCategory = client.db("funcar").collection("carCategory");
        const dataBaseOfAddToy = client.db("funcar").collection("addToy");



        /*SUB CATEGORY*/
        app.get('/category/:text', async (req, res) => {

            if (req.params.text == "Sports_Cars" || req.params.text == "Off-Road_Vehicles" || req.params.text == "Vintage_Cars") {

                const cursor = dataBaseOfCategory.find({ category: req.params.text });
                const result = await cursor.toArray();
                return res.send(result)
            }

            return res.send([])

        })


        // app.get('/category/:id', async (req, res) => {

             
        //         const id = req.params.id    
                
        //         const query = {_id : new ObjectId(id)}

        //         const options = {

        //             projection: { toys: 1 }
        //         }

        //         const cursor = dataBaseOfCategory.find(query,options);
        //         const result = await cursor.toArray();
        //         return res.send(result)
             

        // })






        /* MY TOY */

        app.get('/mytoy', async (req, res) => {

            console.log(req.query);

            let query = {}
            if (req.query?.sellerEmail) {
                query = { sellerEmail: req.query.sellerEmail }
            }
            const result = await dataBaseOfAddToy.find(query).toArray();
            res.send(result);
        })



        /*MY TOY DELETE*/

        app.delete('/mytoy/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await dataBaseOfAddToy.deleteOne(query);
            res.send(result);

        })


        /*UPDATE TOY INFO*/

        app.get('/mytoy/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await dataBaseOfAddToy.findOne(query);
            res.send(result);

        })


        /*PUT*/

        app.put('/mytoy/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updated = req.body;

            console.log(id, updated);


            const toyUpdated = {

                $set: {

                    price: updated.price,
                    quantity: updated.quantity,
                    details: updated.details,
                },
            };
            const result = await dataBaseOfAddToy.updateOne(query, toyUpdated, options);
            res.send(result);
            console.log(result);
        })




        /*ADD TOY*/

        app.post('/addtoy', async (req, res) => {

            const add = req.body;
            console.log(add);
            const result = await dataBaseOfAddToy.insertOne(add)
            res.send(result);

        })


        /*Details OF ALL TOY*/

        app.get('/alltoys/:id', async (req, res) => {

            const id = req.params.id;
            const search = req.query.search;
            console.log(search);
            const query = { _id: new ObjectId(id)};
            const result = await dataBaseOfAddToy.findOne(query);
            res.send(result);

        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})