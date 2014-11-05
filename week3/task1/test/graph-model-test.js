var expect = require('chai').expect;
var DirectedGraph = require('../graph-model');


describe('Graph', function() {

  describe('#addEdge()', function() {
    it('should add edge', function() {
      var graph = new DirectedGraph();
      graph.addEdge('node0', 'node1');
      graph.addEdge('node0', 'node2');
      graph.addEdge('node1', 'node3');
      expect(graph.getNodes()).to.deep.equal({
        'node0': ['node1', 'node2'],
        'node1': ['node3']
      });
    })
  })

  describe('#addEdges()', function() {
    it('should add edges', function() {
      var graph = new DirectedGraph();
      graph.addEdges('node0', ['node1', 'node2']);
      expect(graph.getNodes()).to.deep.equal({
        'node0': ['node1', 'node2']
      });
    })
  })

  describe('#addDistance()', function() {
    it('should add distance info', function() {
      var graph = new DirectedGraph();
      graph.addDistance('node1', 1);
      expect(graph.getDistance('node1')).to.be.equal(1);
    })
  })

  describe('#getNeighboursFor()', function() {
    it('should get neighbours for node', function() {
      var graph = new DirectedGraph();
      graph.addEdges('node0', ['node1', 'node2']);
      expect(graph.getNeighboursFor('node0')).to.deep.equal(['node1', 'node2']);;
    })
  })

  describe('#pathBetween()', function() {
    it('should get neighbours for node', function() {
      var graph = new DirectedGraph();
      graph.addEdges('node0', ['node1', 'node2']);
      graph.addEdges('node1', ['node3', 'node4']);
      graph.addEdges('node2', ['node1', 'node5']);
      expect(graph.pathBetween('node0', 'node1')).to.be.true;      
      expect(graph.pathBetween('node0', 'node4')).to.be.true;      
      expect(graph.pathBetween('node0', 'node5')).to.be.true;
      expect(graph.pathBetween('node0', 'node6')).to.be.false;
    })
  })
  
  describe('#toString()', function() {
    it('should stringify the graph data', function() {
      
    })
  })


})
