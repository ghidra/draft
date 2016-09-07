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
	}
	
	return node.render();

}