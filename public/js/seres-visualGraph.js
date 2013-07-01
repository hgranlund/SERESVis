window.seres.visualGraph = function(query, d3) {

    var filterSparqlJson = function (json, dataPropertyToFilter) {
        var filtered ={}
        for (element in json){
            if (json[element].data[dataPropertyToFilter]) {
                filtered[element] = json[element];
            };
        }
        return filtered;
    }


    var toGraphObject = function(json) {
        var links = [];
        var nodes = [];

        for (var subject in json) {
            var node={};
            node.size=1;
            node.id = subject;
            node.text = subject;
            for(var dataProperty in json[subject].data) {
                node[dataProperty] = json[subject].data[dataProperty];
            }
            for(var objectProperty in json[subject].object) {
                node[objectProperty] = json[subject].object[objectProperty];
                links.push([subject, node[objectProperty], objectProperty]);
            }
            if (node.type === "Class") node.size = 3;
            node.subclassOf = Math.floor(Math.random()*4)+3;
            nodes.push(node);
    }

    return {
        'links': links,
        'nodes': nodes
    };
};

return {
    'toGraphObject': toGraphObject,
    'filterSparqlJson' : filterSparqlJson
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