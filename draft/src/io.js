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

	//this is the brute force local storage way
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
	//if using local storage get the file object first, to add to it
	var files = this.storage.getobj("files");
	var src_clean=this.sanitize_script(src);

	if(!files){//there are no files already saved
		var new_file = {};
		new_file[name]=src_clean;
		//console.log(name)
		this.storage.setobj("files",new_file);
	}else{
		//there are saved files, lets append, or overwrite
		files[name]=src_clean;
		this.storage.setobj("files",files);
	}
}
draft.io.prototype.load=function(name){
	//load file, return object to be processed
	//get all the local files
	var files = this.storage.getobj("files");
	if(files[name]){
		return files[name];//return the specfic file requested
	}else{
		return 'none';
	}
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

notes:
clear out with chrome dev tools
	draft.file.storage.storage.clear()
get output
	draft.file.storage.getobj("files")
*/
draft.io.prototype.sanitize_script=function(src){
	//this will take the javscript object and remove anything that we dont need to save, and fold it into 
	//something cleanr to save
	//recursive, to include embedded scripts
	//we have nodes, lines, and scripts, ids, and scale
	var clean = {};
	clean.ids=rad.objclonefast(src.ids);
	clean.scale=rad.objclonefast(src.scale);
	clean.nodes={};
	clean.lines={};
	//clean.scripts=this.santize_scripts(src.scripts);

	for(n in src.nodes){
		clean.nodes[n] = src.nodes[n].sanitize();
	}

	for(l in src.lines){
		clean.lines[l] = src.lines[l].sanitize();
	}

	return clean;
}