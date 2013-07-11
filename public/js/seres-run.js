var startSeres = function(query, tree) {
	var json = query.execute('construct where {?a ?s ?b}');
	$(document).ready(function() {
		var el = document.getElementById("graph-container");
		var expand_node = ['Seres', 'Dokumentasjon' , 'SERESelement', 'Forvaltingselement'];
		var graph = new Graph(el, json);
		tree.startTree(json)
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

	});
}(window.seres.query, window.seres.tree);