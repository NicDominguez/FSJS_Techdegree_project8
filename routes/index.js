const express = require("express");
const router = express.Router();

const db = require("../db");
const { Book } = db.models;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                res.render('form_error') 
            } else {
                return next(error)
            }
        }
    }
}

// Pagination Handler
const paginate = (query, { page, pageSize }) => {
    const order =  [['title', 'ASC']];
    const offset = (page - 1 ) * pageSize;
    const limit = pageSize;
  
    return {
      ...query,
      order,
      offset,
      limit,
    };
  };
  
  
// Routes

router.get('/', (req, res) => {
    res.redirect('/books');
});

router.get('/books', asyncHandler(async (req, res) => {
    let pageSize = 5;
    let page = req.query.page;
    if (!page) {page = 1}

    const allBooks = await Book.findAndCountAll(
        paginate( {}, {page, pageSize})
    );
    let totalPages = Math.ceil(allBooks.count / pageSize);

    if (allBooks) {
        res.render('all_books', {allBooks, page, totalPages});
    } else {
        throw error = {
            status: 500,
            message: "I'm sorry but it looks like the application had trouble accessing the library"
        };
    }
}));

router.post('/books', asyncHandler(async (req, res) => {
    let pageSize = 5;
    let page = req.query.page;
    if (!page) { page = 1 }
    const searchText = req.body.bookSearch.toLowerCase()
    const searchedBooks = await Book.findAndCountAll(
        paginate(
            {
                where: {
                    [Op.or]: {
                        title: {
                            [Op.like]: `%${searchText}%`
                        },
                        author: {
                            [Op.like]: `%${searchText}%`
                        },
                        genre: {
                            [Op.like]: `%${searchText}%`
                        },
                        year: {
                            [Op.like]: `%${searchText}%`
                        }
                    }
                }
            }, {page, pageSize}
        )
    );
    let totalPages = Math.ceil(searchedBooks.count/pageSize)

    if (searchedBooks.count > 0) {
        res.render('all_books', {searchedBooks, searchText, page, totalPages});
    } else {
        throw error = {
            status: 500,
            message: "I'm soory, but your search did not turn up any results"
        }
    }
}))

router.get('/books/new', asyncHandler(async (req, res) => {
    res.render('new_book');
}));

router.get('/books/:id', asyncHandler(async (req, res) => {
    const singleBook = await Book.findByPk(req.params.id);
    if (singleBook) {
        res.render('book_detail', {singleBook});
    } else {
        throw error = {
            status: 500,
            message: "I'm sorry but that book does not exist in our database"
        };
    }
        
}));


router.post('/books/new', asyncHandler(async (req, res) => {
    const newBook = await Book.create(req.body);
    res.redirect('/books/' + newBook.id);

}));

router.post('/books/:id', asyncHandler(async(req, res) => {
    const bookToUpdate = await Book.findByPk(req.params.id);
    await bookToUpdate.update(req.body);
    res.redirect('/books/' + bookToUpdate.id);
}));

router.post('/books/:id/delete', asyncHandler(async(req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);
    await bookToDelete.destroy();
    res.redirect('/books');

}));

module.exports = router;