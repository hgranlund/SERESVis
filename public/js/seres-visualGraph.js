window.seres.visualGraph = function(query, d3) {

    var toGraphObject = function(json) {
        var links = [];
        var nodes = [];

        for (var subject in json) {
            var node={};
            node.id = subject;
            node.text = subject;
            for(var dataProperty in json[subject].data) {
                node.property = json[subject].data[property];
            }
            for(var objectProperty in json[subject].object) {
                node.objectProperty = json[subject].object[objectProperty];
                links.push([subject, node.objectProperty, objectProperty]);
            }
            node.size = 5;
            node.cluster = 5;
            nodes.push(node);

    }

    return {
        'links': links,
        'nodes': nodes
    };
};
// var el = document.getElementById("graph-container");
// if (el !== null && links !== null && nodes !== null) {
//     var graph = new Insights(el, nodes, links).render();
// }


return {
    'toGraphObject': toGraphObject
};
}(window.seres.query, window.d3);


//example data
// var nodes = [{
//         id: '1',
//         text: "apple",
//         size: 9,
//         cluster: 5
//     }, {
//         id: '2',
//         text: "google",
//         size: 7,
//         cluster: 2
//     }, {
//         id: '3',
//         text: "microsoft",
//         size: 5,
//         cluster: 1
//     }
// ];

// var links = [
//     ['1', '2', 'ser'], // [ source.id, target.id , name of connection]
//     ['2', '3', 'see'],
//     ['1', '3', 'ser']
// ];