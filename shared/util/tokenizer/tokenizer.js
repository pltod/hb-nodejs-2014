var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

module.exports = {
  tokenize: function (text) {
    return tokenizer.tokenize(text);
  }
}