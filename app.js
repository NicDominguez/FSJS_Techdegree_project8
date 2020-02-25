const express = require('express')
const db = require('./db');
const { Book } = db.models;

const app = express();

app.set('view engine', 'pug');

app.use('/static', express.static('public'))


const exampleTitle = "Lord of the Rings"
const exampleAuthor = "J.R. Tolkien"
const exampleGenre = "Fantasy"
const exampleYear = 1900


app.get('/', (req, res) => {
    res.render('all_books', {
        bookTitle: exampleTitle,
        bookAuthor: exampleAuthor,
        bookGenre: exampleGenre,
        bookYear: exampleYear
    });


});

app.get('/books', (req, res) => {
    res.render('all_books', {
        bookTitle: exampleTitle,
        bookAuthor: exampleAuthor,
        bookGenre: exampleGenre,
        bookYear: exampleYear
    });
});

app.get('/books/new', (req, res) => {
    res.render('new_book', {});


});

app.get('/books/:id', (req, res) => {
    res.render('book_detail', {});


});


app.post('/books/new', (req, res) => {
    res.send('post /book/new is workin');


});

app.post('/books/:id', (req, res) => {
    res.send('post /book/:id is workin');


});

app.post('/books/:id/delete', (req, res) => {
    res.send('post /book/:id/delete is workin');


});


(async () => {
    await db.sequelize.sync();

    try {
        /* await sequelize.authenticate();
        console.log('Connection to the database successful'); */

    const book1 = await Book.build({
        title: 'The Emperor of the United States',
        author: 'Neil Gaimen',
        genre: 'Fantasy',
        year: 1985
    });

    console.log(book1.toJSON());

    } catch (error) {
        /* console.error('Error connecting to the database: ', error) */
    }
})();

app.listen(3000);