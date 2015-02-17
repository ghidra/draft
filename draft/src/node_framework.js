draft.node_framework=function(){
	return this.init();
}
draft.node_framework.prototype.init=function(){
	this.label="null";

	this.inputs={};
	this.inputs.passthrough=0;//the waiting ports that can multiply
	this.inputs_values={};//to hold the set values

	//DO NOT NAME INPUTS WITH '_' IT WILL BREAK THE PARAMETERS PASSING

	this.outputs={};
}