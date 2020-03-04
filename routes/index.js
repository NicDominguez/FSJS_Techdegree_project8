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
  
  
// ROUTES


router.get('/', (req, res) => {
    // Redirects / to /books route
    res.redirect('/books');
});

router.get('/books', asyncHandler(async (req, res) => {
    let pageSize = 5;
    let bookList
    let totalPages

    // Determines if searchText was passed as a query and converts it to a null value instead of string
    let searchText
        if (req.query.search === "null") {
            searchText = null
        } else {
            searchText = req.query.search
        }

    
    // If a search did not occur such as aon initial page load then sets searchText to null value
    if (!searchText) {searchText = null}

    // Sets page vairable to page query or a default of 1
    let page = req.query.page;
    if (!page) { page = 1 }
    
    // If search did not take place then retrieve all book data without where clause
    if (searchText === null) {
        bookList = await Book.findAndCountAll(
            paginate( {}, {page, pageSize})
        );
        totalPages = Math.ceil(bookList.count / pageSize);
    } else {
        // If search did occur then run search data on searchText
        bookList = await Book.findAndCountAll(
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
                }, { page, pageSize }
            )
        );
        // Set total pages based on numbe rof search results
        totalPages = Math.ceil(bookList.count / pageSize);
    }

    if (bookList) {
        res.render('all_books', {bookList, page, totalPages, searchText});
    } else {
        throw error = {
            status: 500,
            message: "I'm sorry but it looks like the application had trouble accessing the library"
        };
    }
}));

router.post('/books', asyncHandler(async (req, res) => {
    let pageSize = 5;
    // Sets page vairable to page query or a default of 1
    let page = req.query.page;
    if (!page) { page = 1 }
    
    // Retrieve searchText from input field
    let searchText = req.body.bookSearch.toLowerCase()
    
    // Retrieve data based on searchText
    const bookList = await Book.findAndCountAll(
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
    // Set total pages based on numbe rof search results
    let totalPages = Math.ceil(bookList.count/pageSize)

    if (bookList.count > 0) {
        res.render('all_books', {bookList, searchText, page, totalPages});
    } else {
        // Error if no results
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
    // Creates new book data entry based on req/body
    const newBook = await Book.create(req.body);
    // Redirects to new book details page
    res.redirect('/books/' + newBook.id);

}));

router.post('/books/:id', asyncHandler(async(req, res) => {
    const bookToUpdate = await Book.findByPk(req.params.id);
    // Updates book data entry based on req/body
    await bookToUpdate.update(req.body);
    // Redirects to updated book details page
    res.redirect('/books/' + bookToUpdate.id);
}));

router.post('/books/:id/delete', asyncHandler(async(req, res) => {
    const bookToDelete = await Book.findByPk(req.params.id);
    await bookToDelete.destroy();
    res.redirect('/books');

}));

module.exports = router;