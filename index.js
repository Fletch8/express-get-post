const express = require('express')
const app = express()
const epressLayouts = require('express-ejs-layouts')
const fs  = require('fs')
const { join } = require('path')
const methodOverride = require('method-override')

// Middleware
// this helps us use our layout file
app.use(epressLayouts)
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

// for views use .ejs files
app.set('view engine', 'ejs')

// ROUTES
app.get('/', (req, res)=>{
    res.send('hello there...')
})

// index view
app.get('/dinosaurs', (req, res)=>{
    // get json obj
    let dinos = fs.readFileSync('./dinosaurs.json')

    // put data into more readable format
    dinos = JSON.parse(dinos)
    console.log(req.query.nameFilter)
    let nameToFilterBy = req.query.nameFilter

    // array method filter()
    if (nameToFilterBy){
        const newFilterArray = dinos.filter((dinos)=> {
            if (dinos.name.toLowerCase() === nameToFilterBy.toLowerCase()){
                return true
            }
        })
        dinos = newFilterArray
    }
    //console.log(newFilterArray)

    res.render('dinosaurs/index', {dinos: dinos})
})


// show view
app.get('/dinosaurs/:index', (req, res)=>{
    let dinos = fs.readFileSync('./dinosaurs.json')
    // put data inot more readable format
    dinos = JSON.parse(dinos)
    const dino = dinos[req.params.index]
    res.render('dinosaurs/show', { dino })
})

app.get('/dinosaurs/new', (req,res)=>{
    res.render('dinosaurs/new')
})


// POST route
app.post('/dinosaurs', (req,res)=>{
    let dinos = fs.readFileSync('./dinosaurs.json')
    // comming from submit form, we r going to look at req.body
    dinos = JSON.parse(dinos)
    // construct new dino
    const newDino = {
        name: req.body.name,
        type: req.body.type
    }
    // updates dino list
    dinos.push(newDino)
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos))
    
    res.redirect('/dinosaurs')
})

app.delete('/dinosaurs/:idx', (req, res) => {
    const dinosaurs = fs.readFileSync('./dinosaurs.json')
    const dinosaurArray = JSON.parse(dinosaurs)

    // intermediate var
    let idx = Number(req.params.idx)
    // remove the dino
    dinosaurArray.splice(idx, 1)
    // save the dino array to dino.json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurArray))
    // redirect user to /dinos
    res.redirect('/dinosaurs')
})

const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{console.log(`server listening on Port: ${PORT}`)})