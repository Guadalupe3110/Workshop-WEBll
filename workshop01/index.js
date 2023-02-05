//const { required } = require("nodemon/lib/config");
//mongo si es la local
//mongod para levantarlo
//Yo uso atlas
const express = require('express');//Inicializa
const app = express();//Crea
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb+srv://lupe98:Heimy31101998@cluster0.bclpkin.mongodb.net/?retryWrites=true&w=majority")
const TeamModel = require("./models/team");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const bodyParse = require("body-parser");
const team = require('./models/team');
app.use(bodyParse.json());

// app.get('/tipocambio',  (req, res) => {
//   // generate a response
//   res.json({
//     "TipoCompraDolares" : "608",
//     "TipoVentaDolares" : "621",
//     "TipoCompraEuros" : "731.85",
//     "TipoVentaEuros" : "761.9"
//   });
// });


//Insertar datos por medio del post a base de datos mongo, tabla team, columnas name y description
app.post('/team', function (req, res) {

    const team = new TeamModel();
    team.name = req.body.name;
    team.description = req.body.description;
    if (team.name && team.description) {
        team.save(function (err) {
        if (err) {
            res.status(422);
            console.log('error while saving the team', err);
            res.json({
            error: 'There was an error saving the team'
            });
        }
        res.status(201);//CREATED
        res.header({
            'location': `http://localhost:3000/team/?id=${team.id}`
        });
        res.json(team);
        });
    } else {
        res.status(422);
        console.log('error while saving the team')
        res.json({
        error: 'No valid data provided for team'
        });
    }
});

//Modificar team por medio del patch
 app.patch('/team', (req, res) => {
  console.log(req.query)
  console.log(req.query.id)
   // check if there's an ID in the querystring
   if (req.query && req.query.id) {
     team.findById(req.query.id, function (err, team) {
       if (err) {
         res.status(404);
         console.log('error while queryting the team', err);
         res.json({ error: "team doesnt exist" });
       }

       // update the team object (patch) este modifica parcialmente
       team.name = req.body.name ? req.body.name : team.name;
       team.description = req.body.description ? req.body.description : team.description;
       // update the team object (put) reemplaza completamente los datos
       // team.title = req.body.title
       // team.detail = req.body.detail

       team.save(function (err) {
         if (err) {
           res.status(422);
           console.log('error while saving the team', err);
           res.json({
             error: 'There was an error saving the team'
           });
         }
         res.status(200); // OK
         res.json(team);
       });
     });
   } else {
     res.status(404);
     res.json({ error: "Team doesnt exist" });
   }

 });

//Eliminar team por medio de delete
 app.delete('/team', (req, res) => {
  console.log(req.query)
  console.log(req.query.id)
  if (req.query && req.query.id) {
    team.findById(req.query.id, function (err, team) {
      if (err) {
        res.status(500);
        console.log('error while queryting the team', err)
        res.json({ error: "team doesnt exist" })
      }
      if(team) {
        team.remove(function(err){
          if(err) {
            res.status(500).json({message: "There was an error deleting the team"});
          }
          res.status(204).json({});
        })
      } else {
        res.status(404);
        console.log('error while queryting the team', err)
        res.json({ error: "team doesnt exist" })
      }
    });
  } else {
    res.status(404).json({ error: "You must provide a team ID" });
  }
 })


 //Obtiene todos los team por medio de get
 app.get('/team', (req, res) => {
  console.log(req.query)
  console.log(req.query.id)
  if (req.query && req.query.id) {
    team.findById(req.query.id, function (err, team) {
      if (err) {
        res.status(500);
        console.log('error while queryting the team', err)
        res.json({ error: "team doesnt exist" })
      }
      res.json(team);
    });
  } else {
    team.find(function (err, teams) {
      if (err) {
        res.status(422);
        res.json({ "error": err });
      }
      res.json(teams);
    });
  }
 })


app.listen(3000, () => console.log(`Fifa app listening on port 3000!`))