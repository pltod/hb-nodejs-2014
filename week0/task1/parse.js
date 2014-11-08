var debug = require('debug')('parse');
var path = require('path');
var args = require("minimist")(process.argv.slice(2));
var readerLocal = require('../../shared/io/reader/reader-file');


// Prints help if required
if (args.help || args.h) {
  printHelp(); 
  return;
}

// Invoke the program
run(prepareContext(args._[0]));


// Main flow - read, parse, and write. 
// Weaves the appropriate reader, parser, and writer acording the the context.
function run(context) {
  debug(context);
  
  if (!context.valid) {
    return;
  }
  
  var read = context.isRemoteFile ? require('../../shared/io/reader-writer/node-http') : readerLocal;
  var parse = (context.fileExt === 'ini') ? require('../../shared/util/transformer/ini-to-json') : require('../../shared/util/transformer/json-to-ini');
  var write = require('../../shared/io/writer/writer-file');
  var outputFileName = (context.fileExt === 'ini') ? context.fileName.concat(".json") : context.fileName.concat(".ini");
  
  read.async(context.fileWithPath, function (err, data) {
    if (err) throw err;
    write(outputFileName, parse(data));
  })
  
}

// Validates the input.
// Prepares the context - remote or local file, file extension, file name etc.
function prepareContext(fileWithPath) {
  var pRemoteHttp=/^http:/;
  var pRemoteHttps=/^https:/;
  var file, fileName, fileExt, hasExt, isRemoteFile;

  debug('File specified: ' + fileWithPath);
  if (fileWithPath == null) {
    console.log('Please specify file!. See help how to do it: ');
    printHelp();
    return {
      valid: false
    }
  } else {
    file = path.basename(fileWithPath);
    fileExt = path.extname(file);
    fileName = path.basename(file, fileExt);
    isRemoteFile = ((null !== fileWithPath.match(pRemoteHttp)) || (null !== fileWithPath.match(pRemoteHttps)));
  }

  if (fileExt==='') {
    hasExt = false;
    if (args.type == undefined) {
      console.log('Please explicitely specify the extension! See help how to do it: ');
      printHelp();
      return {
        valid: false
      }
    } else {
      fileExt = args.type
    }
  } else {
    hasExt = true;
    fileExt = fileExt.substring(1, fileExt.length);
  }
  
  return {
    valid: true,
    fileWithPath: fileWithPath,
    fileName: fileName,
    fileExt: fileExt,
    hasExt: hasExt,
    isRemoteFile: isRemoteFile 
  }
}

// Prints help.
function printHelp() {
  console.log(readerLocal.sync('usage.txt'));
}