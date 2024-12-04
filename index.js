const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

// middle where
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MoveFix project's server is running.....");
});

app.listen(port, () => {
  console.log(`my app is running on port: ${port}`);
});

// server site class room link
// https://github.com/programming-hero-web-course2/b10-a10-server-side-yasin-sorkar47
