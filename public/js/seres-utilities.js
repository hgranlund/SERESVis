window.seres.utilities = function(d3, visualtree, visualgraph) {

	var rectElements = [];

	var highlight = function(d) {
		if (d.isInduvidual) {return};
		d3.selectAll('#' + d.name)
				.style("stroke-width", 10)
				.style("stroke", "red");
	};

	var downlight = function(d) {
		if (d.isInduvidual) {return};
		d3.selectAll('#' + d.name)
		.style("stroke-width", 10)
		.style("stroke", function(d){
			return d.stroke;
		});
	};

	// var getColor = function(d){
	// 	var color_num = d.name.split('').length + d.children.length;
 //        color_num = color_num*123;
 //        color_num = color_num%21;

 //        return this.color[color_num];
	// }

	return {
		'highlight': highlight,
		'downlight': downlight
		// 'getColor' : getColor
	};

}(window.d3, window.seres.visualtree, window.seres.visualgraph);