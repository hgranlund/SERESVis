var r= function(query, visual) {
    json = query.execute('construct where {?a ?s ?b}');
	json = visual.toJsonTree(json)[0];
	$(document).ready(function() {
		visual.startTree(json);
	});
}(window.seres.query, window.seres.visual);