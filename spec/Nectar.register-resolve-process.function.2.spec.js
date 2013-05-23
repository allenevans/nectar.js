"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - register, resolve, process function", function () {

        var nectar = new Nectar(),

            value = Math.round(Math.random() * 99999) + 1,
            myfunc = function () {
                return value;
            };

        nectar.register("MyFunction", myfunc);

        it("should return the MyFunction function", function () {

            var result = null;
            nectar.inject(["MyFunction", function (myf) {
                result = myf();
            }]);

            expect(result).not.toBe(null);
            expect(result).toBe(value);
        });
    });
}(Nectar));