const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express()
const port = process.env.PORT || 9000;

//middleware
app.use(cors());
app.use(express.json());

//mongo uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4t4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//async function
async function run(){
    try{
        await client.connect();
        console.log('connected database');

        //database file
        const database = client.db("tours_and_travels");
        const packagesCollection = database.collection("packages");
        const toursCollection = database.collection("tours");
        const branchCollection = database.collection("branch")
        const representativeCollection = database.collection("representative")

        //get packages api
        app.get('/packages', async(req, res) => {
            const cursor = packagesCollection .find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        //get tours api
        app.get('/tours', async(req, res) => {
            const cursor = toursCollection .find({});
            const tours = await cursor.toArray();
            res.send(tours);
        });

        //get branch api
        app.get('/branch', async(req, res) => {
            const cursor = branchCollection.find({});
            const branch = await cursor.toArray();
            res.send(branch);
        })
        //get representative api
        app.get('/representative', async(req, res) => {
            const cursor = representativeCollection.find({});
            const representative = await cursor.toArray();
            res.send(representative);
        })
        //post tours api 
        app.post('/tours', async(req, res) => {
            const tours = req.body;
            const result = await toursCollection.insertOne(tours);
            res.json(result);
            
        })

        // post packages api
        app.post('/packages', async(req, res) => {
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage);
            console.log(result);
            res.json(result);
        });

         //delete tour api
        app.delete('/tours/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await toursCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('sayon tour and travels server')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})