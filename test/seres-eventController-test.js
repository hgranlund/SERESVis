describe('EventController', function () {

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
    },
        graph,
        el,
        controller,
        tree,
        nodeData = {
            id: 123,
            isInduvidual: false
        };

    beforeEach(function () {
        el = document.createElement('div');
        graph = new Graph(el, json);
        tree = new Tree(el, json);
        controller = new EventController(tree, graph);
    });

    describe('fireClick', function () {
        it('should be defined in graph', function (done) {
            expect(graph.click).toBeDefined();
        });

        it('should be defined in tree', function (done) {
            expect(tree.click).toBeDefined();
        });

        it('should be defined in event controller', function (done) {
            expect(controller.fireClick).toBeDefined();
        });

        it('should fire click in both tree and graph', function (done) {
            var graphClick = spyOn(graph, 'click');
            var treeClick = spyOn(tree, 'click');
            controller.fireClick(nodeData);
            expect(graphClick.wasCalled).toBeTruthy();
            expect(treeClick.wasCalled).toBeTruthy();
            expect(treeClick.mostRecentCall.args[0]).toBe(123);
            expect(graphClick.mostRecentCall.args[0]).toBe(123);
        });

    });


    describe('fireMouseOver', function () {
        it('should be defined in graph', function (done) {
            expect(graph.mouseOver).toBeDefined();
        });

        it('should be defined in tree', function (done) {
            expect(tree.mouseOver).toBeDefined();
        });

        it('should be defined in event controller', function (done) {
            expect(controller.fireMouseOver).toBeDefined();
        });

        it('should fire mouseOver in both tree and graph', function (done) {
            var graphClick = spyOn(graph, 'mouseOver');
            var treeClick = spyOn(tree, 'mouseOver');
            controller.fireMouseOver(nodeData);
            expect(graphClick.wasCalled).toBeTruthy();
            expect(treeClick.wasCalled).toBeTruthy();
            expect(treeClick.mostRecentCall.args[0]).toBe(123);
            expect(graphClick.mostRecentCall.args[0]).toBe(123);
        });

    });

    describe('fireMouseOut', function () {
        it('should be defined in graph', function (done) {
            expect(graph.mouseOut).toBeDefined();
        });

        it('should be defined in tree', function (done) {
            expect(tree.mouseOut).toBeDefined();
        });

        it('should be defined in event controller', function (done) {
            expect(controller.fireMouseOut).toBeDefined();
        });

        it('should fire mouseOut in both tree and graph', function (done) {
            var graphClick = spyOn(graph, 'mouseOut');
            var treeClick = spyOn(tree, 'mouseOut');
            var getNode = spyOn(util, 'getNode').andReturn(nodeData);
            controller.fireMouseOut(nodeData);
            expect(graphClick.wasCalled).toBeTruthy();
            expect(treeClick.wasCalled).toBeTruthy();
            expect(treeClick.mostRecentCall.args[0]).toBe(123);
            expect(graphClick.mostRecentCall.args[0]).toBe(123);
        });

    });
});
