"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - register, resolve, process constructor", function () {

        var nectar = new Nectar();

        var value = Math.round(Math.random() * 99999) + 1;
        var myObj = function () {
            this.value = value;
        };

        myObj.prototype.getValue = function () {
            return this.value;  
        };

        nectar.register("MyObject", myObj);

        it("should resolve the object myObj but it should intantiate it", function () {

            var result = nectar.resolve("MyObject");

            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(typeof result == "function").toBe(true);
            expect(typeof result == "object").toBe(false);
            expect(typeof new result() == "object").toBe(true);
            expect(new result().getValue()).toBe(value);
        });

        it("should inject the uninstantiated object myObj", function () {

            var result1 = null;
            nectar.inject(function (MyObject){
                result1 = MyObject;
            });

            expect(result1).not.toBeUndefined();
            expect(result1).not.toBeNull();
            expect(typeof result1 == "function").toBe(true);
            expect(typeof result1 == "object").toBe(false);
            expect(typeof new result1() == "object").toBe(true);
            expect(new result1().getValue()).toBe(value);
        });

        it("should inject the uninstantiated object myObj", function () {

            var result = null;
            nectar.inject(["MyObject", function (obj){
                result = obj;
            }]);
            
            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(typeof result == "function").toBe(true);
            expect(typeof result == "object").toBe(false);
            expect(typeof new result() == "object").toBe(true);
            expect(new result().getValue()).toBe(value);
        });
    });
}(Nectar));

