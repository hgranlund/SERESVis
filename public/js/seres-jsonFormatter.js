function jsonFormatter(jsonArg) {
    var json = jsonArg,
        parentToChildMap,
        autoId = 0;



    var filterSparqlJson = function(dataPropertyToFilter) {
        var filtered = {};
        for (var element in json) {
            if (json[element].data[dataPropertyToFilter]) {
                filtered[element] = json[element];
            }
        }
        return filtered;
    };

    var getParentToChildMap = function() {
        parentToChildMap = {};
        var parent;
        for (var child in json) {
            parentToChildMap[child] = [];
        }
        for (child in json) {
            if (json[child].object.subClassOf) {
                parent = json[child].object.subClassOf;
                if (!(parent in parentToChildMap)) parentToChildMap[parent] = [];
                parentToChildMap[parent].push(child);
            }
            if (json[child].object.type) {
                parentToInduvidual = json[child].object.type;
                if (!(parentToInduvidual in parentToChildMap)) parentToChildMap[parentToInduvidual] = [];
                parentToChildMap[parentToInduvidual].push(child);
            }
        }
        return parentToChildMap;
    };

    var toGraphObject = function(expandNodes) {
        var links = [];
        var nodes = [];
        var node;
        expandNodes.map(function(subject) {
            nodes.push(createNode(subject, nodes.length));
        });
        for (var i = 0; i < nodes.length; i++) {
            links = links.concat(createLink(i, nodes));
        }
        return {
            'links': links,
            'nodes': nodes
        };
    };


    var populateElement = function(parent, parentsToChildMap, parentToInduvidualsMap) {
        var elm = createNode(parent, 0);
        elm.name = parent;
        if (parent in parentToInduvidualsMap) {
            elm.individuals = parentToInduvidualsMap[parent].map(function(individual) {
                return createNode(individual);
            });
        }
        if (parent in parentsToChildMap) {
            elm.children = [];
            parentsToChildMap[parent].map(function(child) {
                elm.children.push(populateElement(child, parentsToChildMap, parentToInduvidualsMap));
            });
        }
        return elm;
    };

    var toTreeObject = function() {
        parentsToChildMap = {};
        childs = {};
        parentToInduvidualsMap = {};
        treeJson = [];
        var parent;
        for (var child in json) {
            if (json[child].object.subClassOf) {
                parent = json[child].object.subClassOf;
                if (!(parent in parentsToChildMap)) parentsToChildMap[parent] = [];
                parentsToChildMap[parent].push(child);
                childs[child] = parent;
            }
            if (json[child].object.type !== "Class") {
                parentToInduvidual = json[child].object.type;
                if (!(parentToInduvidual in parentToInduvidualsMap)) {
                    parentToInduvidualsMap[parentToInduvidual] = [];
                }
                parentToInduvidualsMap[parentToInduvidual].push(child);
            }
        }
        for (var root in parentsToChildMap) {
            if (!(root in childs)) {
                treeJson.push(populateElement(root, parentsToChildMap, parentToInduvidualsMap));
            }
        }
        return treeJson;
    };



    var createNode = function(subject, index) {
        var subjectObj = (json.hasOwnProperty(subject) ? json[subject] : {
            'data': {},
            'object': {}
        });
        if (json.hasOwnProperty(subject)) {
            json[subject].id = index;
        }
        var node = $.extend({}, subjectObj);
        subject = subject || node.data.type || node.data['xmi.lapel'] || '';
        node.size = 10;
        node.name = subject;
        node.id = subject || autoId++;
        node.index = index;
        node.isInduvidual = false;
        node.isExpanded = false;
        node.children = this.parentToChildMap[subject] || [];
        if (node.object.type) {
            if (node.object.type !== "Class") {
                if (node.object.type in parentToChildMap) {
                    node.isInduvidual = true;
                    node.size = 5;
                    node.name = "";
                }
            }
        }
        if (node.object.type === "Class") {
            node.size = 30;
        }
        node.x = 500;
        node.y = 500;
        return node;
    };

    var createLink = function(index, nodes) {
        var object,
            subjectId = index,
            links = [];
        var objectName = nodes[subjectId].object.subClassOf || nodes[subjectId].object.type || false;
        if (objectName && objectName !== "Class") {
            nodes.map(function(object) {
                if (object.name === objectName) {
                    links.push({
                        'source': nodes[subjectId].index,
                        'target': object.index
                    });
                    // links.push([nodes[subjectId].id, object.id]);
                }
            });
        }
        return links;
    };

    this.parentToChildMap = getParentToChildMap();

    return {
        'filterSparqlJson': filterSparqlJson,
        'toGraphObject': toGraphObject,
        'parentToChildMap': this.parentToChildMap,
        'toTreeObject': toTreeObject,
        'createNode': createNode,
        'createLink': createLink
    };
}
