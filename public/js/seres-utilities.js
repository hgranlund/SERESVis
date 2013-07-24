window.seres.utilities = function (d3) {

    var color = d3.scale.category20();

    var _color = function (number) {
        return d3.rgb(color(number));
    };

    var getColor = function (d, nodes) {
        if (d.isIndividual) {
            d = getParentFromNodes(d, nodes) || d;
        };
        return _color(d.colorDepth);

    };

    var getStroke = function (d, nodes) {
        var parent = getParentFromNodes(d, nodes) || d;
        return getColor(parent, nodes);
    };


    var getParent = function (d, formatter) {
        var parentId = getPropertyValue('subClassOf', d.object) || getPropertyValue('type', d.object);
        if (parentId && !d.isClass) {
            return formatter.createNode(parentId, 0);
        } else {
            return null;
        }
    };

    var getParentFromNodes = function (d, nodes) {
        var parentId = getPropertyValue('subClassOf', d.object) || getPropertyValue('type', d.object);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === parentId) {
                return nodes[i];
            }
        };
    };

    var toLegalHtmlName = function (className) {
        className = className || '';
        className = className.toString().replace(/[!\'#$%&_'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '-');
        return className;
    };

    var getPropertyValue = function (name, object) {
        if (typeof (object) === 'undefined') {
            return null;
        } else if (object.hasOwnProperty(name)) {
            return object[name];
        } else {
            return null;
        }
    };

    var addNodeToNodes = function (node, nodes) {
        var equalNode = getNode(node.id, nodes);
        if (!equalNode) {
            nodes.push(node);
            return true;
        }
        return false;
    };

    var getNode = function (id, nodes) {
        if (!id) {
            return;
        }
        var equalNodes = nodes.filter(function (d) {
            return d.id === id;
        });
        return equalNodes[0] || false;
    };

    var getLinkWithNodeId = function (id, relList) {
        for (var i = 0; i < relList.length; i++) {
            if (relList[i].nodeId === id) {
                return relList[i];
            }
        }
        return false;
    };

    var getLinkWithName = function (name, relList) {
        for (var i = 0; i < relList.length; i++) {
            if (relList[i].link === name) {
                return relList[i];
            }
        }
        return false;
    };


    var isEmpty = function (obj) {

        if (obj == null) {
            return true;
        }
        if (obj.length && obj.length > 0) {
            return false;
        }
        if (obj.length === 0) {
            return true;
        }
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    };

    var pathFromRoot = function (node, nodes) {
        var path = [node],
            parentId = getPropertyValue('subClassOf', node.object);

        while (parentId) {
            node = getNode(parentId, nodes);
            path.push(node);
            parentId = getPropertyValue('subClassOf', node.object);
        }
        return path.reverse();
    };


    return {
        getColor: getColor,
        getStroke: getStroke,
        toLegalHtmlName: toLegalHtmlName,
        getPropertyValue: getPropertyValue,
        addNodeToNodes: addNodeToNodes,
        getNode: getNode,
        getLinkWithNodeId: getLinkWithNodeId,
        isEmpty: isEmpty,
        getParent: getParent,
        pathFromRoot: pathFromRoot

    };


}(window.d3);
