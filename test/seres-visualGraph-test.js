var visualGraph = window.seres.visualGraph;
var testValues = window.seres.testValues;
describe('In seres-visualGraphh.js:', function() {
    describe('The function toGraphObject()', function() {
        var json = testValues.subClassOfJsonGraphParsed;

        it('should be defined', function() {
            expect(visualGraph.toGraphObject).toBeDefined();
        });

        it("should return json", function() {
            expect(visualGraph.toGraphObject(json, ['Nivå'])).toEqual(jasmine.any(Object));
        });

        it("should have the right format", function() {
            var parsedJson = visualGraph.toGraphObject(json, ['Nivå']);
            expect(parsedJson.links).toBeDefined();
            expect(parsedJson.nodes).toBeDefined();
        });

        it("should contains right values for a triple", function() {
            expand = [];
            for (var subject in json) {
                expand.push(subject);
            }
            var parsedJson = visualGraph.toGraphObject(json, expand);
            expect(parsedJson.links[0].source.name).toEqual(expand.indexOf("Stukturnivå"));
            expect(parsedJson.links[0].target.name).toEqual(expand.indexOf("Nivå"));
            expect(parsedJson.nodes[63].name).toEqual("Implementasjonselement");
        });

    });

    describe('the function filterSparqlJson', function() {
        var parsedObject = testValues.subClassOfJsonGraphParsed;
        it('should filter correctly', function() {
            var filtered = visualGraph.filterSparqlJson(parsedObject, 'xmi.uuid');
            expect(filtered['test']).toBeDefined();
        });
    });
});