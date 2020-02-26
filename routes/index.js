const express = require("express");
const router = express.Router();

const db = require("../db");
const { Book } = db.models;


/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

// Routes

router.get('/', (req, res) => {
    res.redirect('/books');

});

router.get('/books', asyncHandler(async (req, res) => {
    const allBooks = await Book.findAll()
    res.render('all_books', {allBooks});
}));

router.get('/books/new', asyncHandler(async (req, res) => {
    res.render('new_book');
}));

router.get('/books/:id', asyncHandler(async (req, res) => {
    const singleBook = await Book.findByPk(req.params.id);
    res.render('book_detail', {singleBook});
}));


router.post('/books/new', asyncHandler(async (req, res) => {
    const newBook = await Book.create(req.body);
    res.redirect('/books/' + newBook.id);

}));

router.post('/books/:id', asyncHandler(async(req, res) => {
    const bookToUpdate = await Book.findByPk(req.params.id);
    await bookToUpdate.update(req.body);
    res.redirect('/books' + bookToUpdate.id);
}));

router.post('/books/:id/delete', asyncHandler(async(req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);
    await bookToDelete.destroy();
    res.redirect('/books');

}));

module.exports = router;