var _ = require('underscore');

function classify(data) {
  return _.reduce(data, function (memo, item) {
    item.type === 'beer' ? memo.beers.push(item) : memo.fries.push(item);
    return memo;
  }, {beers: [], fries: []})
}

function calcAllPairTotalScores(data) {
  return _.reduce(data.beers, function (memo, beer) {
    return memo.concat([_.map(data.fries, function (fr) {
      return beer.score * fr.score
    })])
  }, [])
}

function identifyPairs(indexes) {
  return _.reduce(indexes, function (initial, value, index) {
    return initial.concat(" beer" + ++index + " with " + "fries" + ++value);
  }, [])
}

function go(groups, sum, usedScores) {

  var currentSum = 0;
  var highestSum = 0;
  var combination;
  
  calculate(groups, sum, usedScores);
  
  return {
    highestSum: highestSum,
    bestCombination: identifyPairs(combination)
  }

  function calculate(groups, sum, usedScores) {

    if (notLastGroup(groups)) {
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
      // Last group...do the final sum calculation
      _.map(groups[0], function (score, scoreIndex) {
        if (friesScoreNotUsed(usedScores, scoreIndex)) {
          updateHighestSum(sum + score, usedScores.concat(scoreIndex));
        }
      })
    }
  }
  
  function updateHighestSum(sum, usedScored) {
    if (sum > highestSum) {
      highestSum = sum;
      
      // for the extra feature of storing the best combination
      // if we have two combinations that gives highest sum the first one found is returned      
      combination = usedScored;
    }
  }
  
  function notLastGroup(groups) {
    return groups.length > 1
  }

  function friesScoreNotUsed(usedScores, scoreIndex) {
    return !_.contains(usedScores, scoreIndex)
  }
  
}

module.exports = function (data) {
  return go(calcAllPairTotalScores(classify(data)), 0, []);
}