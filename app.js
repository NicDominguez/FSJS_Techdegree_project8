const express = require('express')
const db = require('./db');
const routes = require('./routes');

const app = express();


// Set view engine and json parser
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Sets static route to the public folder
app.use('/static', express.static('public'))


// Check for routes
app.use(routes);

// Page Not Found Error Throw
app.use((req, res, next) => {
  const error = new Error('Page Not Found')
  error.status = 404
  next(error)
})

// Error Handler
app.use((err, req, res, next) => {
  console.log(err)
  res.locals.error = err;
  res.status(err.status);
  
  if (err.status === 404) {
    res.render('page_not_found')
  } else {
    res.render('error');
  }
  
})

app.listen(3000);