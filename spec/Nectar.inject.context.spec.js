"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - inject context", function () {
        var nectar = new Nectar(),
            contextVariable = "Hello World",
            MyFunction = function () {
                return typeof this.contextVariable;
            };

        nectar.register("MyFunction", MyFunction);

        it("should return not have access to the contextVariable", function () {
            var result = nectar.inject(MyFunction);
            expect(result).toBe("undefined");
        });
        
        it("should have access to the contextVariable", function () {
            var result = nectar.inject(MyFunction, null, {contextVariable : "Hello world"});
            expect(result).toBe("string");
        });
        
        
    });
}(Nectar));