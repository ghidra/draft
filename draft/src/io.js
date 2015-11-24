draft.io=function(){
	return this.init();
}
draft.io.prototype.init=function(){
	//first see if we have access to a database...
	//if not fall back to local storage (which is just for demo purposes and testing)
	//maybe give the option to switch between if both are available
	this.storage = new rad.localstorage();
	return this;
}
//---------------------
draft.io.prototype.list=function(){
	//get list of saved
	var files = this.storage.getobj("files");
	if(!files){//there are no files already saved
		return null;
	}else{
		var file_names=[];
		for (n in files){
			file_names.push(n);
		}
		return file_names;
	}
	//console.log(files);
}
draft.io.prototype.save=function(name,src){
	//save the file
	//i need to sanitize the src before saving it
	//if using local storage get the file object first, to add to it
	var files = this.storage.getobj("files");
	if(!files){//there are no files already saved
		var new_file = {};
		new_file[name]=src;
		this.storage.setobj("files",new_file);
	}else{
		//there are saved files, lets append, or overwrite
	}
}
draft.io.prototype.load=function(name){
	//load file, return object to be processed
	var files = this.storage.getobj("files");
}

/*local storage should look like:

{
	files:{
		file0:{},
		file1:{}
	}
}

file0:{
	nodes:{},
	lines:{},
	scripts:{
		nodes:{},
		lines:{},
		scripts:{}
	}
}

*/