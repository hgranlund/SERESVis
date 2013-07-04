var startSeres = function(query, visualTree, visualGraph) {
    var json = query.execute('construct where {?a ?s ?b}');
    var treeObject = visualTree.toTreeObject(json)[0];
    // var individuals = visualGraph.filterSparqlJson(json, 'xmi.uuid');
    var graph;
    // var graphObject = visualGraph.toGraphObject(json);
    // var el = document.getElementById("graph-container");
    // if (el !== null && graphObject.links !== null && graphObject.nodes !== null) {
    //     graph = new Insights(el, graphObject.nodes, graphObject.links)
    //                   .filter({ size: [3] , text: ['Seres']})
    //                   .zoom(1.5)
    //                   .render();


    // }
    $(document).ready(function() {
        visualTree.startTree(treeObject);

        // visualTree.startTree(treeObject);
        visualGraph.startGraph(json, treeObject);

    });
}(window.seres.query, window.seres.visualTree, window.seres.visualGraph);



//     var json1 = query.execute('\
//         prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
// prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
// construct\
// where{?e rdfs:subClassOf ?r. ?i rdf:type ?t}'
//         );