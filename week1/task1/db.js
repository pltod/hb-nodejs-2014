var storage = require('node-persist');
var collections = ['subscribers.json', 'articles.json', 'maxitem.json'];

storage.initSync();

storage.setItem(collections[0], []);
storage.setItem(collections[1], []);
storage.setItem(collections[2], []);