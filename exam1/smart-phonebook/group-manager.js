var debug = require('debug')('group-manager');
var config = require('./config.json');
var util = require('../../shared/util/tokenizer');
var _ = require('lodash');

module.exports = {
  process: function (db, newContact, callback) {
    // Find all contacts records
    db.findAllContacts(function(err, contacts) { 
      debug(contacts.length)
      // Compare against each contact
      _.each(contacts, function (oldContact) {
        debug('dsadadasas');
        // Do not compare with itself
        if (!(newContact._id.toString() === oldContact._id.toString())) {
          // Separate the process on two parts to block for less time
          // Part 1
          processExactGroups(db, oldContact, newContact, function (err, result) {
            err ? console.log(err) : console.log(result)
          });
        
          // Schedule Part 2 in the next event loop; We could play with the delay of the setImmediate 
          setImmediate(function () {
            processFuzzyGroups(db, oldContact, newContact, function (err, result) {
              err ? callback(err, null) : callback(null, result)
            })
          }, 0)
        }
      })
    })
  }
}

function processExactGroups(db, oldContact, newContact, callback) {
  console.log(newContact)
    console.log(oldContact)
  var matchingWords = _.intersection(
    util.lowerAndSplit(newContact.personIdentifier), 
    util.lowerAndSplit(oldContact.personIdentifier)
  );
  var expectedRequests = matchingWords.length;
  var finishedRequests = 0;
  _.each(matchingWords, function (word) {
    var cWord = util.capitalizeFirst(word);
    db.saveOrUpdateExactGroup(
      util.capitalizeFirst(word), 
      newContact, 
      oldContact,
      function (err, result) {
        if (expectedRequests === ++finishedRequests) {
          // Do not release the Zalgo
          setImmediate(function () {
            callback('EXACT GROUPS PROCESSED!')
          }, 0)
        }
      }
    );
  })
}

function processFuzzyGroups(db, oldContact, newContact, callback) {
  var newWords = util.lowerAndSplit(newContact.personIdentifier);
  var oldWords = util.lowerAndSplit(oldContact.personIdentifier);
  var expectedRequests = newWords.length * oldWords.length;
  var finishedRequests = 0;
  _.each(newWords, function (word1) {
    _.each(oldWords, function (word2) {
      var cWord1 = util.capitalizeFirst(word1);
      var cWord2 = util.capitalizeFirst(word2);
      if (util.notTooFuzzy(0, 3, cWord1, cWord2)) {
        db.saveOrUpdateFuzzyGroup(
          cWord1, 
          cWord2, 
          newContact, 
          oldContact,
          function (err, result) {
            if (expectedRequests === ++finishedRequests) {
              // Do not release the Zalgo
              setImmediate(function () {
                callback('FUZZY GROUPS PROCESSED!')
              }, 0)
            }
          }
        )
      }
    })      
  })
}

