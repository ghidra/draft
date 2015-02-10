draft.node_browser=function(layer){
	return this.init(layer);
}

draft.node_browser.prototype.init=function(layer){
	this.menu = {};//these will be used for searching
	this.menu_categories = {};//these are the sub menus
	this.visible=false;
	this.visible_sub="";
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
			
			menu_item.onmouseover=function(e){_this.show_sub_menu(e,this.id);};
			menu_item.innerHTML=category;
			menu_container.appendChild(menu_item);

			//make a category container element
			var sub_menu_container = document.createElement("DIV");
			sub_menu_container.id = "node_sub_menu_"+category;
			sub_menu_container.className = "node_menu_list";
			sub_menu_container.style.position = "absolute";
			sub_menu_container.style.visibility = "hidden";

			//now add to the sub container
			for (var n in draft.nodes[category]){
				if(draft.nodes[category].hasOwnProperty(n)){
					this.menu[category][n] = n;
					//set the secondary html parts
					var sub_menu_item = document.createElement("A");
					sub_menu_item.id = "node_sub_menu_"+category+"_"+n;
					sub_menu_item.className = "node_menu_label";
					sub_menu_item.onmousedown=function(e){_this.create_node(e,this.id)};
					sub_menu_item.innerHTML=n;

					sub_menu_container.appendChild(sub_menu_item);
				}
			}
			//
			this.menu_categories[category]=sub_menu_container;
			this.canvas.appendChild(sub_menu_container);
		}
	}

	this.canvas.appendChild(menu_container);

	return this;
}

draft.node_browser.prototype.toggle=function(p){
	if(this.visible){
		this.canvas.style.visibility="hidden";
		this.visible=false;
		if(this.visible_sub!=""){
			var open_sub = document.getElementById("node_sub_menu_"+this.visible_sub);
			open_sub.style.visibility="hidden";
		}
	}else{
		this.canvas.style.visibility="";
		this.canvas.style.left = p.x;
		this.canvas.style.top = p.y;
		this.visible=true;
	}
}
draft.node_browser.prototype.show_sub_menu=function(e,id){
	//i am sending in the id of the element rolled over, so I can use that to get the submenu to show, after parsing it
	var sp = id.split("_");
	var sub = sp[sp.length-1];
	//first hide any sub menu that has been turned on
	if(this.visible_sub!=""){
		var open_sub = document.getElementById("node_sub_menu_"+this.visible_sub);
		open_sub.style.visibility="hidden";
	}
	this.visible_sub=sub;
	//now I can show the menu
	//place the box
	//get the width of the main menu
	var main_menu = document.getElementById("node_menu_list");
	var menu_item = document.getElementById("node_main_menu_"+sub);
	var left = main_menu.offsetWidth;
	var top = menu_item.offsetTop;

	sub_menu = this.menu_categories[sub]
	sub_menu.style.left = left+2;
	sub_menu.style.top = top;
	sub_menu.style.visibility = "";

	
	//this.canvas.appendChild(sub_menu);
}
draft.node_browser.prototype.create_node=function(e,id){
	alert(id);
}
draft.node_browser.prototype.test=function(){
	alert("something");
}
