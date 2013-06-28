var visualGraph = window.seres.visualGraph;
var testValues = window.seres.testValues;
describe('In seres-visualGraphh.js:', function() {
    describe('The function toGraphObject()', function() {
        var json = testValues.subClassOfJsonGraphParsed;

        it('should be defined', function() {
            expect(visualGraph.toGraphObject).toBeDefined();
        });

        it("should return json", function() {
            expect(visualGraph.toGraphObject(json)).toEqual(jasmine.any(Object));
        });

        it("should have the right format", function() {
            var parsedJson = visualGraph.toGraphObject(json);
            expect(parsedJson.links).toBeDefined();
            expect(parsedJson.nodes).toBeDefined();
        });

        it("should contains right values for a triple", function() {
            var parsedJson = visualGraph.toGraphObject(json);
            expect(parsedJson.links[0][0]).toEqual("Stukturnivå");
            expect(parsedJson.links[0][1]).toEqual("Nivå");
            expect(parsedJson.nodes[63].text).toEqual("Implementasjonselement");
        });

        });
    });