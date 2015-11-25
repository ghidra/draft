draft.nodes.basic.string=function(){
	this.init();
	return this;
};

draft.nodes.basic.string.prototype=new draft.node_framework();
draft.nodes.basic.string.prototype.constructor=draft.node_framework;

draft.nodes.basic.string.prototype.init=function(){
	draft.node_framework.prototype.init.call();

	this.label="string";

	this.inputs.string="";

	this.inputs_values={
		"string":""
	}

	this.outputs.result={};

	this.types={
		input:{
			"string":"string"
		},
		output:{
			"result":"string"
		}
	};
	//this.store_defaults();
}

draft.nodes.basic.string.prototype.render=function(){
	return this.inputs.string;
}