draft.node_framework=function(){
	return this.init();
}
draft.node_framework.prototype.init=function(){
	//draft.node_framework.prototype.init.call();

	this.label="null";

	this.inputs={};
	this.inputs.passthrough=0;//the waiting ports that can multiply
	this.inputs_values={};//to hold the set values
	this.inputs_values_defaults={};//to hold default values

	//DO NOT NAME INPUTS WITH '_' IT WILL BREAK THE PARAMETERS PASSING

	this.outputs={};

	//ports expect a type, as well as output, so that I can make sure only things that want to plug in can.

	this.types={
		input:{},
		output:{}
	};

	//extending calsses must call store_defaults
}
draft.node_framework.prototype.store_defaults=function(){
	this.inputs_values_defaults=rad.objclonefast(this.inputs_values);
}

draft.node_framework.prototype.render=function(){
	//here we evaluate the nodes data, and whomever is plugged in
}