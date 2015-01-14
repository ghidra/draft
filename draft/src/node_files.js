draft.node_files=function(){
        return this.init();
}

draft.node_files.prototype.init=function(){
        //var _this = this;
	if (window.File && window.FileReader && window.FileList && window.Blob) {
                window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
                window.requestFileSystem(window.TEMPORARY, 1024*1024, fsInit, fsError);
                return this;
        } else {
                alert('The File APIs are not fully supported in this browser.');
        }
}
//-----------
function fsToArray(list){
	return Array.prototype.slice.call(list || [], 0);
}
function fsResults(entries){
	//var fragment = document.createDocumentFragment();
	var s = "";
        entries.forEach(function(entry, i) {
        	//var img = entry.isDirectory ? 'folder' :'file';
                s += entry.name;
        });

        alert(s);
}
function fsDirScan(fs){
	var dirReader = fs.root.createReader();
        var entries = [];
        var readEntries = function() {
                dirReader.readEntries (function(results) {
                        if (!results.length) {
                                fsResults(entries.sort());
                        } else {
                                entries = entries.concat(fsToArray(results));
                                readEntries();
                        }
                }, fsError);
        };

        readEntries(); // Start reading os
}
function fsInit(fs){
	console.log("opened file system:"+fs.name);
	fsDirScan(fs);
}
function fsError(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
} 
