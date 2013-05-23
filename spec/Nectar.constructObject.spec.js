"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - construct object", function () {

        var nectar = new Nectar(),
            value = Math.round(Math.random() * 99999) + 1,

            MyObj = function (arg1) {
                this.value = value;
                this.arg1 = arg1;
            };

        MyObj.prototype.getValue = function () {
            return this.value;
        };

        MyObj.prototype.getArg1 = function () {
            return this.arg1;
        };

        it("should create an instance of the object", function () {
            var inst = nectar.constructObject(MyObj, [123]);

            expect(inst).not.toBeNull();
            expect(inst).not.toBeUndefined();
            expect(inst.constructor == MyObj).toBe(true);
            expect(inst instanceof MyObj).toBe(true);
            expect(inst.value).toBe(value);
            expect(inst.getValue()).toBe(value);
            expect(inst.getArg1()).toBe(123);
        });

        it("should not create an instance of the object", function () {

            var result = null;
            try {
                result = nectar.constructObject({ x : 1}, [123]);
            } catch (x) {
                result = x;
            }

            expect(result).not.toBeNull();
            expect(result).toBe("Constructor passed does not support apply method.");
        });
    });
}(Nectar));