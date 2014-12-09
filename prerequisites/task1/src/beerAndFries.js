var _ = require('underscore');

// The requirements does not explicitely state that the input data is ordered - beers first, fries last.
// Ordering could be implied by the example test suit.
// Still this method makes the classification.
function classify(data) {
  return _.reduce(data, function (memo, item) {
    item.type === 'beer' ? memo.beers.push(item) : memo.fries.push(item);
    return memo;
  }, {beers: [], fries: []})
}

// This method is doing total score calculation of all possible pairings of particular beer.
// This is the input data structure used by the main algorithm.
// It looks like: [[all total scores for beer1], [all total scores for beer2], [all total scores for beer3], etc.]
function calcAllPairTotalScores(data) {
  return _.reduce(data.beers, function (memo, beer) {
    return memo.concat([_.map(data.fries, function (fr) {
      return beer.score * fr.score
    })])
  }, [])
}

// Main algorithm is implemented inside this function and more specifically in the inner calculate function.
// Input data structure used [[all total scores for beer1], [all total scores for beer2], [all total scores for beer3], etc.]

// Brief algorithm description:
// - the inner arrays hold total score per beer so we could have exactly one score of each inner array that take part in the final sum. So:
// - take one total score from the inner array
// - use it only if the fries that participate in the current total score are not previously used
// - move to the next inner array and pick up a proper total score
// - when reach the final group of total scores (last inner array in the input structure) calculate the final sum and store it if it is higher the the current higher sum
// - then return to the previous group take another valid total score and start going forward again until reaching the end of the data structure
function go(groups, sum, usedScores) {

  var currentSum = 0;
  var highestSum = 0;
  
  calculate(groups, sum, usedScores);
  
  return highestSum;

  function calculate(groups, sum, usedScores) {
    
    if (notLastGroup(groups)) {
      // In case this is not the last group with total scores
      // iterate over the group until find valid total score and continue with the next group
      _.map(groups[0], function (score, scoreIndex) {
        var cachedGroups = groups.slice();
        var cachedSum = sum;
        var cachedUsedScores = usedScores.slice();
        
        if (friesScoreNotUsed(cachedUsedScores, scoreIndex)) {
          cachedSum = cachedSum + score;
          cachedUsedScores.push(scoreIndex);
          cachedGroups.shift();
          calculate(cachedGroups, cachedSum, cachedUsedScores);
        }
      }) 
    } else {
      // Last group...iterate over all elements and do the final sum calculation adding the total score that is not previously used
      _.map(groups[0], function (score, scoreIndex) {
        if (friesScoreNotUsed(usedScores, scoreIndex)) {
          updateHighestSum(sum + score);
        }
      })
    }
  }
  
  // UTILITY FUNCTIONS BELLOW
  function updateHighestSum(sum) {
    if (sum > highestSum) {
      highestSum = sum;
    }
  }
  
  function notLastGroup(groups) {
    return groups.length > 1
  }

  function friesScoreNotUsed(usedScores, scoreIndex) {
    return !_.contains(usedScores, scoreIndex)
  }
  
}

exports.beerAndFries = function (data) {
  return go(calcAllPairTotalScores(classify(data)), 0, []);
}