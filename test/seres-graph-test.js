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
                "type": "kommentar",
                "xmi.uuid": "3333VkUhCEeKYVYkXVtHdsQ",
                "språk": "bokmål",
                "xmi.label": "Unknown",
                "tekst": "Allergi er definert i \"Definisjon\"-attributtet",
                "xmi.id": "a14"
            },
            'object': {
                "sereselement": "test_begrep",
                "type": "SERESelement"
            }
        },
        'test_begrep': {
            'data': {
                'xmi.uuid': 'fsadf23r3f98h978sfhsdfs98'
            },
            'object': {
                'type': 'SERESelement',
                "sereselement": "test_sereselement",
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
        el = document.createElement("div");
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


    it('it should render 4 initial nodes and  3 initial paths.', function () {
        var node = el.getElementsByClassName("node");
        var paths = el.getElementsByTagName("path");
        expect(node.length).toEqual(4);
        expect(paths.length).toEqual(3);
    });

    describe('expandNode', function () {
        it('should add all children to grapg.nodes and additional links', function () {
            graph.expandNode(graph.nodes[3]);
            graph.update();
            var nodes = graph.nodes;
            var links = graph.links;
            expect(nodes.length).toEqual(7);
            expect(links.length).toEqual(10);
        });

        it('should mark the node as expanded', function () {
            graph.expandNode(graph.nodes[3]);
            expect(graph.nodes[3].isExpanded).toEqual(true);
        });


        it("should call expandClassToIndividual when an individual is opened", function () {
            var expandClassToIndividual = spyOn(graph, "expandClassToIndividual");
            var indiLinkedToSeres = individual;
            graph.expandNode(indiLinkedToSeres);
            expect(expandClassToIndividual).wasCalled();
            expect(expandClassToIndividual.mostRecentCall.args[0].id).toBe(indiLinkedToSeres.children[0]);
        });


        it("should create parent and children, links and nodes, when a individual is expanded", function () {
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

    describe("expandClassToIndividual", function () {

        it("should add the class corresponding to the induvidual", function () {
            var indi = individual;
            indi.object['type'] = 'Nivå';
            indi.index = graph.nodes.length;
            graph.nodes.push(indi);
            graph.expandClassToIndividual(indi);
            seresElement = graph.nodes.pop();
            expect(seresElement).toBeTruthy('Nivå was not expanded');
            expect(seresElement.id).toEqual(indi.object['type'], 'The documentation node was not correct ');
        });


        it("should to nothing of class already is visable", function () {
            var indi = individual;
            indi.isIndividual = true;
            indi.index = graph.nodes.length;
            graph.expandClassToIndividual(indi);
            expect(graph.nodes.length).toEqual(indi.index);
        });

    });


    describe('collapseNode', function () {
        // it('should remove all children from the dom', function() {
        //     graph.collapseNode(graph.nodes[3]);
        //     graph.update();
        //     var node = el.getElementsByClassName("node");
        //     var paths = el.getElementsByTagName("path");
        //     expect(node.length).toEqual(4);
        //     expect(paths.length).toEqual(3);
        // });

        // it('should mark the node as expanded', function() {
        //     graph.expandNode(graph.nodes[3]);
        //     expect(graph.nodes[3].isExpanded).toEqual(true);
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
            expect(graph.root.name).toBe("Seres");
        });
        it('should define formater', function () {
            expect(graph.formatter).toBeDefined();
        });
        it('should define parentToChildMap', function () {
            expect(graph.parentToChildMap).toBeDefined();
        });
    });

});
