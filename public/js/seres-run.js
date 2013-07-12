var startSeres = function(query) {
	var json = query.execute('construct where {?a ?s ?b}');
	$(document).ready(function() {
		var elGraph = document.getElementById("graph-container");
		var elTree = document.getElementById("indented_tree");
		var graph = new Graph(elGraph, json);
		var tree = new Tree(elTree, json);
		window.seres.eventController = new EventController(tree, graph);
	});
}(window.seres.query);



		// var ex = []
		// for (f in json ){
		// 	ex.push(f);
		// }
		// self.formatter = jsonFormatter(json);
		// var data = self.formatter.toGraphObject(ex);
  //           options = {
  //             width: screen.width,
  //             height: screen.height,
  //             defaultColors: { "7": "blue" }
  //           };

  //       graph = new Insights(el, data.nodes, data.links, options).render();