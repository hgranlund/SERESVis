var startSeres = function(query, visualTree, visualGraph) {
    var json = query.execute('construct where {?a ?s ?b}');
    var treeObject = visualTree.toTreeObject(json)[0];
    var graphObject = visualGraph.toGraphObject(json);
    $(document).ready(function() {
        visualTree.startTree(treeObject);
        var el = document.getElementById("graph-container"),
            options = {
              defaultColors: { "7": "blue"  }
            };
        if (el !== null && graphObject.links !== null && graphObject.nodes !== null) {
            var graph = new Insights(el, graphObject.nodes, graphObject.links, options).render();
        }
    });
}(window.seres.query, window.seres.visualTree, window.seres.visualGraph);