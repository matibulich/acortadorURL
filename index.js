const express = require("express")
const app = express()
const path = require("path")
const shortId = require("shortid");

const PORT = 3000

//alamacenador de urls
const urls = []

//midlewares
app.use(express.static(path.resolve(__dirname,"public")))
app.use(express.urlencoded({extended: false}))

//generador de plantillas
app.set("view engine", "ejs")
// app.set('views', path.join(__dirname, './views')); Usar si cambio las vistas de carpeta

//rutas

app.get('/', (req, res) => {
    res.render('index', { shortUrl: urls });
  });

app.post("/acortadorurl", (req, res)=>{
    const fullUrl = req.body.url;
    const shortUrl = shortId.generate(8)

    urls.push({full: fullUrl, short: shortUrl })

    res.redirect("/")
} )

app.get("/:shortUrl", async (req, res)=>{
    const shortUrl = req.params.shortUrl;
    const urlData = urls.find(e=> e.short === shortUrl)
    res.redirect(urlData.full);
})



app.listen(PORT, ()=>{
    console.log(`Servidor inicializado en http://localhost:${PORT}`)
})