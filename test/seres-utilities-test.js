describe("sres-utilities",function(){
  var util = window.seres.utilities;
  describe("toLegalClassName",function(){

    it("should return a legall class name",function(){
      var className = util.toLegalClassName("Begrep_45s6af46s5dfsdf21");
      expect(className).toEqual('_begrep__005f45s6af46s5dfsdf21');

    });
  });
});
