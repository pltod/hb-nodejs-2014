var _ = require('underscore');
var utils = require('../../shared/db/utils');
var graphs = [];

module.exports = {
  insert: insert,
  findById: findById,
  findByOwnerAndDepth: findByOwnerAndDepth,
  deleteByOwnerAndDepth: deleteByOwnerAndDepth,
  findAllGraphsInfo: findAllGraphsInfo,
  findGraphById: findGraphById
}

//  Format of graph: {id, owner, depth, data}
function insert(graph) {
  graph.id = utils.uid();
  graphs.push(graph);
  return graph.id;
}

function findById(id) {
  return _.findWhere(graphs, {id: id})
}

function findByOwnerAndDepth(owner, depth) {
  return _.findWhere(graphs, {owner: owner, depth: depth})
}

function deleteByOwnerAndDepth(owner, depth) {
  return _.filter(graphs, function(graph){ return ((graph.owner !== owner) && (graph.depth !== depth)) })
}

function findAllGraphsInfo() {
  return _.map(graphs, function (graph) {
    return _.pick(graph, 'id', 'owner', 'depth');
  })
}

function findGraphById(id) {
  var graph = findById(id);
  if (graph) {
    return graph.data.toString()
  }
  
  return 'Graph with ' + id + ' does not exists';
}
