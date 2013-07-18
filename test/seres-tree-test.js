describe('tree', function () {
    var el;
    var tree;
    var jsonOrig = {
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

    var jsonFormated = {
        'data': {},
        'object': {},
        'id': 'Seres',
        'size': 10,
        'name': 'Seres',
        'index': 0,
        'isInduvidual': false,
        'isExpanded': false,
        'children': [{
            'data': {},
            'object': {
                'subClassOf': 'Seres'
            },
            'id': 'Dokumentasjon',
            'size': 10,
            'name': 'Dokumentasjon',
            'index': 0,
            'isInduvidual': false,
            'isExpanded': false,
            'children': [],
            'x': 500,
            'y': 500
        }, {
            'data': {},
            'object': {
                'subClassOf': 'Seres'
            },
            'id': 'Forvaltingselement',
            'size': 10,
            'name': 'Forvaltingselement',
            'index': 0,
            'isInduvidual': false,
            'isExpanded': false,
            'children': [],
            'x': 500,
            'y': 500
        }, {
            'data': {},
            'object': {
                'subClassOf': 'Seres'
            },
            'id': 'SERESelement',
            'size': 10,
            'name': 'SERESelement',
            'index': 0,
            'isInduvidual': false,
            'isExpanded': false,
            'children': [{
                'data': {},
                'object': {
                    'subClassOf': 'SERESelement'
                },
                'id': 'Nivå',
                'size': 10,
                'name': 'Nivå',
                'index': 0,
                'isInduvidual': false,
                'isExpanded': false,
                'children': [],
                'x': 500,
                'y': 500
            }],
            'x': 500,
            'y': 500
        }],
        'x': 500,
        'y': 500
    };

    var nodeWithOneChild = {
        'data': {},
        'object': {},
        'id': 'Seres',
        'size': 10,
        'name': 'Seres',
        'index': 0,
        'isInduvidual': false,
        'isExpanded': false,
        'children': [{
            'data': {},
            'object': {
                'subClassOf': 'Seres'
            },
            'id': 'Dokumentasjon',
            'size': 10,
            'name': 'Dokumentasjon',
            'index': 0,
            'isInduvidual': false,
            'isExpanded': false,
            'children': [],
            'x': 500,
            'y': 500
        }]
    };



    beforeEach(function () {
        el = document.createElement('div');
        tree = new Tree(el, jsonOrig);
    });

    describe('Integration test', function () {

        it('it should render 4 initial rect and 3 initial paths.', function () {
            var rect = el.getElementsByTagName('rect');
            var paths = el.getElementsByTagName('path');
            expect(rect.length).toEqual(4);
            expect(paths.length).toEqual(3);
        });
    });

    describe('toggle', function () {
        it('should remove/add all children', function () {
            var node = nodeWithOneChild;
            tree.toggle(node);
            expect(node.children).toBe(null);
            expect(node._children).toNotBe(null);
            tree.toggle(node);
            expect(node.children).toNotBe(null);
            expect(node._children).toBe(null);
        });
    });

    describe('resetTree', function () {

        it('should collapse all nodes, but root', function () {
            tree.resetTree();
            var expandedNodes = tree.nodes.filter(function (node) {
                return node.children;
            });
            expect(expandedNodes.length).toEqual(1);
            expect(expandedNodes[0]).toMatch(tree.root);
        });

    });

    xdescribe('compute', function () {
        xit('should make seres to root', function () {
            expect(tree.root.name).toBe('Seres');
        });
        xit('should define formater', function () {
            expect(tree.formatter).toBeDefined();
        });
        xit('should define parentToChildMap', function () {
            expect(tree.parentToChildMap).toBeDefined();
        });
    });

});
