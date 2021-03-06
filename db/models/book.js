const Sequelize = require('sequelize');

// Creates Book model with validation
module.exports = (sequelize) => {
    class Book extends Sequelize.Model { }
    Book.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "author"'
                },
                notEmpty: {
                    msg: 'Please provide a value for "title"'
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "author"'
                },
                notEmpty: {
                    msg: 'Please provide a value for "author"'
                }
            }
        },
        genre: Sequelize.STRING,
        year: Sequelize.INTEGER
    }, { sequelize });

    return Book;
};
