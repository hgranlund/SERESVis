describe("sres-utilities",function(){
  var util = window.seres.utilities;
  describe("toLegalClassName",function(){


    it("should return an empty string if arg is undefined",function(){
      var className = util.toLegalClassName();
      expect(className).toEqual('');
    });

    it("should return a legall class name",function(){
      var className = util.toLegalClassName("Begrep_45s6af46s5dfsdf21");
      expect(className).toEqual('begrep-45s6af46s5dfsdf21');

    });


    it("should to return the same string ut called twice",function(){
      var className = util.toLegalClassName("Begrep_45s6af46s5dfsdf21");
      className = util.toLegalClassName(className);
      expect(className).toEqual('begrep-45s6af46s5dfsdf21');

    });
  });
});
