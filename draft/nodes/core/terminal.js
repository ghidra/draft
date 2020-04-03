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
		"element":eid,
		"passthrough":undefined
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
draft.nodes.core.terminal.prototype.render=function(mode,ports,sid){
	//loop the inputs
	//get what is connected, and start to loop those
	
	/*for(p in this.inputs_values){
		if(this.inputs_values.hasOwnProperty(p)){//only use the unique properties
			if(p!='element'){//ignore elements
				output+=this.inputs_values[p];
			}
		}
	}*/
	//console.log("--terminal");
	var output="";
	var dom = new rad.element("DIV");
	var dom2 = new rad.element("DIV");
	var usedom = false;

	this.loop_inputs(mode,ports,sid,
		function(key,value){
			if(key!="element"){
				if(value != undefined)//ignore undefined
				{
					if(rad.isdomelement(value)){
						//console.log(value)
						var el = value.cloneNode(true);//has to be cloned so incase its used multiple times
						dom.element.appendChild(el);
						usedom=true;
					}else{
						output+=value;
					}
				}
			}
		}
	);
	if(usedom && output!=""){
		dom2.element.innerHTML=output;
		dom.element.appendChild(dom2.element);
	}

	//console.log(output);

	this.cache=(usedom)?dom.element:output;
	this.cached=true;

	//console.log("render:"+output);
	return this.cache;
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
	//label.style.height=(height-(margin*2))+"px";
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

	///LETS GET CATEGORIES FROM DATABASE
	var category_list = draft.database_query.get_categories( );///that is a callback function
	var new_category_list=[];
	var NO_CATEGORIES=true;
	if(!category_list){//no files found,make the arrays we need
		new_category_list = ["new category"];
	}else{
		NO_CATEGORIES=false;
		new_category_list=category_list.slice();
		new_category_list.push("new category");
	}
	console.log("------");
	//console.log(new_category_list[0]);
	
	var dd_categories = new rad.dropdown({
		"id":id,
		"label":"categories",
		"options":new_category_list,
		"value":0,
		"style":{
			"width":width,
			"margin":margin,
			"fontSize":draft.font.size
		},
		"style_dropdown":{
			"width":width_input
		},
		"callback":function(t){
			var ctb = document.getElementById(id+"_dd_categories");
			//console.log("------");
			//console.log(t.value);
			//console.log(ctb.style.visibility);
			//console.log("------");
			ctb.style.display=(t.value=="new category")?'block':'none';
		}
	});

	element.appendChild(dd_categories.getelement());
	///MAKE A FIELD FOR NEW CATEGORIES
	var tb_newcategory = new rad.textbox({
		"id":id+"_dd_categories",//this is so i name the whole group
		"label":"new category",
		"value":"",
		"style":{
			//"width":width_input,
			"width":width,
			"margin":margin,
			"fontSize":draft.font.size,
			"display":(NO_CATEGORIES)?"block":"none"
		},
		"style_textbox":{
			"width":width_input
		}
	});
	//document.getElementById(id+"_dd_categories").style.display="none"
	element.appendChild(tb_newcategory.getelement());
	//THE SAVE BUTTON
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

			//get the category
			var category = ( document.getElementById("dd_"+id+"_categories").value === "new category" )?document.getElementById( "tb_"+id+"_dd_categories_new category").value:document.getElementById("dd_"+id+"_categories").value;
			//alert( category );
			//console.log(filename);
			//send that to the save function
			draft.file.save(filename,draft.scripts[0],category);
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

	///---------
	/////////////
	// DO THE LOG IN PORTION
	/////

	var labellogin = document.createElement("DIV");
	labellogin.innerHTML="&nbsp;"+"Connect to Database";
	labellogin.className="parameter_label";
	labellogin.style.width=(width-(margin*2))+"px";
	labellogin.style.display="inline-block";

	element.appendChild(labellogin);

	

	////////////////////////////////////////
	////////////////////////////////////////
	///this logs me in, and out.... 
	////////////////////////////////////////
	////////////////////////////////////////
	//if(!draft.logged_in){//not logged in, make the login page
	//var logincontainer = document.createElement("DIV");
	//logincontainer.id = draft.logincontainer_id;
		

		////////////////////////////////////////
		////////////////////////////////////////
	//}else{
		///get the log out button
	//	logincontainer.innerHTML="&nbsp;"+"CONNECTED";
	//}
	element.appendChild(draft.make_login_element());

	
	return element;
}