"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - register, resolve, process object", function () {

        var nectar = new Nectar();

        var value = Math.random(1000);
        var myObj = {
            prop1 : value,
            prop2 : 45678
        };

        nectar.register("MyObject", myObj);

        it("should resolve the object myObj", function () {

            var result = nectar.resolve("MyObject");

            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(typeof result == "object").toBe(true);
            expect(result.prop1).toBe(value);
            expect(result.prop2).toBe(45678);
        });

        it("should inject the object MyObject into function", function () {

            var result = null;
            nectar.inject(function (MyObject){
                result = MyObject;
            });

            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(typeof result == "object").toBe(true);
            expect(result.prop1).toBe(value);
            expect(result.prop2).toBe(45678);
        });

        it("should inject the object MyObject into function", function () {

            var result1 = null,
                result2 = null;
            nectar.inject(["MyObject", "MyObject", function (obj1, obj2){
                result1 = obj1;
                result2 = obj2;
            }]);

            expect(result1).not.toBeUndefined();
            expect(result1).not.toBeNull();
            expect(typeof result1 == "object").toBe(true);
            expect(result1.prop1).toBe(value);
            expect(result1.prop2).toBe(45678);

            expect(result2).not.toBeUndefined();
            expect(result2).not.toBeNull();
            expect(typeof result2 == "object").toBe(true);
            expect(result2.prop1).toBe(value);
            expect(result2.prop2).toBe(45678);
        });
    });
}(Nectar));

