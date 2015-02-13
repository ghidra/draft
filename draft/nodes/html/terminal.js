draft.nodes.html.terminal=function(){
	this.init();
	return this;
};

draft.nodes.html.terminal.prototype=new draft.node_framework();
draft.nodes.html.terminal.prototype.constructor=draft.node_framework;

draft.nodes.html.terminal.prototype.init=function(){
	this.label="terminal";
	this.inputs.passthrough=1;
}