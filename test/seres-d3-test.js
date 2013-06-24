'use strict';
var util = window.seres.app;

describe("A test suite for index methods", function(){
	it("contains spec with an expectation", function(){
		expect(true).toBe(true);
	});
});

describe('renderNewPostForm', function(){

	beforeEach(function(){
		//Do something
	});

	it('should be defined', function(){
		expect(app.renderNewPostForm).toBeDefined();
	});

});

describe('render404', function(){

	it('should be defined', function(){
		expect(app.render404).toBeDefined();
	});

});