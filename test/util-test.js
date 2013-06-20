describe("A suite", function() {
	it("contains spec with an expectation", function() {
		expect(true).toBe(true);
	});
});

describe('getJsonformUrl', function() {
	var url = "http://localhost:3030/ds/query?query=select+*+where+%7B%3Fd+%3Ff+%3Fg%7D&output=json&stylesheet=%2Fxml-to-html.xsl";

	it('get empty json if url is empty', function() {
		var json = {};
		expect(getJsonFromUrl("")).toBe(null);
	});
	it("should make an AJAX request to the correct URL", function() {
		spyOn($, "ajax");
		getJsonFromUrl(url);
		expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://localhost:3030/ds/query?query=select+*+where+%7B%3Fd+%3Ff+%3Fg%7D&output=json&stylesheet=%2Fxml-to-html.xsl");
	});

	it("should return json", function() {
	  expect(getJsonFromUrl(url) instanceof Object).toBeTruthy();
	});
});

