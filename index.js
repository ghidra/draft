function init(){
	draft.init();
	draft.set_canvas("c");
	draft.set_console("p");
	draft.set_script();//set a black script

	draft.add_node("node1");
	draft.add_node("node2",100,100);
}

window.onload=function(){
    init();    
}
