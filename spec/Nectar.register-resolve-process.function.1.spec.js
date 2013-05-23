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

            var result1 = nectar.resolve("MyFunction"),
                result2 = nectar.resolve("MyFunction"),

                result3 = nectar.inject(function () { return 1; }),
                result4 = nectar.inject(function (MyFunction) { return MyFunction(); });

            expect(result1).not.toBeNull();
            expect(result1).not.toBeUndefined();
            expect(result1 === myfunc).toBe(true);
            expect(result1()).toBe(value);
            expect(result2()).toBe(value);
            expect(result3).toBe(1);
            expect(result4).toBe(value);

        });

        it("should set outerValue to be value", function () {

            var outerValue = null;

            nectar.inject(function (MyFunction){
                outerValue = MyFunction();
            });

            expect(outerValue).not.toBeNull();
            expect(outerValue).toBe(value);
        });
    });
}(Nectar));