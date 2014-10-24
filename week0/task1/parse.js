var debug = require('debug')('parse');
var read = require('../../shared/readers/reader-file');
var args = require("minimist")(process.argv.slice(2));
var file = args._[0];
var pRemoteHttp=/^http:/;
var pRemoteHttps=/^https:/;
var pIni=/\.ini$/;
var pJson=/\.json$/;
var hasExtension;
var remoteFile;
var extension;

if (args.help || args.h) {
  printHelp(); 
  return;
}

debug('File specified: ' + file);
if (file == null) {
  console.log('Please specify file!. See help how to do it: ');
  printHelp();
  return;
}

hasExtension = (file.match(pIni) || file.match(pJson));
debug('Extension is specified: ' + hasExtension);
if (!hasExtension && (args.type == undefined)) {
  console.log('Please explicitely specify the extension! See help how to do it: ');
  printHelp();
  return;
}

remoteFile = ((null !== file.match(pRemoteHttp)) || (null !== file.match(pRemoteHttps)));
extension = getExtension();

run();


function run() {
  var read = getReader();
  var parse = getParser();
  var write = require('./modules/writer-file');
  
  read.async(file, function (data) {
    write(getOutputFileName(), parse(data));
  })
  
}

function getExtension() {  
  if (file.match(pIni)) {
    return 'ini'
  } else if (file.match(pJson)) {
    return 'json'
  } else {
    return args.type
  }  
}

// Gets appropriate reader according to the file location and protocol if remote file
function getReader() {
  if (remoteFile) {
    return (null === file.match(pRemoteHttp)) ? require('../../shared/readers/reader-https') : require('../../shared/readers/reader-http')
  } else {
    return read;
  }
}

// Get appropriate parser according to the file type
function getParser() {
  return extension === 'ini'? require('../../shared/transformers/ini-to-json') : require('../../shared/transformers/json-to-ini')
}

function getOutputFileName() {
  var f = file;
  
  if (remoteFile) {
    // in case of remote file we need only the last part
    pathParts = file.split('/');
    f = pathParts[pathParts.length - 1];
  }
  
  if (hasExtension) {
    return (extension === 'ini') ? f.replace(pIni, ".json") : f.replace(pJson, ".ini");
  } else {
    return (extension === 'ini') ? f.concat(".json") : f.concat(".ini");
  }
}

function printHelp() {
  console.log(read.sync('usage.txt'));
}