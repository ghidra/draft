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

	this.cache="";//the cached value
	this.cached=false;//set when rendered, unset when changes are made downstream

	//DO NOT NAME INPUTS WITH '_' IT WILL BREAK THE PARAMETERS PASSING

	this.outputs={};
	this.outputs.result="";//the result

	//ports expect a type, as well as output, so that I can make sure only things that want to plug in can.

	this.types={
		input:{},
		output:{"result":"none"}
	};

	//extending calsses must call store_defaults
}
draft.node_framework.prototype.store_defaults=function(){
	this.inputs_values_defaults=rad.objclonefast(this.inputs_values);
}

draft.node_framework.prototype.clear_cache=function(){
	this.cached=false;
}

draft.node_framework.prototype.render=function(mode,ports,sid){
	//console.log("--framework");
	var output="";
	this.loop_inputs(mode,ports,sid,
		function(key,value){
			output+=value;
		}
	);

	this.cache = output;
	this.cached = true;

	return output;
}

///----utility function to loop inputs
draft.node_framework.prototype.loop_inputs=function(mode,ports,sid,func){
	/*for(p in this.inputs_values){
		if(this.inputs_values.hasOwnProperty(p)){//only use the unique properties
			if (typeof func === "function"){
				if(this.inputs_values[p]!=undefined){
					func(p,this.inputs_values[p]);
				}
			}
		}
	}*/
	for(p in ports){
		var port = ports[p];
		var connected = port.used;
		var label = port.label;
		var value = this.inputs_values[label];
		 
		//console.log(draft.scripts[sid].lines[port.line].fnode)
		if (typeof func === "function"){
			if(connected){
				//we need to grab the value from what we are plugged into
				var node_id = draft.scripts[sid].lines[port.line].fnode; 
				var connected_node = draft.scripts[sid].nodes[node_id];
				var v = (connected_node.class.cached)?connected_node.class.cache:"ERROR";
				//console.log("connected:"+label+":"+v);
				func(label,v);
			}else{
				//console.log("not connected:"+label+":"+value);
				func(label,value);
			}
		}
	}
}