var vis = window.seres.visualTree;
var testValues = window.seres.testValues;

describe('In seres-visualTree.js:', function() {
	describe('The function toTreeObject()', function() {
		var json = testValues.subClassOfJsonGraphParsed;

		it('should be defined', function() {
			expect(vis.toTreeObject).toBeDefined();
		});

		it("should return object", function() {
			expect(vis.toTreeObject(json)).toEqual(jasmine.any(Object));
		});

		it("should have the right format", function() {
			var parsedJson = vis.toTreeObject(json);
			expect(parsedJson[0].name).toBeDefined();
			expect(parsedJson[0].children).toBeDefined();
		});

		it("should contains right values for a triple", function() {
			var parsedJson = vis.toTreeObject(json);
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
});

