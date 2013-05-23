"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - singleton object", function () {

        var nectar = new Nectar(),

            MyFunction = function () {
                return 1234567;
            },

            MyService = function MyService(MyFunction) {
                this.value = Math.round(Math.random() * 99999) + 1;
                this.funcValue = MyFunction();
            };

        MyService.prototype.getValue = function () {
            return this.value;
        };

        nectar.register("MyFunction", MyFunction);
        nectar.registerSingleton("MyService", MyService);

        it("should return the MyService function", function () {

            var result1 = nectar.resolve("MyService"),
                result2 = nectar.resolve("MyService");

            expect(result1).not.toBeNull();
            expect(result1).not.toBeUndefined();
            expect(result1 instanceof MyService).toBe(true);
            expect(result1.constructor === MyService).toBe(true);
            expect(result1.getValue()).toBe(result1.value);
            expect(result2.getValue()).toBe(result2.value);
            expect(result1.getValue()).toBe(result2.value);
            expect(result1.funcValue).toBe(1234567);
        });
    });
}(Nectar));