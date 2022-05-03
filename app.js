const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

try {
    mongoose.connect("mongodb+srv://Admin-Nicola:Nicpool09-@cluster0.itsqj.mongodb.net/expenceTrakerDB")
    console.log("Connected succesfully")
} catch (error) {
    console.log("Error")
}

//SCHEMAS ------------------------------------

const spesaSchema = {
    titolo: String,
    importo: Number,
    data: Date,
    descrizione: String,
    categoria: String,
    conto: String
}

const Spesa = mongoose.model("Spesa", spesaSchema)

const entrataSchema = {
    titolo: String,
    importo: Number,
    data: Date,
    descrizione: String,
    categoria: String,
    conto: String
}

const Entrata = mongoose.model("Entrata", entrataSchema)

//GET ------------------------------------

app.get("/", async(req, res) => {

    var entrate = []
    var spese = []
    var tSpese = 0
    var tEntrate = 0
    var tHype = 0
    var tPaypal = 0

    entrate = await (await Entrata.find({})).filter(e => e.data.getMonth() === new Date().getMonth())
    spese = await Spesa.find({}).filter(s => s.data.getMonth() === new Date().getMonth())

    spese.forEach(s => {
        tSpese += s.importo
    });

    entrate.forEach(e => {
        tEntrate += e.importo
    });

    entrate.forEach(e => {
        if (e.conto === "Hype") {
            tHype += e.importo
        } else if (e.conto === "PayPal") {
            tPaypal += e.importo
        }
    });

    spese.forEach(s => {
        if (s.conto === "Hype") {
            tHype -= s.importo
        } else if (s.conto === "PayPal") {
            tPaypal -= s.importo
        }
    });

    res.render("Home", { listaSpese: spese, listaEntrate: entrate, totEntrate: tEntrate, totSpese: tSpese, totHype: Number(tHype), totPayPal: Number(tPaypal) })
})

//POST ------------------------------------

app.post("/addEntrata", (req, res) => {

    var newEntrata = new Entrata({
        titolo: req.body.titoloEntrata,
        importo: req.body.importoEntrata,
        data: new Date(),
        descrizione: req.body.noteEntrata,
        categoria: req.body.categoriaEntrata,
        conto: req.body.contoEntrata
    })

    try {
        newEntrata.save()
        console.log("Entrata salvata con successo");
    } catch (error) {
        console.log(error);
    }

    res.redirect("/")
})

app.post("/addSpesa", (req, res) => {

    var newSpesa = new Spesa({
        titolo: req.body.titoloSpesa,
        importo: req.body.importoSpesa,
        data: new Date(),
        descrizione: req.body.noteSpesa,
        categoria: req.body.categoriaSpesa,
        conto: req.body.contoSpesa
    })

    try {
        newSpesa.save()
        console.log("Spesa salvata con successo");
    } catch (error) {
        console.log(error);
    }

    res.redirect("/")
})

//LISTEN ------------------------------------

app.listen(3000, () => {
    console.log("Server running");
})