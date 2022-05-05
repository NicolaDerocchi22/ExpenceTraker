const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const res = require("express/lib/response");

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

//GET PAGINE PRINCIPALI E ADD ------------------------------------

app.get("/", async(req, res) => {

    var entrate = []
    var spese = []
    var tSpese = 0
    var tEntrate = 0
    var tHype = 0
    var tPaypal = 0



    entrate = await Entrata.find({})
    spese = await Spesa.find({})

    speseFiltered = spese.sort((a, b) => { return b.data - a.data })
    entrateFiltered = entrate.sort((a, b) => { return b.data - a.data })

    speseFiltered = speseFiltered.slice(0, 10)
    entrateFiltered = entrateFiltered.slice(0, 10)

    speseFiltered.forEach(s => {
        tSpese += s.importo
    });

    entrateFiltered.forEach(e => {
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

    res.render("Home", { listaSpese: speseFiltered, listaEntrate: entrateFiltered, totEntrate: tEntrate, totSpese: tSpese, totHype: Number(tHype), totPayPal: Number(tPaypal) })
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

app.get("/getSpeseForChart", (req, res) => {
    console.log("get spese");
})

app.get("/getEntrateForChart", (req, res) => {
    console.log("get entrate");
})

app.get("/spese", async(req, res) => {

    var spese = await Spesa.find({})
    spese = spese.sort((a, b) => { return b.data - a.data })

    var result = {
        bar: 0,
        payPal: 0,
        benzina: 0,
        spesa: 0,
        shopping: 0,
        ristorante: 0,
        regali: 0,
        casa: 0,
        prelievi: 0,
        telefono: 0,
        palestra: 0,
        altro: 0
    }

    spese.forEach(s => {
        switch (s.categoria) {
            case "Spesa":
                result.spesa = result.spesa + s.importo
                break;
            case "Shopping":
                result.shopping = result.shopping + s.importo
                break;
            case "Ristorante":
                result.ristorante = result.ristorante + s.importo
                break;
            case "Bar":
                result.bar = result.bar + s.importo
                break;
            case "PayPal":
                result.payPal = result.payPal + s.importo
                break;
            case "Benzina":
                result.benzina = result.benzina + s.importo
                break;
            case "Regali":
                result.regali = result.regali + s.importo
                break;
            case "Spesa":
                result.spesa = result.spesa + s.importo
                break;
            case "Casa":
                result.casa = result.casa + s.importo
                break;
            case "Palestra":
                result.palestra = result.palestra + s.importo
                break;
            case "Prelievi":
                result.prelievi = result.prelievi + s.importo
                break;
            case "Telefono":
                result.telefono = result.telefono + s.importo
                break;
            case "Altro":
                result.altro = result.altro + s.importo
                break;

            default:
                break;
        }
    });

    var totSpese = 0
    spese.forEach(s => {
        totSpese = totSpese + s.importo
    });

    res.render("spese", { spese: spese, tBar: result.bar, tPayPal: result.payPal, tBenzina: result.benzina, tSpesa: result.spesa, tShopping: result.shopping, tRistorante: result.ristorante, tRegali: result.regali, tCasa: result.casa, tPrelievi: result.prelievi, tTelefono: result.telefono, tPalestra: result.palestra, tAltro: result.altro, totSpese: totSpese })
})

app.get("/entrate", (req, res) => {
    res.render("entrate")
})

app.get("/conti", (req, res) => {
    res.render("conti")
})

//GET DATI GRAFICI ------------------------------------

app.post("/getSpeseForChart", (req, res) => {
    var x = [1, 2, 3]
    return res.send(x)
})

//LISTEN ------------------------------------

app.listen(3000, () => {
    console.log("Server running");
})