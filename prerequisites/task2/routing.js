/*global db*/
'use strict';

function setupRoutes(app) {

  /* Get single item from the database. Response should be in the following format
       {
          Result: (Object: Item with the specified id)
       }

   If the item doest not exist then an Error must be returned to the user.
       {
          Error: 'Item not found'
       }
   with a status code of 404.*/
  app.get('/db/:id', function(req, res, next) {
    var id = req.params.id;

    db.getById(id, function(err, item) {
      if (err) {
        if (err === 'Item not found') {
          res.status(404).send({
            Error: err
          });
        } else {
          next(err);
        }
      } else {
        res.status(200).send({
          Result: item
        });
      }
    });
  });


  /* Get all items in the database. Response should be in the following format
   {
      Result: (Array of objects: all items in the database)
   } */
  app.get('/db', function(req, res, next) {
    db.getAll(function(err, items) {
      if (err) {
        next(err); //HINT: calling next with an error automatically handles the error and sends a response to the user.
      } else {
        res.status(200).send({
          Result: items
        });
      }
    });
  });



  /*Creates the item. Response should be in the following format:
       {
          Result: (Object: item that was created)
       }
   with a status code of 201.

  If another item exists with the same id we want to return:
      {
          Error: <errorMessage>
      }
  with a status code of 400.*/
  app.post('/db', function(req, res, next) {
    var item = req.body;
    db.addItem(item, function(err, createdItem) {
      if (err) {
        res.status(400).send({
          Error: 'Item with the same id already exists'
        });
      } else {
        res.status(201).send({
          Result: createdItem
        });
      }
    });
  });


  app.post('/db/:id', function(req, res, next) {
    var id = req.params.id;
    var item = req.body;
    db.updateById(id, item, function(err, updatedItem) {
      if (err) {
        res.status(404).send({
          Error: 'Item not found'
        });
      } else {
        res.status(201).send({
          Result: updatedItem
        });
      }
    });
  });


  app.delete('/db', function(req, res, next) {
    /*
       Delete all items in the database. Response should contain the count of the delete items like so:
           {
              Result: (Number: count of the items)
           }
       */
    db.deleteAll(function(err, numberOfDeleted) {
      if (err) {
        res.status(404).send({
          Error: 'Error while deleting all items!'
        });
      } else {
        res.status(201).send({
          Result: numberOfDeleted
        });
      }
    });    
  });


  app.delete('/db/:id', function(req, res, next) {
    var id = req.params.id;
    db.deleteById(id, function(err, deletedItem) {
      if (err) {
        res.status(404).send({
          Error: 'Item not found'
        });
      } else {
        res.status(201).send({
          Result: deletedItem
        });
      }
    });
  });

};

module.exports = {
    setup: setupRoutes
};