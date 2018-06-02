const express   = require('express');
const router    = express();

const bookController = require('../controller/book-controller');

/* Get list of books */
router.route('/').get(bookController.getAllBooks);
router.route('/details/:id').get(bookController.getBookById);

router.route('/create').post(bookController.postCreateBook);
router.route('/update/:id').put(bookController.putUpdateBook);
router.route('/delete/:id').delete(bookController.deleteBookById);

module.exports = router;
