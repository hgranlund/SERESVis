window.seres.utilities = function(d3){

	var highlight = function() {
		var rect = d3.select(this);
		rect.style("fill", "red");
	}

	var downlight = function() {
		var rect = d3.select(this);
		rect.style("fill", function(d){
			return d.color;
		});
	}

	return {'highlight' : highlight,
			'downlight' : downlight};

}(window.d3);