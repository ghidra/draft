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
	this.inputs.type=[
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
	];

	//THIS WILL NEED TO APPENDED Basically
	this.inputs_values={
		"type":"string"
	}

	//this.outputs.result={};

	///THIS NEEDS TO BE DYNAMIC THE OUTPUT IS THE BASED ON THE INPUT
	this.types={
		input:{
			"type":"select"
		},
		output:{
			"result":"string"
		}
	};
	//this.store_defaults();
}

/*draft.nodes.basic.string.prototype.render=function(){
	return this.inputs.string;
}*/

draft.nodes.core.parameter.prototype.set_values=function(values){
//THIS IS AN OVERRIDE OF THE NODE_FRAMEWORK METHOD.
//THIS IS THE NODE THIS WAS WRITTEN FOR, BECAUSE THE WAY THIS NODE...
//LOOKS IS TIED TO THE DATA ATTACHED TO IT
}