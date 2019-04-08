const express = require('express');
const app = express();

const sqlite = require('sqlite');
const dbConnection = sqlite.open('db.sqlite', { Promise });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (request, response) => {
  const db = await dbConnection;
  const categoriesDb = await db.all('SELECT * FROM categories;');
  const vacancies = await db.all('SELECT * FROM vacancies;');

  const categories = categoriesDb.map(cat => {
    return {
      ...cat,
      vacancies: vacancies.filter(vacancy => vacancy.category === cat.id)
    }
  });
  
  response.render('home', {
    categories
  })
});

app.get('/vacancy/:id', async (request, response) => {
  const db = await dbConnection;
  const vacancy = await db.get(`SELECT * FROM vacancies WHERE id = ${request.params.id}`);

  response.render('vacancy', {
    vacancy
  })
});

const init = async() => {
  const db = await dbConnection;
  await db.run('CREATE TABLE if not exists categories (id INTEGER PRIMARY KEY, category TEXT);');
  await db.run('CREATE TABLE if not exists vacancies (id INTEGER PRIMARY KEY, category INTEGER, title TEXT, description TEXT);');
  // const category = 'Marketing team'
  // await db.run(`INSERT INTO categories(category) VALUES('${category}')`);
  // const vacancy = 'Digital Marketing (San Francisco)';
  // const description = 'Vacancy to Marketing team'
  // await db.run(`INSERT INTO vacancies(category, title, description) VALUES(2, '${vacancy}', '${description}')`);
}
init();

app.listen(3000, 'localhost', (err) => {
  if(err) {
    console.log('The Jobify server could not be started!');
  }else {
    console.log('The jobify server working...');
  }
});

