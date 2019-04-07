const express = require('express');
const app = express();

app.get('/', (request, response) => {
  console.log(new Date()); // Apenas para mostrar a hora que o request foi feito.
  response.send('Hello, Marcus!');
});

app.listen(3000, 'localhost', (err) => {
  if(err) {
    console.log('The Jobify server could not be started!');
  }else {
    console.log('The jobify server working...');
  }
});