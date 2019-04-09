const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const sqlite = require('sqlite');
const dbConnection = sqlite.open('db.sqlite', { Promise });

const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', async(request, response) => {
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

app.get('/vacancy/:id', async(request, response) => {
  const db = await dbConnection;
  const vacancy = await db.get(`SELECT * FROM vacancies WHERE id = ${request.params.id}`);

  response.render('vacancy', {
    vacancy
  })
});

app.get('/admin', (request, response) => {
  response.render('admin/home')
});

app.get('/admin/vacancies', async(request, response) => {
  const db = await dbConnection;
  const vacancies = await db.all('SELECT * FROM vacancies;');
  response.render('admin/vacancies', {
    vacancies
  })
});

app.get('/admin/vacancies/delete/:id', async(request, response) => {
  const db = await dbConnection;
  await db.run(`DELETE FROM vacancies WHERE id = ${request.params.id}`);
  response.redirect('/admin/vacancies');
});

app.get('/admin/vacancies/new', async(request, response) => {
  const db = await dbConnection;
  const categories = await db.all('SELECT * FROM categories');
  response.render('admin/new-vacancy', {
    categories
  });
});

app.post('/admin/vacancies/new', async(request, response) => {
  const { title, description, category } = request.body;
  const db = await dbConnection;
  await db.run(`INSERT INTO vacancies(category, title, description) VALUES(${category}, '${title}', '${description}')`);
  response.redirect('/admin/vacancies');
});

app.get('/admin/vacancies/edit/:id', async(request, response) => {
  const db = await dbConnection;
  const { id } = request.params
  const categories = await db.all('SELECT * FROM categories');
  const vacancies = await db.get(`SELECT * FROM vacancies WHERE id = ${id}`)
  response.render('admin/edit-vacancy', {
    categories,
    vacancies
  });
});

app.post('/admin/vacancies/edit/:id', async(request, response) => {
  const { title, description, category } = request.body;
  const { id } = request.params
  const db = await dbConnection;
  await db.run(`UPDATE vacancies SET category = ${category}, title = '${title}', description = '${description}' WHERE id = ${id}`);
  response.redirect('/admin/vacancies');
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

app.listen(port, 'localhost', (err) => {
  if(err) {
    console.log('The Jobify server could not be started!');
  }else {
    console.log('The jobify server working...');
  }
});

