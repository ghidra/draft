draft.node_framework=function(){
	return this.init();
}
draft.node_framework.prototype.init=function(){
	this.label="null";

	this.inputs={};
	this.inputs.passthrough=0;//the waiting ports that can multiply

	this.values={};//to hold the set values

	this.outputs={};
}