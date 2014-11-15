var debug = require('debug')('group-manager');
var config = require('./config.json');
var util = require('../../shared/util/tokenizer');
var _ = require('lodash');

module.exports = {
  process: function (db, newContact, callback) {
    // Find all contacts records
    db.findAllContacts(function(err, contacts) { 
      var expectedRequests = contacts.length;
      var finishedRequests = 0;

      // Compare against each contact
      _.each(contacts, function (oldContact) {
        // Do not compare with itself
        if ((newContact._id.toString() === oldContact._id.toString())) {
          finishedRequests++;
        } else {
          // Separate the process on two parts to block for less time
          // Part 1
          processExactGroups(db, oldContact, newContact, function (err, result) {
            err ? console.log(err) : console.log(result)
          });
        
          // Schedule Part 2 in the next event loop; We could play with the delay of the setImmediate 
          setImmediate(function () {
            processFuzzyGroups(db, oldContact, newContact, function (err, result) {
              finishedRequests++;
              err ? console.log(err) : console.log(result);
              
              if (expectedRequests === finishedRequests) {
                callback(null, "GROUP MANAGEMENT DONE!");
              }
            })
          })
        }
      })
    })
  }
}

function processExactGroups(db, oldContact, newContact, callback) {
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
        finishedRequests++;
        if (expectedRequests === finishedRequests) {
          // Do not release the Zalgo
          setImmediate(function () {
            callback(null, 'EXACT GROUPS PROCESSED!')
          })
        }
      }
    );
  })
}

function processFuzzyGroups(db, oldContact, newContact, callback) {
  var newWords = util.lowerAndSplit(newContact.personIdentifier);
  var oldWords = util.lowerAndSplit(oldContact.personIdentifier);
  var fuzzyMatch = [], finishedRequests = 0, expectedRequests;

  _.each(newWords, function (word1) {
    _.each(oldWords, function (word2) {
      var cWord1 = util.capitalizeFirst(word1);
      var cWord2 = util.capitalizeFirst(word2);
      if (util.notTooFuzzy(0, 3, cWord1, cWord2)) {
        fuzzyMatch.push([cWord1, cWord2]);
      }
    })
  })
  expectedRequests = fuzzyMatch.length;
  _.each(fuzzyMatch, function (pair) {
        db.saveOrUpdateFuzzyGroup(
          pair[0], 
          pair[1], 
          newContact, 
          oldContact,
          function (err, result) {
            finishedRequests++;
            if (expectedRequests === finishedRequests) {
              // Do not release the Zalgo
              setImmediate(function () {
                callback(null, 'FUZZY GROUPS PROCESSED!')
              })
            }
          }
        )
    })      
}

