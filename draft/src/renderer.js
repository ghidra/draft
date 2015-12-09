draft.renderer=function(){
	return this;
}

draft.renderer.prototype.render=function(node,scriptid){
	return this.render_loop(node,scriptid);
	//return node.render();
}

//this is the recursive function
draft.renderer.prototype.render_loop=function(node,scriptid){

	//console.log("****************");
	//console.log(node.label);

	for(var input in node.p_i){//loop the inputs of the node
		if(node.p_i.hasOwnProperty(input)){//only use the unique properties
			
			//console.log("*****");
			//console.log(node.p_i[input].label);

			var line = draft.scripts[scriptid].lines[node.p_i[input].line];//the id of the line// need to seek out the line to get the data from it
			//console.log(node.p_i[input]);
			if(line!=undefined){
				//trace backwards to get the value
				//recurse back
				//console.log(line.fnode+":"+line.fport);
				//get the node to send back through
				//console.log("we are gonna loop");
				var foundvalue = this.render_loop(draft.scripts[scriptid].nodes[line.fnode],scriptid);
				//if(foundvalue != null){
				node.class.inputs_values[node.p_i[input].label]=foundvalue;
				//lamda+=foundvalue;
					//return foundvalue;
				//}

			}else{
				//do nothing basically for the port
				//we can use the value from the node itself
				var portvalue = node.class.inputs_values[node.p_i[input].label];
				//console.log(portvalue);
				//lamda+=portvalue;
				//return portvalue;
			}
		}
	}
	return node.render();
}