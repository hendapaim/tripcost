const express = require("express");
const mongo = require("mongodb").MongoClient;

// Config
const port = process.env.PORT || 6000;
const server = express();
server.use(express.json());

// Banco de Dados
const url =
  "mongodb+srv://henda:tripcost@cluster0.adlgl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let db, trips, expenses;

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    db = client.db("tripcost");
    trips = db.collection("trips");
    expenses = db.collection("expenses");
  }
);

// End-Point
server.get("/", (req, res) => {
  res.json({ message: "Home Page" });
});

server.post("/trip", (req, res) => {
  const { name } = req.body;
  console.log(trips);
  trips.insertOne({ name: name }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ ok: true });
  });
});

server.get("/trips", (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ trips: items });
  });
});

server.post("/expense", (req, res) => {
  expenses.insertOne(
    {
      trip: req.body.trip,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status.apply(500).json({ err });
        return;
      }
      res.status(200).json({ ok: true });
    }
  );
});

server.get("/expenses", (req, res) => {
  expenses.find({ trip: req.body.trip }).toArray((err, items) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err });
      return;
    }
    res.status(200).json({ expenses: items });
  });
});

//listen
server.listen(port, () => console.log(`Servidor on http://localhost:${port}`));
