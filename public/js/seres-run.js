var r= function(query, visualTree) {
    json = query.execute('construct where {?a ?s ?b}');
	json = visualTree.toJsonTree(json)[0];
	$(document).ready(function() {
		visualTree.startTree(json);
	});
}(window.seres.query, window.seres.visualTree);