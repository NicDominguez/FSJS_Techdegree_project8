const express = require('express')
const db = require('./db');
const routes = require('./routes');

const app = express();

app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static('public'))
app.use(routes);

(async () => {
  await db.sequelize.sync();

  try {
    /* await sequelize.authenticate();
        console.log('Connection to the database successful'); */
  } catch (error) {
    /* console.error('Error connecting to the database: ', error) */
  }
})();

app.listen(3000);