window.seres.util = function() {

    getJsonFromUrl = function(url) {
        if (url == "") {
            return null;
        };
        var data = $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
        return data;
    }

}();