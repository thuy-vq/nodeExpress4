const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();
// const sql = require('mssql');

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      // (async function query() {
      //   try {
      //     const request = new sql.Request();
      //     const { recordset } = await request.query('select * from books');
      //     res.render(
      //       'bookListView',
      //       {
      //         nav,
      //         title: 'Library',
      //         books: recordset
      //       }
      //     );
      //   } catch (err) {
      //     debug(err.stack);
      //   }
      // }());




      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = await db.collection('books');

          const books = await col.find().toArray();

          res.render(
            'bookListView',
            {
              nav,
              title: 'Library',
              books
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  bookRouter.route('/:id')
    // .all((req, res, next) => {
    //   const { id } = req.params;
    //   (async function query() {
    //     try {
    //       const request = new sql.Request();
    //       const { recordset } = await request.input('id', sql.Int, id)
    //         .query('select * from books where id = @id');
    //       [req.book] = recordset;
    //       next();
    //     } catch (err) {
    //       debug(err.stack);
    //     }
    //   }());
    // })
    .get((req, res) => {
      // res.render(
      //   'bookView',
      //   {
      //     nav,
      //     title: 'Library',
      //     book: req.book
      //   }
      // );


      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      const { id } = req.params;
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = await db.collection('books');

          const book = await col.findOne({ _id: new ObjectID(id) });
          debug(book);
          res.render(
            'bookView',
            {
              nav,
              title: 'Library',
              book
            }
          );
        } catch (err) {
          debug(err.stack);
        }
      }());
    });
  return bookRouter;
}

module.exports = router;
