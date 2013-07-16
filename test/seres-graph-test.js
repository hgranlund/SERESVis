function getNode(id, nodes) {
    var n = nodes.filter(function (d) {
        return d.id === id;
    });
    return n[0] || false;
}
describe('graph', function () {
    var el;
    var graph;
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
                "sereselement": "test_sereselement"
            }
        }
    };
    var individual = {
        data: {
            'xmi.uuid': 'fsadf23r3f98h978sfhsdfs98'
        },
        object: {
            type: 'SERESelement',
            begrep: 'test_begrep'
        },
        id: 'test-sereselement',
        size: 5,
        name: '',
        index: 0,
        isInduvidual: true,
        isExpanded: true,
        children: ['test_begrep'],
        x: 500,
        y: 500,
        color: {
            r: 23,
            g: 190,
            b: 207
        }
    };


    beforeEach(function () {
        el = document.createElement("div");
        graph = new Graph(el, json);
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
            expect(links.length).toEqual(8);
        });

        it('should mark the node as expanded', function () {
            graph.expandNode(graph.nodes[3]);
            expect(graph.nodes[3].isExpanded).toEqual(true);
        });

        it("should expand all children/links of an individual", function () {
            var indi = individual;
            graph.expandNode(indi);
            var expandedInduvidual = getNode(indi.object.sereselement, graph.nodes);
            expect(expandedInduvidual.id).toEqual(indi.object.sereselement);
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
