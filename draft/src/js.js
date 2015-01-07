js={}
js.flusharray=function(a){
	while(a.length>0){
                a.pop();
        }
}
js.objhasprop=function(o){
	for(var prop in o) {
    		if (Object.prototype.hasOwnProperty.call(o, prop)) {
      			return true;
    		}
  	}
  	return false;
}
