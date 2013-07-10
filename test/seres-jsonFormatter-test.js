var testValues = window.seres.testValues;
var json = testValues.subClassOfJsonGraphParsed;
var formatter = jsonFormatter(json);

describe('seres-jsonformatter:', function() {
    describe('The function toGraphObject()', function() {

        it('should be defined', function() {
            expect(formatter.toGraphObject).toBeDefined();
        });

        it("should return json", function() {
            expect(formatter.toGraphObject(['Nivå'])).toEqual(jasmine.any(Object));
        });

        it("should have the right format", function() {
            var parsedJson = formatter.toGraphObject(['Nivå']);
            expect(parsedJson.links).toBeDefined();
            expect(parsedJson.nodes).toBeDefined();
        });

        it("should contains right values for a triple", function() {
            expand = [];
            for (var subject in json) {
                expand.push(subject);
            }
            var parsedJson = formatter.toGraphObject(expand);
            expect(parsedJson.links[0].source.name).toEqual("Stukturnivå");
            expect(parsedJson.links[0].target.name).toEqual("Nivå");
            expect(parsedJson.nodes[63].name).toEqual("Implementasjonselement");
        });

    });

    describe('the function filterSparqlJson', function() {
        it('should filter correctly', function() {
            var filtered = formatter.filterSparqlJson('xmi.uuid');
            expect(filtered['test']).toBeDefined();
        });
    });


    describe('The function toTreeObject()', function() {
        var json = testValues.subClassOfJsonGraphParsed;

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

        it("should contains right values for a triple", function() {
            var parsedJson = formatter.toTreeObject();
            var childOfRoot = 'Dokumentasjon';
            var root = "Seres";
            var aSubject2 = "Implementasjonselement";
            var aObjectProperty2 = "childrenOf";
            var aObject = "SERESelement";
            expect(parsedJson[0].name).toEqual(root);
            expect(parsedJson[0].children.length).toEqual(3);
            expect(parsedJson[0].children[2].name).toEqual("SERESelement");
            expect(parsedJson[0].children[2].children[4].children[13].name).toEqual("DataTypeegenskap");
            expect(parsedJson[0].children[2].children[4].children[13].individuals[0].name).toEqual("tekst");
        });

    });


    describe('createNode', function() {
        it('should create a node with correct values', function() {
            var node = formatter.createNode('test', 0);
            expect(node.name).toEqual('test');
            expect(node.id).toEqual(0);
            expect(node.data['xmi.uuid']).toEqual('fsadf23r3f98h978sfhsdfs98');
            expect(node.object.type).toEqual('DataTypeegenskap');
            expect(node.isExpanded).toEqual(false);
        });

        it('should create a standard node if json does not contain subject', function(done) {
            // console.log("LOG:",node);
            var node = formatter.createNode('', 0);
            expect(node.size).toBeDefined();
            expect(node.isExpanded).toEqual(false);
            expect(node.id).toEqual(0);
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