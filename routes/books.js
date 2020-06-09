const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Book } = require("../models");

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };
}

/* GET listing of books */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // if no cookies, create an empty object
    if (!req.cookies) {
      req.cookies = {};
    }

    // URL querys that are also stored in cookies to save state
    const sortBy = req.query.sortBy || req.cookies.sortBy || "title";
    const direction = req.query.direction || req.cookies.direction || "ASC";
    const searchQuery = req.query.searchQuery || req.cookies.searchQuery || "";

    // boilerplate table headings
    let headers = {
      title: { direction: "ASC" },
      author: { direction: "ASC" },
      genre: { direction: "ASC" },
      year: { direction: "ASC" },
    };

    // depending on the current query, table headings will be changed accordingly
    // if current direction is ASC, change the 'direction' property of the currently
    // sorted table so that if it is clicked again, it will be DESC.
    // Also, toggle the direction of the arrows
    if (direction === "ASC") {
      headers[sortBy].direction = "DESC";
      headers[sortBy].arrow = "up";
    } else if (direction === "DESC") {
      headers[sortBy].arrow = "down";
    }

    // find all books that match the query and return the results in the correct order
    const books = await Book.findAll({
      order: [[sortBy, direction]],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
          {
            author: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
          {
            genre: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
          {
            year: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
        ],
      },
    });

    // place cookies for the current query items to save state
    res.cookie("sortBy", sortBy);
    res.cookie("direction", direction);
    res.cookie("searchQuery", searchQuery);

    res.render("books/all_books", {
      title: "Books",
      books,
      headers,
      sortBy,
      searchQuery,
    });
  })
);

/* Clear search form */
router.get("/clearSearch", (req, res) => {
  res.clearCookie("searchQuery");
  res.redirect("/books");
});

/* GET new book form */
router.get(
  "/new",
  asyncHandler(async (req, res) => {
    res.render("books/new_book", { title: "New Book", book: {} });
  })
);

/* POST new book to database */
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        //if not all fields are valid
        console.log("seqvalErr");
        book = await Book.build(req.body);
        console.log(book.toJSON());
        res.render("books/new_book", {
          book: book.toJSON(),
          errors: error.errors,
        });
      } else {
        throw error;
      }
    }
  })
);

/* GET info for individual book */
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      const error = new Error("404 - not found");
      next(error);
      res.redirect("/books");
    } else {
      res.render("books/book_detail", { book });
    }
  })
);

/* POST update for individual book */
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/books");
      } else {
        res.status(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        console.log("SeqValErr");
        book = await Book.build(req.body).toJSON();
        book.id = req.params.id;
        console.log(error.errors);
        res.render("books/book_detail", { book, errors: error.errors });
      }
    }
  })
);

/* POST a delete request for an individual book */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
