const express = require('express');
const router = express.Router();
const { Book } = require('../models');

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

/* GET listing of books */
router.get('/', asyncHandler(async (req, res) => {
  res.send('<h1>Hello World</h1>')
}));


/* GET new book form */
router.get('/new', asyncHandler(async (req, res) => {

}));


/* POST new book to database */
router.post('/new', asyncHandler(async (req, res) => {

}));


/* GET info for individual book */
router.get('/:id', asyncHandler(async (req, res) => {

}));


/* POST update for individual book */
router.post('/:id', asyncHandler(async (req, res) => {

}));

/* POST a delete request for an individual book */
router.post('/:id/delete', asyncHandler(async (req, res) => {

}));

module.exports = router;