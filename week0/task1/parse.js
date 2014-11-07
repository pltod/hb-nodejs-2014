var debug = require('debug')('parse');
var path = require('path');
var args = require("minimist")(process.argv.slice(2));
var readerLocal = require('../../shared/io/reader/reader-file');


if (args.help || args.h) {
  printHelp(); 
  return;
}

run(validateAndAnalyze(args._[0]));

function run(options) {
  debug(options);
  
  if (!options.valid) {
    return;
  }
  
  var read = options.isRemoteFile ? require('../../shared/io/reader-writer/node-http') : readerLocal;
  var parse = (options.fileExt === 'ini') ? require('../../shared/util/transformer/ini-to-json') : require('../../shared/util/transformer/json-to-ini');
  var write = require('../../shared/io/writer/writer-file');
  var outputFileName = (options.fileExt === 'ini') ? options.fileName.concat(".json") : options.fileName.concat(".ini");
  
  read.async(options.fileWithPath, function (err, data) {
    if (err) throw err;
    write(outputFileName, parse(data));
  })
  
}

function validateAndAnalyze(fileWithPath) {
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

function printHelp() {
  console.log(readerLocal.sync('usage.txt'));
}