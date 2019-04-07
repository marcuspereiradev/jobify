const express = require('express');
const app = express();

const sqlite = require('sqlite');
const dbConnection = sqlite.open('banco.sqlite', { Promise });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (request, response) => {
  const db = await dbConnection;
  const categorias = await db.all('SELECT * FROM categorias;');
  response.render('home', {
    categorias
  })
});

app.get('/vaga', (request, response) => {
  response.render('vaga')
});

const init = async() => {
  const db = await dbConnection;
  await db.run('CREATE TABLE if not exists categorias (id INTEGER PRIMARY KEY, categoria TEXT);');
  const categoria = 'Engineering team'
  await db.run(`INSERT INTO categorias(categoria) VALUES('${categoria}')`);
}
init();

app.listen(3000, 'localhost', (err) => {
  if(err) {
    console.log('The Jobify server could not be started!');
  }else {
    console.log('The jobify server working...');
  }
});

