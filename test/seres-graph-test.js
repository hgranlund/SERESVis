describe('graph', function() {
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
        }
    };

    beforeEach(function() {
        el = document.createElement("div");
        graph = new Graph(el, json);
    });


    it('it should render correctly initial circles and paths.', function() {
        var circles = el.getElementsByTagName("circle");
        var paths = el.getElementsByTagName("path");
        expect(circles.length).toEqual(4);
        expect(paths.length).toEqual(3);
    });

    describe('expand_node', function() {
        it('should add all children to the dom', function(done) {
            graph.expand_node(graph.nodes[3]);
            graph.update();
            var circles = el.getElementsByTagName("circle");
            var paths = el.getElementsByTagName("path");
            expect(circles.length).toEqual(5);
            expect(paths.length).toEqual(4);
        });

        it('should mark the node as expanded', function(done) {
            graph.expand_node(graph.nodes[3]);
            expect(graph.nodes[3].isExpanded).toEqual(true);
        });
    });

    describe('collapse_node', function() {
        it('should remove all children from the dom', function(done) {
            graph.collapse_node(graph.nodes[3]);
            graph.update();
            var circles = el.getElementsByTagName("circle");
            var paths = el.getElementsByTagName("path");
            expect(circles.length).toEqual(4);
            expect(paths.length).toEqual(3);
        });

        it('should mark the node as expanded', function(done) {
            graph.expand_node(graph.nodes[3]);
            expect(graph.nodes[3].isExpanded).toEqual(true);
        });
    });

    describe('make_root', function() {
        it('should make the node as root', function(done) {
            graph.make_root(graph.nodes[2]);
            expect(graph.nodes[2].name).toBe(graph.root.name);
        });
        it('should remove old root', function() {
            graph.make_root(graph.nodes[2]);
            graph.make_root(graph.nodes[0]);
            expect(graph.nodes[2].name).toNotBe(graph.root.name);
        });
    });

    describe('compute', function() {
        it('should make seres to root', function() {
            expect(graph.root.name).toBe("Seres");
        });
        it('should define formater', function() {
            expect(graph.formatter).toBeDefined();
        });
        it('should define parentToChildMap', function() {
            expect(graph.parentToChildMap).toBeDefined();
        });
    });

});