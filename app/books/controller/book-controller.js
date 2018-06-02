
const mysql = require('mysql');
const db = require('../../../config/mysql-db-context');

// Get all books
module.exports.getAllBooks = (req, res) => {
	//SELECT * FROM BOOK_TABLE
    let query = "SELECT * FROM ??";
    let table = ["book"];

    query = mysql.format(query,table);
    db.get().query(query, (error,books) => {
    	if(!books){
            return res.status(500).json({
            	success : false, 
            	error   : 'The list of books does not exist',
            	message : 'Something went wrong.'
            });
        }
        if(error) {
            res.status(500).json({
            	success : false, 
            	error: error, 
            	message : "Error executing MySQL query"
            });
        } 

        return res.json({ 
        	success: true, 
        	message : books.length !== 0 ? 
	        	"Successfully fetched the detail of the book" : 
	        	"List is currently empty", 
        	"List of Books" : books
        });
    });
}

// Get book by id
module.exports.getBookById = (req, res) => {
	//SELECT * FROM BOOK_TABLE
    let query = "SELECT * FROM ?? WHERE ??=?";
    let table = ["book", "id", req.params.id];

    query = mysql.format(query,table);
    db.get().query(query, (error,book) => {
    	if(!book){
            return res.status(500).json({
            	success : false, 
            	error   : 'The book you are looking for does not exist',
            	message : 'Something went wrong.'
            });
        }
        if(error) {
            res.status(500).json({
            	success : false, 
            	error: error, 
            	message : "Error executing MySQL query"
            });
        } 

        return res.json({ 
        	success: true, 
        	message : book.length !== 0 ? 
	        	"Successfully fetched the detail of the book" : 
	        	"List is currently empty", 
        	"Book Detail" : book[0]
        });
    });
}

// HTTP Post for creating a new book
module.exports.postCreateBook = (req, res) => {
	//INSERT INTO TABLE_SET(BOOKS FIELDS) VALUES (BOOK FIELDS VALUE)
    let query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";

    //table name follow by fields
    let table = ["book" , "BookName","AuthorName", "Price", 
    				req.body.bookName, 
    				req.body.author, 
    				req.body.price];

    query = mysql.format(query,table);

    db.get().query(query, (error) => {
        if(error) {
            res.status(500).json({
            	success : false, 
            	error: error, 
            	message : "Error executing MySQL query"
            });
        }  

        return res.status(200).json({
        	success: true,
        	message: "Successfully added a new book"
        });
    });
}

// HTTP PUT for updating a new book
module.exports.putUpdateBook = (req, res) => {
	//UPDATE BOOK_TABLE SET BOOK FIELD 1 = VALUE, BOOK FIELD 2 = VALUE  WHERE BOOK_FIELD = PARAMETER/query string
    let query = "UPDATE ?? SET ??=?, ??=?, ??=? WHERE ?? = ?";
    let table = ["book", 
        "BookName", req.body.BookName, 
        "AuthorName", req.body.AuthorName, 
        "Price", req.body.Price, 
        "id", req.params.id ];

    query = mysql.format(query, table); 

    db.get().query(query, (error, book) => {
    	if(!book){
            return res.status(500).json({
            	success : false, 
            	error   : 'The book you are looking for does not exist',
            	message : 'Something went wrong.'
            });
        }
        if(error) {
            res.status(500).json({
            	success : false, 
            	error: error, 
            	message : "Error executing MySQL query"
            });
        } 
        return res.status(200).json({ 
        	success: true, 
        	"Message" : "Book with with this id:" + req.params.id + " have been updated"});
    });  
}

// HTTP Delete for deleting a book by Id
module.exports.deleteBookById = (req, res) => {
	//DELETE FROM BOOK_TABLE WHERE BOOK_FIELD = PARAMETER/query string 
    let query = "DELETE from ?? WHERE ??=?";
    let table = ["book", "id", req.params.id];
    query = mysql.format(query,table);

    db.get().query(query,(error, book) => {
    	if(!book){
            return res.status(500).json({
            	success : false, 
            	error   : 'The book you are looking for does not exist',
            	message : 'Something went wrong.'
            });
        }
        if(error) {
            res.status(500).json({
            	success : false, 
            	error: error, 
            	message : "Error executing MySQL query"
            });
        }  
        res.status(200).json({ 
        	success: true, 
        	"Message" : "The book with this id:" + req.params.id + " has been deleted"
        });
    });
}