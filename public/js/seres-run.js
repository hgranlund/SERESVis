var startSeres = function(query, visualTree) {
	var json = query.execute('construct where {?a ?s ?b}');
	$(document).ready(function() {
		var el = document.getElementById("graph-container");
		var expand_node = ['Seres', 'Dokumentasjon' , 'SERESelement', 'Forvaltingselement'];
		var graph = new Graph(el, json, expand_node);
		visualTree.startTree(json)
	});
}(window.seres.query, window.seres.visualTree);
