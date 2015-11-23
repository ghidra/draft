draft.renderer=function(){
	//node sent in is likey the terminal node
	return this;
}

draft.renderer.prototype.render=function(node,scriptid){
	return this.render_loop(node,scriptid);
	//return node.render();
}

//this is the recursive function
draft.renderer.prototype.render_loop=function(node,scriptid){
	for(var input in node.p_i){//loop the inputs of the node
		if(node.p_i.hasOwnProperty(input)){//only use the unique properties
			var line = draft.scripts[scriptid].lines[node.p_i[input].line];//the id of the line// need to seek out the line to get the data from it
			//console.log(line);
			if(line!=undefined){
				//trace backwards to get the value
				//recurse back
				console.log(line.fnode+":"+line.fport);
				//get the node to send back through
				var foundvalue = this.render_loop(draft.scripts[scriptid].nodes[line.fnode],scriptid);
				if(foundvalue != null){
					return foundvalue;
				}

			}else{
				//we can use the value from the node itself
				var portlabel = node.p_i[input].label;
				var portvalue = node.class.inputs_values[portlabel];
				//console.log(portvalue);
				return portvalue;
			}
		}
	}
}