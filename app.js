const db = require('./db');
const { Book } = db.models;


(async () => {
    await db.sequelize.sync();

    try {
        /* await sequelize.authenticate();
        console.log('Connection to the database successful'); */
    } catch (error) {
        /* console.error('Error connecting to the database: ', error) */
    }
})();