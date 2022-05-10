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

const budgetSchema = {
    spesa: Number,
    shopping: Number,
    ristorante: Number,
    bar: Number,
    payPal: Number,
    benzina: Number,
    regali: Number,
    casa: Number,
    palestra: Number,
    prelievi: Number,
    telefono: Number,
    altro: Number
}

const Budget = mongoose.model("Budget", budgetSchema)

//GET PAGINE PRINCIPALI E ADD ------------------------------------

app.get("/", async(req, res) => {

    var entrate = []
    var spese = []
    var tSpese = 0
    var tEntrate = 0
    var tHype = 0
    var tPaypal = 0
    var optDate = { year: 'numeric', month: 'long', }
    var oggi = new Date().toLocaleDateString('it-IT', optDate)

    entrate = await Entrata.find({})
    spese = await Spesa.find({})

    spese = spese.filter((s) => {
        var today = new Date()
        var dtStart = new Date(today.getFullYear(), today.getMonth(), 1)
        var dtEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)

        return (s.data >= dtStart && s.data <= dtEnd)
    })

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

    res.render("Home", { listaSpese: speseFiltered, listaEntrate: entrateFiltered, totEntrate: tEntrate, totSpese: tSpese, totHype: Number(tHype), totPayPal: Number(tPaypal), periodo: _.capitalize(oggi) })
})

//POST PAGINE PRINCIPALI E ADD ------------------------------------

app.post("/addEntrata", (req, res) => {

    var dataArray = req.body.dataEntrata.split("/")
    var dataString = dataArray[2] + "-" + dataArray[1] + "-" + dataArray[0]
    var dataEntrata = new Date(dataString)

    var newEntrata = new Entrata({
        titolo: req.body.titoloEntrata,
        importo: req.body.importoEntrata,
        data: dataEntrata,
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

    var dataArray = req.body.dataSpesa.split("/")
    var dataString = dataArray[2] + "-" + dataArray[1] + "-" + dataArray[0]
    var dataSpesa = new Date(dataString)

    var newSpesa = new Spesa({
        titolo: req.body.titoloSpesa,
        importo: req.body.importoSpesa,
        data: dataSpesa,
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

app.post("/editBudget", async(req, res) => {

    await Budget.deleteMany()

    var budget = new Budget({
        spesa: req.body.CatSpesa,
        shopping: req.body.CatShopping,
        ristorante: req.body.CatRistorante,
        bar: req.body.CatBar,
        payPal: req.body.CatPayPal,
        benzina: req.body.CatBenzina,
        regali: req.body.CatRegali,
        casa: req.body.CatCasa,
        palestra: req.body.CatPalestra,
        prelievi: req.body.CatPrelievi,
        telefono: req.body.CatTelefono,
        altro: req.body.CatAltro,
    })

    try {
        budget.save()
        console.log("Budget modificato");
    } catch (error) {
        console.log(error);
    }
    res.redirect("analisi")
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

    var totSpese = 0

    spese.forEach(s => {
        totSpese = totSpese + s.importo
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

    res.render("spese", { spese: spese, tBar: result.bar, tPayPal: result.payPal, tBenzina: result.benzina, tSpesa: result.spesa, tShopping: result.shopping, tRistorante: result.ristorante, tRegali: result.regali, tCasa: result.casa, tPrelievi: result.prelievi, tTelefono: result.telefono, tPalestra: result.palestra, tAltro: result.altro, totSpese: totSpese })
})

app.get("/entrate", async(req, res) => {

    var entrate = await Entrata.find({})
    var totStipendio = 0
    var totPayPal = 0
    var totAltro = 0
    var tot = 0

    entrate.forEach(e => {

        tot = tot + e.importo

        switch (e.categoria) {
            case "Stipendio":
                totStipendio = totStipendio + e.importo
                break;
            case "PayPal":
                totPayPal = totPayPal + e.importo
                break;
            case "Altro":
                totAltro = totAltro + e.importo
                break;
            default:
                break;
        }
    });

    res.render("entrate", { entrate: entrate, totEntrate: tot, tStipendio: totStipendio, tPayPal: totPayPal, tAltro: totAltro })
})

app.get("/analisi", async(req, res) => {

    var budgetSummary = {
        rSpesa: 0,
        rShopping: 0,
        rRistorante: 0,
        rBar: 0,
        rPayPal: 0,
        rBenzina: 0,
        rRegali: 0,
        rCasa: 0,
        rPalestra: 0,
        rPrelievi: 0,
        rTelefono: 0,
        rAltro: 0,

        bSpesa: 0,
        bShopping: 0,
        bRistorante: 0,
        bBar: 0,
        bPayPal: 0,
        bBenzina: 0,
        bRegali: 0,
        bCasa: 0,
        bPalestra: 0,
        bPrelievi: 0,
        bTelefono: 0,
        bAltro: 0,

        diffSpesa: 0,
        diffShopping: 0,
        diffRistorante: 0,
        diffBar: 0,
        diffPayPal: 0,
        diffBenzina: 0,
        diffRegali: 0,
        diffCasa: 0,
        diffPalestra: 0,
        diffPrelievi: 0,
        diffTelefono: 0,
        diffAltro: 0,
    }

    var budget = await Budget.findOne({})

    budgetSummary.bSpesa = budget.spesa
    budgetSummary.bShopping = budget.shopping
    budgetSummary.bRistorante = budget.ristorante
    budgetSummary.bBar = budget.bar
    budgetSummary.bPayPal = budget.payPal
    budgetSummary.bBenzina = budget.benzina
    budgetSummary.bRegali = budget.regali
    budgetSummary.bCasa = budget.casa
    budgetSummary.bPalestra = budget.palestra
    budgetSummary.bPrelievi = budget.prelievi
    budgetSummary.bTelefono = budget.telefono
    budgetSummary.bAltro = budget.altro

    var spese = await Spesa.find({})
    var totSpese = 0

    spese.forEach(s => {
        totSpese = totSpese + s.importo
        switch (s.categoria) {
            case "Spesa":
                budgetSummary.rSpesa = budgetSummary.rSpesa + s.importo
                break;
            case "Shopping":
                budgetSummary.rShopping = budgetSummary.rShopping + s.importo
                break;
            case "Ristorante":
                budgetSummary.rRistorante = budgetSummary.rRistorante + s.importo
                break;
            case "Bar":
                budgetSummary.rBar = budgetSummary.rBar + s.importo
                break;
            case "PayPal":
                budgetSummary.rPayPal = budgetSummary.rPayPal + s.importo
                break;
            case "Benzina":
                budgetSummary.rBenzina = budgetSummary.rBenzina + s.importo
                break;
            case "Regali":
                budgetSummary.rRegali = budgetSummary.rRegali + s.importo
                break;
            case "Casa":
                budgetSummary.rCasa = budgetSummary.rCasa + s.importo
                break;
            case "Palestra":
                budgetSummary.rPalestra = budgetSummary.rPalestra + s.importo
                break;
            case "Prelievi":
                budgetSummary.rPrelievi = budgetSummary.rPrelievi + s.importo
                break;
            case "Telefono":
                budgetSummary.rTelefono = budgetSummary.rTelefono + s.importo
                break;
            case "Altro":
                budgetSummary.rAltro = budgetSummary.rAltro + s.importo
                break;
            default:
                break;
        }
    });

    budgetSummary.diffSpesa = budgetSummary.bSpesa - budgetSummary.rSpesa
    budgetSummary.diffShopping = budgetSummary.bShopping - budgetSummary.rShopping
    budgetSummary.diffRistorante = budgetSummary.bRistorante - budgetSummary.rRistorante
    budgetSummary.diffBar = budgetSummary.bBar - budgetSummary.rBar
    budgetSummary.diffPayPal = budgetSummary.bPayPal - budgetSummary.rPayPal
    budgetSummary.diffBenzina = budgetSummary.bBenzina - budgetSummary.rBenzina
    budgetSummary.diffRegali = budgetSummary.bRegali - budgetSummary.rRegali
    budgetSummary.diffCasa = budgetSummary.bCasa - budgetSummary.rCasa
    budgetSummary.diffPalestra = budgetSummary.bPalestra - budgetSummary.rPalestra
    budgetSummary.diffPrelievi = budgetSummary.bPrelievi - budgetSummary.rPrelievi
    budgetSummary.diffTelefono = budgetSummary.bTelefono - budgetSummary.rTelefono
    budgetSummary.diffAltro = budgetSummary.bAltro - budgetSummary.rAltro

    res.render("analisi", { budgetDetails: budgetSummary })
});

//DATI GRAFICI ------------------------------------

app.post("/getSpeseForBalanceChart", async(req, res) => {
    var x = []

    var spese = await Spesa.find({})
    var entrate = await Entrata.find({})
    var tSpese = 0
    var tEntrate = 0

    spese = spese.filter((s) => {
        var today = new Date()
        var dtStart = new Date(today.getFullYear(), today.getMonth(), 1)
        var dtEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)

        return (s.data >= dtStart && s.data <= dtEnd)
    })

    entrate = entrate.filter((e) => {
        var today = new Date()
        var dtStart = new Date(today.getFullYear(), today.getMonth(), 1)
        var dtEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)

        return (e.data >= dtStart && e.data <= dtEnd)
    })

    spese.forEach(s => {
        tSpese = tSpese + s.importo
    });

    entrate.forEach(e => {
        tEntrate = tEntrate + e.importo
    });

    tEntrate = tEntrate - tSpese

    x.push(tSpese)
    x.push(tEntrate)

    return res.send(x)
})

app.post("/getSpeseForLineChart", async(req, res) => {
    var today = new Date()
    var daysInMonth = getDayInMonth(today.getMonth() + 1, today.getFullYear())
    var x = {
        data: [],
        categories: []
    }

    var spese = await Spesa.find({})

    spese = spese.filter((s) => {
        var today = new Date()
        var dtStart = new Date(today.getFullYear(), today.getMonth(), 1)
        var dtEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)

        return (s.data >= dtStart && s.data <= dtEnd)
    })

    for (let i = 1; i <= daysInMonth; i++) {
        x.categories.push(String(i))
        var t = 0

        spese.forEach(s => {
            var dataSpesa = new Date(s.data.getTime())
            if (dataSpesa.getDate() === i) {
                t = t + s.importo
            }
        });
        x.data.push(t)
    }

    return res.send(x)
})

app.post("/getDataCategoriesS", async(req, res) => {
    var x = []
    var cat = {
        spesa: 0,
        shopping: 0,
        ristorante: 0,
        bar: 0,
        payPal: 0,
        benzina: 0,
        regali: 0,
        casa: 0,
        palestra: 0,
        prelievi: 0,
        telefono: 0,
        altro: 0
    }

    var spese = await Spesa.find({})

    spese = spese.filter((s) => {
        var today = new Date()
        var dtStart = new Date(today.getFullYear(), today.getMonth(), 1)
        var dtEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)

        return (s.data >= dtStart && s.data <= dtEnd)
    })

    spese.forEach(s => {
        switch (s.categoria) {
            case "Spesa":
                cat.spesa = cat.spesa + s.importo
                break;
            case "Shopping":
                cat.shopping = cat.shopping + s.importo
                break;
            case "Ristorante":
                cat.ristorante = cat.ristorante + s.importo
                break;
            case "Bar":
                cat.bar = cat.bar + s.importo
                break;
            case "PayPal":
                cat.payPal = cat.payPal + s.importo
                break;
            case "Benzina":
                cat.benzina = cat.benzina + s.importo
                break;
            case "Regali":
                cat.regali = cat.regali + s.importo
                break;
            case "Casa":
                cat.casa = cat.casa + s.importo
                break;
            case "Palestra":
                cat.palestra = cat.palestra + s.importo
                break;
            case "Prelievi":
                cat.prelievi = cat.prelievi + s.importo
                break;
            case "Telefono":
                cat.telefono = cat.telefono + s.importo
                break;
            case "Altro":
                cat.altro = cat.altro + s.importo
                break;
            default:
                break;
        }
    });

    x.push(cat.spesa)
    x.push(cat.shopping)
    x.push(cat.ristorante)
    x.push(cat.bar)
    x.push(cat.payPal)
    x.push(cat.benzina)
    x.push(cat.regali)
    x.push(cat.casa)
    x.push(cat.palestra)
    x.push(cat.prelievi)
    x.push(cat.telefono)
    x.push(cat.altro)

    return res.send(x)
})

app.post("/getDataCategoriesE", async(req, res) => {
    var x = []

    var entrate = await Entrata.find({})

    entrate = entrate.filter((e) => {
        var today = new Date()
        var dtStart = new Date(today.getFullYear(), today.getMonth(), 1)
        var dtEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1)

        return (e.data >= dtStart && e.data <= dtEnd)
    })

    var stip = 0
    var ppl = 0
    var altro = 0

    entrate.forEach(e => {
        switch (e.categoria) {
            case "Stipendio":
                stip = stip + e.importo
                break;
            case "PayPal":
                ppl = ppl + e.importo
                break
            case "Altro":
                altro = altro + e.importo
                break
            default:
                break;
        }
    });
    x.push(stip)
    x.push(ppl)
    x.push(altro)

    return res.send(x)
})

// FUNZIONI VAIRE ------------------------------------

function getDayInMonth(m, a) {
    return new Date(a, m, 0).getDate();
}

//LISTEN ------------------------------------

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server running");
})