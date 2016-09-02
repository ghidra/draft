draft.renderer=function(){
	return this;
}

///so how does this path work
//Here is what we are doing so far... 
//getting all the downstream nodes of the input node....
//then starting from the furthest away, render each node, and cache it if its not already cached

draft.renderer.prototype.render=function(node,scriptid,mode){
	mode = mode || 0;//mode allows is to render different types eg html can return dom objects or text
	
	var downstream_nodes =  node.downstream();
	//now start from the back and render each node to cache
	var len = downstream_nodes.length;
	for( var i=0; i<len; i++){
		var id = len-1-i;
		downstream_nodes[id].render(mode);
		//console.log( downstream_nodes[id].get_cache() );
	}
	//console.log(node.get_cache());

	return this.render_loop(node,scriptid,mode);
	//return node.render();
	//return node.get_cache();
}

//this is the recursive function
draft.renderer.prototype.render_loop=function(node,scriptid,mode){

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
				var foundvalue = this.render_loop(draft.scripts[scriptid].nodes[line.fnode],scriptid,mode);
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
	return node.render(mode);
}