const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const shortUrl = require("./models/modelo");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI,  {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conectado a MongoDB");
}).catch(err => {
  console.error("Error al conectar a MongoDB", err);
});

// Middlewares
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Generador de plantillas
app.set("view engine", "ejs");

// Rutas
app.get('/', async (req, res) => {
  try {
    const shortUrls = await shortUrl.find();
    res.render('index', { shortUrls: shortUrls });
  } catch (err) {
    console.error("Error al obtener las URLs cortas:", err);
    res.status(500).send("Error al obtener las URLs cortas.");
  }
});

app.post("/acortadorurl", async (req, res) => {
  try {
    await shortUrl.create({ full: req.body.fullUrl });
    res.redirect("/");
  } catch (err) {
    console.error("Error al acortar la URL:", err);
    res.status(500).send("Error al acortar la URL.");
  }
});

app.get("/:shortUrl", async (req, res) => {
  try {
    const urlData = await shortUrl.findOne({ short: req.params.shortUrl });
    if (urlData) {
      res.redirect(urlData.full);
    } else {
      res.status(404).send("URL no encontrada.");
    }
  } catch (err) {
    console.error("Error al redirigir la URL corta:", err);
    res.status(500).send("Error al redirigir la URL corta.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor inicializado en http://localhost:${PORT}`);
});
