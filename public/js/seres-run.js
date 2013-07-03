var startSeres = function(query, visualTree, visualGraph) {
    var json = query.execute('construct where {?a ?s ?b}');
    var treeObject = visualTree.toTreeObject(json)[0];
    // var individuals = visualGraph.filterSparqlJson(json, 'xmi.uuid');
    // var graphObject = visualGraph.toGraphObject(json);
    $(document).ready(function() {
        visualTree.startTree(treeObject);
        visualGraph.startGraph(json, treeObject);
    });
}(window.seres.query, window.seres.visualTree, window.seres.visualGraph);



//     var json1 = query.execute('\
//         prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
// prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
// construct\
// where{?e rdfs:subClassOf ?r. ?i rdf:type ?t}'
//         );