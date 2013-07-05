var startSeres = function(query, visualTree, visualGraph) {
    var json = query.execute('construct where {?a ?s ?b}');
    $(document).ready(function() {
        visualTree.startTree(json);
        visualGraph.startGraph(json);
    });
}(window.seres.query, window.seres.visualTree, window.seres.visualGraph);



//     var json1 = query.execute('\
//         prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
// prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
// construct\
// where{?e rdfs:subClassOf ?r. ?i rdf:type ?t}'
//         );