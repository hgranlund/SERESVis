function getNode(id, nodes) {
    var n = nodes.filter(function (d) {
        return d.id === id;
    });
    return n[0] || false;
}
describe('graph', function () {
    var el,
        graph,
        indi;
    var json = {
        'Seres': {
            'data': {},
            'object': {}
        },
        'Dokumentasjon': {
            'data': {},
            'object': {
                'subClassOf': 'Seres'
            }
        },
        'Forvaltingselement': {
            'data': {},
            'object': {
                'subClassOf': 'Seres'
            }
        },
        'SERESelement': {
            'data': {},
            'object': {
                'subClassOf': 'Seres'
            }
        },
        'Nivå': {
            'data': {},
            'object': {
                'subClassOf': 'SERESelement'
            }
        },
        'test_sereselement': {
            'data': {
                'type': 'kommentar',
                'xmi.uuid': '3333VkUhCEeKYVYkXVtHdsQ',
                'språk': 'bokmål',
                'xmi.label': 'Unknown',
                'tekst': 'Allergi er definert i \'Definisjon\'-attributtet',
                'xmi.id': 'a14'
            },
            'object': {
                'sereselement': 'test_begrep',
                'type': 'SERESelement'
            }
        },
        'test_begrep': {
            'data': {
                'xmi.uuid': 'fsadf23r3f98h978sfhsdfs98'
            },
            'object': {
                'type': 'SERESelement',
                'sereselement': 'test_sereselement',
                'dokumentasjon': 'test_nivå'
            }
        },
        'test_nivå': {
            'data': {
                'xmi.uuid': 'fsadf23r3f98h978sddddd'
            },
            'object': {
                'type': 'Nivå'
            }
        }
    };

    var individual;

    beforeEach(function () {
        el = document.createElement('div');
        graph = new Graph(el, json);
        individual = {
            data: {
                'xmi.uuid': 'fsadf23r3f98h978sfhsdfs98'
            },
            object: {
                type: 'SERESelement',
                nivå: 'test_nivå'
            },
            id: 'test-sereselement',
            size: 5,
            name: '',
            index: 0,
            parents: [{
                parent: 'test_nivå',
                link: 'nivå'
            }],
            isIndividual: true,
            isExpanded: true,
            children: ['test_sereselement']
        };

    });

    describe('Integration tests', function () {
        it('it should render 4 initial nodes and  3 initial paths.', function () {
            var node = el.getElementsByClassName('node');
            var paths = el.getElementsByTagName('path');
            expect(node.length).toEqual(4);
            expect(paths.length).toEqual(3);
        });
    });

    describe('click', function () {
        var center, makeRoot, expandNode, collapseNode, node;

        beforeEach(function () {
            center = spyOn(graph, 'center');
            makeRoot = spyOn(graph, 'makeRoot');
            expandNode = spyOn(graph, 'expandNode');
            collapseNode = spyOn(graph, 'collapseNode');
            clickClass = spyOn(graph, 'clickClass');
            clickIndividual = spyOn(graph, 'clickIndividual');
            node = graph.nodes[0];
        });

        it('should call clickClass and if node is a class and not expanded  ', function () {
            node.isExpanded = false;
            node.isIndividual = false;
            graph.click(node.id);
            expect(clickClass).wasCalled();
            // expect(clickClass).wasCalledWith(node);
        });

        it('should not do anything if node is a class and  expanded  ', function () {
            node.isExpanded = true;
            node.isIndividual = false;
            graph.click(node.id);
            expect(clickClass.wasCalled).toBeFalsy();
            // expect(clickIndividual.wasCalled).toBeFalsy();
        });

        it('should call clickIndividual and if node is a individual and not expanded  ', function () {
            node.isExpanded = false;
            node.isIndividual = true;
            graph.click(node.id);
            expect(clickIndividual).wasCalled();
            // expect(clickIndividual).wasCalledWith(node);
        });

        it('should not do anything if node is a individual and  expanded  ', function () {
            node.isIndividual = true;
            node.isExpanded = true;
            graph.click(node.id);
            expect(clickIndividual.wasCalled).toBeFalsy();
            // expect(clickClass.wasCalled).toBeFalsy();
        });

        xit('should call center and makeRoot if node is expanded ', function () {
            node.isExpanded = true;
            graph.click(node.id);
            expect(center).wasCalled();
            expect(makeRoot).wasCalled();
            expect(center).wasCalledWith(node);
            expect(makeRoot).wasCalledWith(node);
        });

        xit('should call expandNode and makeRoot if node is not expanded ', function () {
            node.isExpanded = true;
            graph.click(node.id);
            expect(center).wasCalled();
            expect(makeRoot).wasCalled();
            expect(center).wasCalledWith(node);
            expect(makeRoot).wasCalledWith(node);
        });


    });

    describe('expandNode', function () {
        it('should add all children to nodes and additional links', function () {
            graph.expandNode(graph.nodes[3]);
            var nodes = graph.nodes;
            var links = graph.links;
            expect(nodes.length).toEqual(7);
            expect(links.length).toEqual(10);
        });

        it('should mark the node as expanded', function () {
            graph.expandNode(graph.nodes[3]);
            expect(graph.nodes[3].isExpanded).toEqual(true);
        });


        it('should call expandClassToIndividual when an individual is opened', function () {
            var expandClassToIndividual = spyOn(graph, 'expandClassToIndividual');
            var seresElement = graph.nodes[3];
            graph.expandNode(seresElement);
            var indiLinkedToSeres = individual;
            individual.isIndividual = true;
            graph.expandNode(indiLinkedToSeres);
            expect(expandClassToIndividual).wasCalled();
            expect(expandClassToIndividual.mostRecentCall.args[0].id).toBe(indiLinkedToSeres.children[0].nodeId);
        });


        it('should create parent and children (links and nodes), when a individual is expanded', function () {
            graph.expandNode(graph.nodes[3]);
            var nodesLength = graph.nodes.length;
            var linksLength = graph.links.length;
            var indi = graph.nodes[6];
            graph.expandNode(indi);
            var expandedInduvidual = getNode(indi.object.sereselement, graph.nodes);
            expect(expandedInduvidual.id).toEqual(indi.object.sereselement);
            expect(graph.nodes.length).toEqual(nodesLength + 1, 'did not add 1 nodes');
            expect(graph.links.length).toEqual(linksLength + 2, 'did not add 2 links');
        });
    });

    describe('expandClassToIndividual', function () {


        beforeEach(function () {
            window.seres.eventController = {}
            window.seres.eventController.toggleNode = function (int) {
                return;
            }
        });

        it('should add the class corresponding to the induvidual', function () {
            var indi = individual;
            indi.object['type'] = 'Nivå';
            indi.index = graph.nodes.length;
            graph.nodes.push(indi);
            graph.expandClassToIndividual(indi);
            seresElement = graph.nodes.pop();
            expect(seresElement).toBeTruthy('Nivå was not expanded');
            expect(seresElement.id).toEqual(indi.object['type'], 'The documentation node was not correct ');
        });

        it('should toogleNode expantion in tree graph', function () {
            var indi = individual;
            var toggleNode = spyOn(window.seres.eventController, "toggleNode").andReturn(true);
            indi.object['type'] = 'Nivå';
            indi.index = graph.nodes.length;
            graph.nodes.push(indi);
            graph.expandClassToIndividual(indi);
            seresElement = graph.nodes.pop();
            expect(toggleNode).wasCalled();
            expect(toggleNode).wasCalledWith(indi.object['type']);
        });


        it('should to nothing of class already is visable', function () {
            var indi = individual;
            indi.isIndividual = true;
            indi.index = graph.nodes.length;
            graph.expandClassToIndividual(indi);
            expect(graph.nodes.length).toEqual(indi.index);
        });

    });


    describe('collapseNode', function () {
        it('should remove all children from nodes', function () {
            var seres = graph.nodes[0];
            graph.collapseNode(seres);
            expect(graph.nodes.length).toEqual(1);
            expect(getNode(seres.id, graph.nodes)).toMatch(seres);
        });

        it('should remove all links connected to removed nodes', function () {
            var seres = graph.nodes[0];
            graph.collapseNode(seres);
            expect(graph.links.length).toEqual(0);
        });

        it('should remove all links connected to removed nodes (dep: test uses expandNode() and update())', function () {
            var linksLength = graph.links.length;
            var seresElement = graph.nodes[3];
            graph.expandNode(seresElement);
            graph.update();
            graph.collapseNode(seresElement);
            expect(graph.links.length).toEqual(linksLength);
        });

        it('should remove all nodes connected to removed nodes (dep: test uses expandNode() and update())', function () {
            var nodesLength = graph.nodes.length;
            var seresElement = graph.nodes[3];
            graph.expandNode(seresElement);
            graph.update();
            graph.collapseNode(seresElement);
            expect(graph.nodes.length).toEqual(nodesLength);
        });

        it('should mark the node as not expanded', function () {
            var seres = graph.nodes[0];
            seres.isExpanded = true;
            graph.collapseNode(seres);
            expect(seres.isExpanded).toBeFalsy();
        });

        // it('should get back rigth colors (dep: test uses expandNode() and update())', function () {
        //     var seresElement = graph.nodes[3];
        //     var color = seresElement.color;
        //     var stroke = seresElement.stroke;
        //     graph.expandNode(seresElement);
        //     graph.update();
        //     graph.collapseNode(seresElement);
        //     expect(seresElement.color).toEqual(color);
        //     expect(seresElement.stroke).toEqual(stroke);
        // });
    });


    describe('makeRoot', function () {
        it('should make the node as root', function () {
            graph.makeRoot(graph.nodes[2]);
            expect(graph.nodes[2].name).toBe(graph.root.name);
        });
        it('should remove old root', function () {
            graph.makeRoot(graph.nodes[2]);
            graph.makeRoot(graph.nodes[0]);
            expect(graph.nodes[2].name).toNotBe(graph.root.name);
        });
    });

    describe('compute', function () {
        it('should make seres to root', function () {
            expect(graph.root.name).toBe('Seres');
        });
        it('should define formater', function () {
            expect(graph.formatter).toBeDefined();
        });
        it('should define parentToChildMap', function () {
            expect(graph.parentToChildMap).toBeDefined();
        });
    });

});
