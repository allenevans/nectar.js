"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - singleton function", function () {

        var nectar = new Nectar(),

            value = Math.random(1000),
            myfunc = function () {
                return value;
            };

        nectar.registerSingleton("MyFunction", myfunc);

        it("should return the MyFunction function", function () {

            var result1 = nectar.resolve("MyFunction"),
                result2 = nectar.resolve("MyFunction");

            expect(result1).not.toBeNull();
            expect(result1).not.toBeUndefined();
            expect(result1 === myfunc).toBe(true);

            expect(result1()).toBe(value);
            expect(result2()).toBe(value);
        });
    });
}(Nectar));