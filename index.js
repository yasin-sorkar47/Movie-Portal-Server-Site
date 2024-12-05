const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

// middle where
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.SECRET_USER_NAME}:${process.env.SECRET_PASSWORD}@cluster0.ze0za.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const moviesCollection = client.db("MoviesDB").collection("Movies");

    // get all data from database
    app.get("/movies", async (req, res) => {
      const cursor = moviesCollection.find().limit(Number(req.query.limit));
      const result = await cursor.toArray();
      res.send(result);
    });

    // get one data from database
    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await moviesCollection.findOne(query);
      res.send(result);
    });

    // post data in mongodb
    app.post("/movies", async (req, res) => {
      const movie = req.body;
      const result = await moviesCollection.insertOne(movie);
      res.send(result);
    });

    // update movie
    app.put("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const movie = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateMovie = {
        $set: {
          poster: movie.poster,
          title: movie.title,
          genre: movie.genre,
          duration: movie.duration,
          releaseYear: movie.releaseYear,
          summary: movie.summary,
        },
      };
      const result = await moviesCollection.updateOne(
        filter,
        updateMovie,
        options
      );

      res.send(result);
    });

    // update status isFavorite
    app.put("/status/:id", async (req, res) => {
      const id = req.params.id;
      const movie = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateMovie = {
        $set: {
          isFavorite: true,
          email: movie.email,
        },
      };
      const result = await moviesCollection.updateOne(filter, updateMovie);

      res.send(result);
    });

    // delete the movie
    app.delete("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await moviesCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("MoveFix project's server is running.....");
});

app.listen(port, () => {
  console.log(`my app is running on port: ${port}`);
});
