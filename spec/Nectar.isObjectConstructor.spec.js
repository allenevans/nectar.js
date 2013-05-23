"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - is object constructor", function () {

        var nectar = new Nectar();

        it("should return true for function with prototype methods", function () {

            var objFunc = function (arg1){
                this.prop1 = arg1;
            };

            objFunc.prototype.getProp1 = function () {
                return this.prop1;
            };

            var result = nectar.isObjectConstructor(objFunc);
            expect(result).toBe(true);
        });

        it("should return false for function without prototype methods", function () {

            var myfunc = function (arg1){
                return arg1;
            };

            var result = nectar.isObjectConstructor(myfunc);
            expect(result).toBe(false);
        });

        it("should return false for object", function () {

            var Obj = function (arg1){
                return arg1;
            };

            var myObj = new Obj();

            var result = nectar.isObjectConstructor(myObj);
            expect(result).toBe(false);
        });

        it("should return false for object", function () {
            var result = nectar.isObjectConstructor({myProp:1});
            expect(result).toBe(false);
        });

        it("should return false for invalid values", function () {
            expect(nectar.isObjectConstructor()).toBe(false);
            expect(nectar.isObjectConstructor(null)).toBe(false);
            expect(nectar.isObjectConstructor(undefined)).toBe(false);
            expect(nectar.isObjectConstructor(1)).toBe(false);
            expect(nectar.isObjectConstructor("1")).toBe(false);
        });
    });
}(Nectar));

