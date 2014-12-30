draft.line=function(from_node,from_port,to_node,to_port,c){
        return this.init(from_node,from_port,to_node,to_port,c);
}
draft.line.prototype.init=function(from_node,from_port,to_node,to_port,c){
        this.fnode = from_node||-1;
	this.fport = from_port||-1
	this.tnode = to_node||-1;
	this.tport = to_port||-1;
        this.c = c||"#FF0000";
      	return this;
}
