const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const uri =
  'mongodb+srv://gedas:<pass>@cluster0.zfrcl.mongodb.net/demo16?retryWrites=true&w=majority';
const client = new MongoClient(uri);

app.get('/', async (req, res) => {
  try {
    const con = await client.connect();
    const data = await con.db('demo16').collection('flats').find().toArray();
    await con.close();
    res.send(data);
  } catch (e) {
    res.status(500).send({ msg: 'Please try again' });
  }
});

app.post('/', async (req, res) => {
  if (!req.body.city || !req.body.price || !req.body.kv) {
    return res.status(400).send({ msg: 'Bad data entered' });
  }
  try {
    const con = await client.connect();
    const dbResponse = await con.db('demo16').collection('flats').insertOne({
      city: req.body.city,
      price: req.body.price,
      kv: req.body.kv,
    });
    await con.close();
    res.send(dbResponse);
  } catch (e) {
    res.status(500).send({ e });
  }
});

app.all('*', (req, res) => {
  res.status(400).send({ msg: 'URL is not correct!' });
});

const port = process.env.PORT;

app.listen(port, () => console.log(`Server is working on ${port} port`));
