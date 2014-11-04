module.exports = {
  api: {
    mock: true,
    mockData: [
      {"user": "node1", "following": [{"login": "node2"}, {"login": "node3"}]}, // depth 1
      {"user": "node2", "following": [{"login": "node1"}, {"login": "node4"}]}, // depth 2 
      {"user": "node3", "following": [{"login": "node4"}, {"login": "node5"}]}, // depth 2
      {"user": "node4", "following": [{"login": "node6"}, {"login": "node7"}]}, // depth 3
      {"user": "node5", "following": [{"login": "node8"}, {"login": "node9"}, {"login": "node10"}]}  // depth 3
    ],
    token: 'YOUR ACCESS TOKEN HERE'  
  },
  regenerate: false
}