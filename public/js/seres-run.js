var startSeres = function(query, visualTree) {
	var json = query.execute('construct where {?a ?s ?b}');
	$(document).ready(function() {
		// formatter = jsonFormatter(json);
		// expand = [];
		// for (var subject in json) {
		// 	expand.push(subject);
		// }
		// var d = formatter.toGraphObject(expand);
		var el = document.getElementById("graph-container");
		// 	options = {
		// 		width: screen.width,
		// 		height: screen.height,
		// 		defaultColors: {
		// 			"7": "blue"
		// 		}
		// 	};

		// graph = new Insights(el, d.nodes, d.links, options);

		// clusters = graph.getClusters();
		// graph.filter({ size: 10}).render();
		// graph.on('node:click', function(d){
		// 	console.log("LOG:",d);
		// 	graph.center();
		// })
		var graph = new Graph(el, json);
		visualTree.startTree(json)
	});
}(window.seres.query, window.seres.visualTree);



//     var json1 = query.execute('\
//         prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
// prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
// construct\
// where{?e rdfs:subClassOf ?r. ?i rdf:type ?t}'
//         );