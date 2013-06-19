// Browser tests
var buster = require("buster");
var myLib = require("../lib/my-lib");

buster.testCase("A module", {
    "states the obvious": function () {
        assert(true);
    }
});