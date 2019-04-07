const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (request, response) => {
  response.render('home', {
    date: new Date()
  })
});

app.listen(3000, 'localhost', (err) => {
  if(err) {
    console.log('The Jobify server could not be started!');
  }else {
    console.log('The jobify server working...');
  }
});