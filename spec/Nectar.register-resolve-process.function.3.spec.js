"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - register, resolve, process function", function () {

        var nectar = new Nectar(),

            value = Math.round(Math.random() * 99999) + 1,
            myfunc1 = function () {
                return value;
            },
            myfunc2 = function (MyFunction) {
                if (!MyFunction) {
                    throw "Failed to resolve MyFunction";
                }
                return MyFunction() * 2;
            },

            myfunc3 = function (MyFunction, MyFunction2) {
                if (!MyFunction) {
                    throw "Failed to resolve MyFunction";
                }
                if (!MyFunction2) {
                    throw "Failed to resolve MyFunction2";
                }

                return MyFunction() * MyFunction2();
            },

            myfunc4 = function (f1, f2) {
                if (!f1) {
                    throw "Failed to resolve MyFunction";
                }
                if (!f2) {
                    throw "Failed to resolve MyFunction2";
                }

                return f1() * f2;
            };

        nectar.register("MyFunction", myfunc1);
        nectar.register("MyFunction2", myfunc2);
        nectar.register("MyFunction3", myfunc3);

        it("should resolve the MyFunction2 function", function () {

            var result = nectar.resolve("MyFunction2");

            console.log(result.toString());

            expect(result).not.toBe(null);
            expect(result).toBe(value * 2);
        });

        it("should resolve the MyFunction3 function", function () {

            var result = nectar.inject([
                "MyFunction",
                "MyFunction2",
                myfunc4
            ]);

            console.log(result.toString());

            expect(result).not.toBe(null);
            expect(result).toBe(value * (value * 2));
        });
    });
}(Nectar));