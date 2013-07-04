window.seres.utilities = function(d3, visualtree){

	var highlight = function(d) {
		var rect = d3.select(this);
		rect.style("stroke-width", 3);
		rect.style("stroke", "black");
		rect.select("text").style("font", "32px comic sans");
		//console.log(d.name);
	}

	var downlight = function() {
		var rect = d3.select(this);
		rect.style("stroke-width", 1);
		rect.style("stroke", "black");
		rect.select("text").style("font", "12px sans-serif");
	}

	return {'highlight' : highlight,
			'downlight' : downlight};

}(window.d3, window.seres.visualtree);