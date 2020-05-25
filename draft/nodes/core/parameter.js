draft.nodes.core.parameter=function(){
	this.init();
	return this;
};

draft.nodes.core.parameter.prototype=new draft.node_framework();
draft.nodes.core.parameter.prototype.constructor=draft.node_framework;

draft.nodes.core.parameter.prototype.init=function(){
	draft.node_framework.prototype.init.call();

	this.label="parameter";
	//This is a fully dynamic node
	//i need to know what type of data you want to represent
	/*this.inputs.type=[
		"boolean",
		"scalar",
		"integer",
		"string",
		"long string",
		"array",
		"link",
		"path",
		"vector 2",
		"vector 3",
		"vector 4",
		"matrix 2",
		"matrix 3",
		"matrix 4"
	];*/

	//THIS WILL NEED TO APPENDED Basically
	/*this.inputs_values={
		"type":"string"
	}*/

	//this.outputs.result={};

	///THIS NEEDS TO BE DYNAMIC THE OUTPUT IS THE BASED ON THE INPUT
	///RIGHT NOW, JUST LEAVING IT AS A STRING
	/*this.types={
		input:{
			"type":"select"
		},
		output:{
			"result":"string"
		}
	};*/
	//this.store_defaults();
	this.build_for_type("string");
}

/*draft.nodes.basic.string.prototype.render=function(){
	return this.inputs.string;
}*/

draft.nodes.core.parameter.prototype.set_values=function(values){
//THIS IS AN OVERRIDE OF THE NODE_FRAMEWORK METHOD.
//THIS IS THE NODE THIS WAS WRITTEN FOR, BECAUSE THE WAY THIS NODE...
//LOOKS IS TIED TO THE DATA ATTACHED TO IT

	//number one, lets get our main value, 
	//what type
	for(v in values){
		if(v=="type"){
			//now we know what to do with the rest
			//dont do aything with anything else yet
			this.inputs_values[v]=values[v];
			this.build_for_type(values[v]);
			this.set_dynamic_values(values);
		}		
	}

	////return 0, for no passthrough
	return 0;
}

//////////////////////////
//////////
//FULL ON CUSTOM TO THIS NODE METHODS
//////////
//////////////////////////

draft.nodes.core.parameter.prototype.build_for_type=function(type){
	/*
		"boolean",
		"scalar",
		"integer",
		"string",
		"long string"
		"array",
		"link",
		"path",
		"vector 2",
		"vector 3",
		"vector 4",
		"matrix 2",
		"matrix 3",
		"matrix 4"
	*/
	//this.init();//basically start fresh
	this.inputs={};
	this.inputs.type=[
		"boolean",
		"scalar",
		"integer",
		"string",
		"long string",
		"array",
		"link",
		"path",
		"vector 2",
		"vector 3",
		"vector 4",
		"matrix 2",
		"matrix 3",
		"matrix 4"
	];
	this.inputs_values={
		"type":type
	}

	this.outputs={};
	this.outputs.result={};
	

	//this.outputs.result={};

	///THIS NEEDS TO BE DYNAMIC THE OUTPUT IS THE BASED ON THE INPUT
	///RIGHT NOW, JUST LEAVING IT AS A STRING
	this.types={
		input:{
			"type":"select"
		},
		output:{
			"result":"null"
		}
	};

	switch(type){
		case "boolean":
			this.inputs.checkbox = true;
			this.inputs_values.checkbox=true;
			this.types.input.checkbox="boolean";
			this.types.output.result = "boolean";
			break;
		case "scalar":
			this.inputs.number = 1;
			this.inputs_values.number=1;
			this.types.input.number="number";
			this.types.output.result="number";
			break;
		case "integer":
			this.inputs.number = 1;
			this.inputs_values.number=1;
			this.types.input.number="number";
			this.types.output.result="number";
			break;
		case "string":
			this.inputs.string = "";
			this.inputs_values.string="";
			this.types.input.number="string";
			this.types.output.result="string";
			break;
		case "long string":
			this.inputs.string = "";
			this.inputs_values.string=1;
			this.types.input.number="string";
			this.types.output.result="string";
			break;
		case "array":
			this.inputs.string = "";
			this.inputs_values.string="";
			this.types.input.number="string";
			this.types.output.result="string";
			break;
		case "link":
			this.inputs.string = "";
			this.inputs_values.string="";
			this.types.input.number="string";
			this.types.output.result="string";
			break;
		case "path":
			this.inputs.string = 1;
			this.inputs_values.string=1;
			this.types.input.number="string";
			this.types.output.result="string";
			break;
		case "vector 2":
			this.inputs.x = 0;
			this.inputs.y = 1;
			this.inputs_values.x=0;
			this.inputs_values.y=1;
			this.types.input.number="vector2";
			this.types.output.result="vector2";
			break;
		case "vector 3":
			this.inputs.x = 0;
			this.inputs.y = 1;
			this.inputs.z = 0;
			this.inputs_values.x=0;
			this.inputs_values.y=1;
			this.inputs_values.z=0;
			this.types.input.number="vector3";
			this.types.output.result="vector3";
			break;
		case "vector 4":
			this.inputs.x = 0;
			this.inputs.y = 1;
			this.inputs.z = 0;
			this.inputs.w = 1;
			this.inputs_values.x=0;
			this.inputs_values.y=1;
			this.inputs_values.z=0;
			this.inputs_values.w=1;
			this.types.input.number="vector4";
			this.types.output.result="vector4";
			break;
		case "matrix 2":
			this.inputs._00 = 1;
			this.inputs._01 = 0;
			this.inputs._10 = 0;
			this.inputs._11 = 1;
			this.inputs_values._00=1;
			this.inputs_values._01=0;
			this.inputs_values._10=0;
			this.inputs_values._11=1;
			this.types.input.number="matrix2";
			this.types.output.result="matrix2";
			break;
		case "matrix 3":
			this.inputs._00 = 1;
			this.inputs._01 = 0;
			this.inputs._02 = 0;
			this.inputs._10 = 0;
			this.inputs._11 = 1;
			this.inputs._12 = 0;
			this.inputs._20 = 0;
			this.inputs._21 = 0;
			this.inputs._22 = 1;
			this.inputs_values._00=1;
			this.inputs_values._01=0;
			this.inputs_values._02=0;
			this.inputs_values._10=0;
			this.inputs_values._11=1;
			this.inputs_values._12=0;
			this.inputs_values._20=0;
			this.inputs_values._21=0;
			this.inputs_values._22=1;
			this.types.input.number="matrix3";
			this.types.output.result="matrix3";
			break;
		case "matrix 4":
			this.inputs._00 = 1;
			this.inputs._01 = 0;
			this.inputs._02 = 0;
			this.inputs._03 = 0;
			this.inputs._10 = 0;
			this.inputs._11 = 1;
			this.inputs._12 = 0;
			this.inputs._13 = 0;
			this.inputs._20 = 0;
			this.inputs._21 = 0;
			this.inputs._22 = 1;
			this.inputs._23 = 0;
			this.inputs._30 = 0;
			this.inputs._31 = 0;
			this.inputs._32 = 0;
			this.inputs._33 = 1;
			this.inputs_values._00=1;
			this.inputs_values._01=0;
			this.inputs_values._02=0;
			this.inputs_values._03=0;
			this.inputs_values._10=0;
			this.inputs_values._11=1;
			this.inputs_values._12=0;
			this.inputs_values._13=0;
			this.inputs_values._20=0;
			this.inputs_values._21=0;
			this.inputs_values._22=1;
			this.inputs_values._23=0;
			this.inputs_values._30=0;
			this.inputs_values._31=0;
			this.inputs_values._32=0;
			this.inputs_values._33=1;
			this.types.input.number="matrix4";
			this.types.output.result="matrix4";
			break;
	}
}
draft.nodes.core.parameter.prototype.set_dynamic_values=function(values){
	for(v in values){
		if (v!='label'&&v!="type"&&v!="passthrough"){//dont need to set label value, thats the actual node name
			this.inputs_values[v] = values[v];
			
		}
	}
}

////this is called from dropdown change, that allows us to rebuild this node in the editor
draft.nodes.core.parameter.prototype.callback_from_dropdown=function(nd){
	nd.reset_ports();
	this.build_for_type(this.inputs_values.type);
	nd.set_dimensions();
	nd.draw();//redraw the node
	nd.refresh_parameters();
}