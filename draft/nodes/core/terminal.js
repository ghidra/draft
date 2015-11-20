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
	this.types={
		input:{
			"element":"string",
			"passthrough":'none'
		}
	};
}

//this is the render function
//being as it is the terminal node, the output of this will be the final output
draft.nodes.core.terminal.prototype.render=function(){
	var output="none";
	return output;
}