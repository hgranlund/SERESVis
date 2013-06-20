

buster.testCase("My thing", {
    "has the foo and bar": function () {
        assert.equals("foo", "foo");
    },

    "states the obvious": function () {
        assert(true);
    },
    "TESTING ADDER": function () {
        assert(add12(2+2) == 4);
    }

})