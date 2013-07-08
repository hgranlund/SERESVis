window.seres.utilities = function(d3, visualtree, visualgraph) {

	var rectElements = [];

	var highlight = function(d) {
		d3.selectAll('#' + d.name)
				.style("stroke-width", 3)
				.style("stroke", "red");
	};

	var downlight = function(d) {
		d3.selectAll('#' + d.name)
		.style("stroke-width", 1)
		.style("stroke", "black");
	};

	return {
		'highlight': highlight,
		'downlight': downlight
	};

}(window.d3, window.seres.visualtree, window.seres.visualgraph);