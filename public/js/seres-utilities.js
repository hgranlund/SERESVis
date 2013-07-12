window.seres.utilities = function(d3) {

	var rectElements = [];
    var color = [d3.rgb("#1f77b4"), d3.rgb("#aec7e8"), d3.rgb("#ff7f0e"), d3.rgb("#ffbb78"), d3.rgb("#2ca02c"), d3.rgb("#98df8a"), d3.rgb("#d62728"), d3.rgb("#ff9896"), d3.rgb("#9467bd"), d3.rgb("#c5b0d5"), d3.rgb("#8c564b"), d3.rgb("#c49c94"), d3.rgb("#e377c2"), d3.rgb("#f7b6d2"), d3.rgb("#7f7f7f"), d3.rgb("#c7c7c7"), d3.rgb("#bcbd22"), d3.rgb("#dbdb8d"), d3.rgb("#17becf"), d3.rgb("#9edae5")];

debugger;
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

	var getColor = function(d){
		var color_num = d.name.split('').length + d.children.length;
        color_num = color_num*123;
        color_num = color_num%21;

        return color[color_num];
	}

	return {
		'highlight': highlight,
		'downlight': downlight,
		 'getColor' : getColor
	};

}(window.d3);