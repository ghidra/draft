draft.node_browser=function(layer){
	return this.init(layer);
}

draft.node_browser.prototype.init=function(layer){
	this.menu = {};//these will be used for searching
	this.menu_categories = {};
	this.visible=false;
	var _this = this;

	//set the passed in layer to hang this all on
	this.canvas = document.getElementById(layer);
	this.canvas.style.visibility="hidden";
	this.canvas.style.position = "absolute";
	this.canvas.style.color = 0x0;

	//the main container
	var menu_container = document.createElement("DIV");
	menu_container.id = "node_menu_list";

	//the label
	var menu_label = document.createElement("DIV");
	menu_label.innerHTML = "TAB Menu";
	menu_label.className="node_main_menu_label";

	menu_container.appendChild(menu_label);

	for (var category in draft.nodes){
		if(draft.nodes.hasOwnProperty(category)){

			this.menu[category]={};//set the category

			//set the main menu parts
			var menu_item = document.createElement("A");
			menu_item.id = "node_main_menu_"+category;
			menu_item.className="node_menu_label";
			//i need to create a closure here, because the varialbe is wrong
			menu_item.onmouseover=function(){_this.show_sub_menu(category)};
			menu_item.innerHTML=category;
			menu_container.appendChild(menu_item);

			//make a category container element
			var sub_menu_container = document.createElement("DIV");
			sub_menu_container.id = "node_sub_menu_"+category;
			sub_menu_container.className = "node_menu_list";

			//now add to the sub container
			for (var n in draft.nodes[category]){
				if(draft.nodes[category].hasOwnProperty(n)){
					this.menu[category][n] = n;
					//set the secondary html parts
					var sub_menu_item = document.createElement("A");
					sub_menu_item.id = "node_sub_menu_"+category+"_"+n;
					sub_menu_item.className = "node_menu_label";
					sub_menu_item.onmousedown=function(){_this.create_node(category,n)};
					sub_menu_item.innerHTML=n;

					sub_menu_container.appendChild(sub_menu_item);
				}
			}
			//
			this.menu_categories[category]=sub_menu_container;
		}
	}

	this.canvas.appendChild(menu_container);

	return this;
}

draft.node_browser.prototype.toggle=function(p){
	if(this.visible){
		this.canvas.style.visibility="hidden";
		this.visible=false;
	}else{
		this.canvas.style.visibility="";
		this.canvas.style.left = p.x;
		this.canvas.style.top = p.y;
		this.visible=true;
	}
}
draft.node_browser.prototype.show_sub_menu=function(sub){
	alert(sub);
}
draft.node_browser.prototype.create_node=function(sub,node){
	alert(sub+":"+node);
}
draft.node_browser.prototype.test=function(){
	alert("something");
}
