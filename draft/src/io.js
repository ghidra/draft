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
draft.io.prototype.list_local=function(){
	//get list of saved
	//alert(draft.logged_in);
	var file_names=[];
	//if(!draft.logged_in)
	//{
		//alert("we are getting local storage files");
		//this is the brute force local storage way
		var files = this.storage.getobj("files");
		if(!files){//there are no files already saved
			return null;
		}else{
			for (n in files){
				file_names.push(n);
			}
			return file_names;
		}
	//}
	//else
	//{
		//draft.database_query.get_categories_and_compounds();
		/*draft.ajax.get(
			draft.php,
			"q=get_compound_list",
			function(lamda){
				data = JSON.parse(lamda);

				for (var i=0;i< data.compounds.length;i++){
					//console.log(data.compounds[i].name);
					file_names.push(data.compounds[i].name);
					//NOW I NEED TO ACTUALLY CALL ANOTHER COMMAND TO FILL IN THE DROP DOWN
				}
			}
		);*/
	//}
	
}
draft.io.prototype.save=function(name,src,cat){
	//save the file
	var src_clean=this.sanitize_script(src);
	var category = cat||"uncategorized";

	if(!draft.logged_in)
	{
		//if using local storage get the file object first, to add to it
		var files = this.storage.getobj("files");

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
	}else{
		////////////LOGGED INTO A DATABASE SAVE IT THERE
		var obj ={};
		obj.q = "save_script";
		obj.name = name;
		obj.data = JSON.stringify(src_clean);
		obj.category = category;
		//obj.isnewcat = isnewcat;
		draft.ajax.post(
			draft.php,
			obj,
			function(lamda){
				//data = JSON.parse(lamda);
				//draft.logged_in=data.logged_in;
				//document.getElementById(draft.logincontainer_id).innerHTML = data.html;
				//document.getElementById(draft.logincontainer_id).innerHTML = lamda;
				//if(draft.logged_in)console.log("logged in");
				alert(lamda);
			}
		);
	}
	//console.dir(src);
	//console.log( JSON.stringify(this.sanitize_script(src)) );
}
draft.io.prototype.load=function(name){
	//load file, return object to be processed
	//get all the local files
	if(!draft.logged_in)
	{
		var files = this.storage.getobj("files");
		if(files[name]){
			console.log(files[name]);
			draft.set_script(0,files[name]);
			//return files[name];//return the specfic file requested
		}else{
			alert(name+' file not found in local storage');
			//return 'none';
		}
	}
	else
	{
		//GET IT FROM DATABASE
		draft.ajax.get(
			draft.php,
			"q=get_compound&compound_name="+name,
			function(lamda){
				data = JSON.parse(lamda);
				console.log('-----------------');
				console.log(data);
				///needs to be parsed again to turn it into an object
				//console.log('went to php to get saved compound');
				draft.set_script(0,JSON.parse(data.storage));
			}
		);
		//alert("we have no load mechanism for database loading yet");
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