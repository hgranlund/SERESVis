var testValues = window.seres.testValues;
var json_orig = {
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
    'test': {
        'data': {
            'xmi.uuid': 'fsadf23r3f98h978sfhsdfs98'
        },
        'object': {
            'type': 'SERESelement'
        }
    }
};

var formatter = jsonFormatter(json_orig);

describe('seres-jsonformatter:', function() {
    describe('The function toGraphObject()', function() {

        it('should be defined', function() {
            expect(formatter.toGraphObject).toBeDefined();
        });

        it("should return json", function() {
            expect(formatter.toGraphObject(['SERESelement'])).toEqual(jasmine.any(Object));
        });

        it("should have the right format", function() {
            var parsedJson = formatter.toGraphObject(['SERESelement']);
            expect(parsedJson.links).toBeDefined();
            expect(parsedJson.nodes).toBeDefined();
        });

        it("should contains right values for a triple", function() {
            expand = [];
            for (var subject in json_orig) {
                expand.push(subject);
            }
            var parsedJson = formatter.toGraphObject(expand);
            expect(parsedJson.links[0].source).toEqual(1);
            expect(parsedJson.links[0].target).toEqual(0);
            expect(parsedJson.nodes[2].name).toEqual("Forvaltingselement");
        });

    });

    xdescribe('the function filterSparqlJson', function() {
        it('should filter correctly', function() {
            var filtered = formatter.filterSparqlJson('xmi.uuid');
            expect(filtered['test']).toBeDefined();
        });
    });


    describe('The function toTreeObject()', function() {
        var json_orig = testValues.subClassOfJsonGraphParsed;

        it('should be defined', function() {
            expect(formatter.toTreeObject).toBeDefined();
        });

        it("should return object", function() {
            expect(formatter.toTreeObject()).toEqual(jasmine.any(Object));
        });

        it("should have the right format", function() {
            var parsedJson = formatter.toTreeObject();
            expect(parsedJson[0].name).toBeDefined();
            expect(parsedJson[0].children).toBeDefined();
        });

        it("should contains right values for a triple ", function() {
            var parsedJson = formatter.toTreeObject();
            expect(parsedJson[0].name).toEqual('Seres');
            expect(parsedJson[0].children.length).toEqual(3);
            expect(parsedJson[0].children[2].name).toEqual("SERESelement");
            expect(parsedJson[0].children[1].name).toEqual("Forvaltingselement");
            expect(parsedJson[0].children[2].individuals[0].name).toEqual("test");
        });

    });


    describe('createNode', function() {
        it('should create a node with correct values', function() {
            var node = formatter.createNode('test', 0);
            expect(node.name).toEqual('');
            expect(node.index).toEqual(0);
            expect(node.id).toEqual('test');
            expect(node.data['xmi.uuid']).toEqual('fsadf23r3f98h978sfhsdfs98');
            expect(node.object.type).toEqual('SERESelement');
            expect(node.isExpanded).toEqual(false);
        });

        it('should create a standard node if json does not contain subject', function(done) {
            // console.log("LOG:",node);
            var node = formatter.createNode('', 0);
            expect(node.size).toBeDefined();
            expect(node.isExpanded).toEqual(false);
            expect(node.index).toEqual(0);
            expect(node.id).toEqual(0);
        });

        it('should add all childeren to nodes', function(done) {
            var node = formatter.createNode('Seres', 0);
            expect(node.children.length).toEqual(3);
        });

        it('should add an empty children array if no children exist', function () {
            var node = formatter.createNode('Forvaltingselement', 0);
            expect(node.children.length).toEqual(0);
        });
    });

    // // TODO: should make json stateless
    // describe('createLink', function() {
    //     var nodes = [{'id':0,
    //     'name':'Seres'},
    //     {''}
    // }]
    //     it('should create a link between two connected nodes', function(done) {
    //         var links = createLink('Seres', nodes);
    //     })
    // })



});