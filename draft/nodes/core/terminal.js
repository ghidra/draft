draft.nodes.core.terminal=function(){
	this.init();
	return this;
};

draft.nodes.core.terminal.prototype=new draft.node_framework();
draft.nodes.core.terminal.prototype.constructor=draft.node_framework;

draft.nodes.core.terminal.prototype.init=function(){
	draft.node_framework.prototype.init.call();

	this.label="terminal";

	this.inputs.element="";

	//the terminal "element" is the output preview window to draw to
	//we can try to grab this automatically
	var eid = draft.output_preview.id;

	this.inputs.passthrough=1;
	this.inputs_values={
		"element":eid
	}
	//this.types={
		this.types.input={
			"element":"string",
			"passthrough":'none'
		}
	//};

	//this.store_defaults();
}

//this is the render function
//being as it is the terminal node, the output of this will be the final output
draft.nodes.core.terminal.prototype.render=function(mode){
	//loop the inputs
	//get what is connected, and start to loop those
	
	/*for(p in this.inputs_values){
		if(this.inputs_values.hasOwnProperty(p)){//only use the unique properties
			if(p!='element'){//ignore elements
				output+=this.inputs_values[p];
			}
		}
	}*/
	var output="";
	this.loop_inputs(
		function(key,value){
			if(key!="element"){
				if(typeof value != "string"){
					output=value;
				}else{
					output+=value;
				}
			}
		}
	);
	return output;
	//return document.createElement("DIV");
}

///-------------------------
//specific paramaters
///this is going to be my save and load for now
///-------------------------
draft.nodes.core.terminal.prototype.parameters=function(id,width,width_input,width_label,margin){
	var element = document.createElement("DIV");
	element.style.display="inline-block";
	element.style.width="100%";

	var label = document.createElement("DIV");
	label.innerHTML="&nbsp;"+"file save";
	label.className="parameter_label";
	label.style.width=(width-(margin*2))+"px";
	label.style.display="inline-block";

	element.appendChild(label);

	//console.log("draft.nodes.core.terminal.parameters:"+id);
	//make the text box to save
	var tb_saveas = new rad.textbox({
		"id":id,
		"label":"save as",
		"value":"",
		//"width":width_input,
		//"width_label":width_label,
		//"margin":margin,
		//"fontsize":draft.font.size
		"style":{
			//"width":width_input,
			"width":width,
			"margin":margin,
			"fontSize":draft.font.size
		},
		"style_textbox":{
			"width":width_input
		}
	});
	//the html elements id = tb_0_save as
	element.appendChild(tb_saveas.getelement());

	var bu_save = new rad.button({
		"id":id,
		"label":"save",
		//"width":width_input,
		//"width_label":width_label,
		//"margin":margin,
		//"fontsize":draft.font.size,
		"style":{
			"width":width,
			"margin":margin,
			"fontSize":draft.font.size
		},
		"style_button":{
			"width":width_input
		},
		"callback":function(arg){
			//get the save file name
			var filename = document.getElementById("tb_"+id+"_save as").value;
			if(filename===""){
				alert("save: no file name given");
				return null;
			}
			//console.log(filename);
			//send that to the save function
			//draft.file.save(filename,{data:"lots of data"});
			draft.file.save(filename,draft.scripts[0]);
			//now clear the save as text input value, and update the list
			//probably best to just reload the parameters
			//document.getElementById("tb_"+id+"_save as").value="";
			draft.scripts[0].nodes[0].refresh_parameters();
		}
	});

	element.appendChild(bu_save.getelement());

	///---------

	var labelload = document.createElement("DIV");
	labelload.innerHTML="&nbsp;"+"file load";
	labelload.className="parameter_label";
	labelload.style.width=(width-(margin*2))+"px";
	labelload.style.display="inline-block";

	element.appendChild(labelload);

	//now we need to look and see if we have database storage or local storage
	//if local storage, we make a drop down with the data that we find
	
	var file_list = draft.file.list();
	if(!file_list){//no files found,make the arrays we need
		file_list = ["no files found"];
	}
	//console.log(file_list[0]);
	
	var dd_files = new rad.dropdown({
		"id":id,
		"label":"load script",
		"options":file_list,
		"value":0,
		//"width":width_input,
		//"width_label":width_label,
		//"margin":margin,
		//"fontsize":draft.font.size,
		"style":{
			"width":width,
			"margin":margin,
			"fontSize":draft.font.size
		},
		"style_dropdown":{
			"width":width_input
		}
	});

	element.appendChild(dd_files.getelement());

	var bu_load = new rad.button({
		"id":id,
		"label":"load",
		//"width":width_input,
		//"width_label":width_label,
		//"margin":margin,
		//"fontsize":draft.font.size,
		"style":{
			"width":width,
			"margin":margin,
			"fontSize":draft.font.size
		},
		"style_button":{
			"width":width_input
		},
		"callback":function(arg){
			//get the file id from the dropdown
			var fileid = document.getElementById("dd_"+id+"_load script").value;
			var filename = file_list[fileid];
			//console.log("lets load: "+filename);
			var loadedfile = draft.file.load(filename);
			if (loadedfile != 'none'){
				//console.log(loadedfile);
				draft.set_script(0,loadedfile);//load the file
			}else{
				alert(filename+' file not found');
			}
		}
	});

	element.appendChild(bu_load.getelement());
	
	return element;
}