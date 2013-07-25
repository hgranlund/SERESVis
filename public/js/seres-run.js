var startSeres = function (query) {
  var json = query.execute('construct where {?a ?s ?b}', 'http://localhost:3030/ds/query?');
  $(document).ready(function () {
    var elGraph = document.getElementById('graph-container');
    var elTree = document.getElementById('indented_tree');
    var graph = new Graph(elGraph, json);
    var tree = new Tree(elTree, json);
    window.seres.eventController = new EventController(tree, graph, window.seres.sidebar);
  });
}(window.seres.query);
