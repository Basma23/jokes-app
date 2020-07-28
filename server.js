'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const pg = require('pg');
const methodoverride = require('method-override');
const { response } = require('express');
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);
const server = express();

server.use(cors());
server.use(methodoverride('_method'));
server.use(express.json());
server.use(express.static('./public'));
server.use(express.urlencoded({extended: true}));
server.set('view engine', 'ejs');

server.get('/', index);
// server.post('/joke/:id', adding);
server.put('/joke/:id', updating);
server.delete('/joke/:id', deleting);
server.get('/random', random);
server.get('*', errors);

function index(request, response){
    let url = 'https://official-joke-api.appspot.com/jokes/programming/ten';
    superagent.get(url).then(joke=>{
        let data = joke.body;
        let jokes = data.map(joke=>{
            let newJoke = new Joke(joke);
            return newJoke;
        });
        response.render('index', {joke: jokes});
    });
};
// function adding(request, response){
//     let SQL = 'INSERT INTO joke (type, setup, punchline) VALUES ($1, $2, $3);';
//     let assignValues = [request.body.type, request.body.setup, request.body.punchline];
//     client.query(SQL, assignValues).then(()=>{
//         let SQL1 = 'SELECT * FROM joke WHERE setup=$1;';
//         let assignValue = [request.body.setup];
//         client.query(SQL1, assignValue).then(jokes=>{
//             response.render(`fav/${jokes.rows[0].id}`);
//         });
//     });
// };
function random(request, response){
    let url = 'https://official-joke-api.appspot.com/jokes/programming/random';
    superagent.get(url).then(joke=>{
        let data = joke.body;
        let jokes = data.map(joke=>{
            let newJoke = new Joke(joke);
            return newJoke;
        });
        response.render('random', {joke: jokes});
    });
};
function updating(request, response){
    let SQL = 'UPDATE joke SET type=$1, setup=$2, punchline=$3 WHERE id=$4;';
    let {type, setup, punchline} = request.body;
    let id = request.params.id;
    let assignValues = [type, setup, punchline, id];
    client.query(SQL, assignValues).then(jokes=>{
        response.redirect('fav' );
    });
};
function deleting(request, response){
    let SQL = 'DELETE * FROM joke;';
    client.query(SQL).then(()=>{
        response.render('fav');
    });
};
function Joke(info){
    this.type = info.type ? info.type: 'Not found';
    this.setup = info.setup ? info.setup: 'Not found';
    this.punchline = info.punchline ? info.punchline: 'Not found';
}
function errors(request, response){
    response.status(404).send('The page that you are looking for is not found');
};
server.get((error, request, response)=>{
    response.status(500).send(error);
});
// client.connect().then(()=>{
    server.listen(PORT, ()=>{
        console.log(`Connenting and listining on port ${PORT}`);
    })
// })