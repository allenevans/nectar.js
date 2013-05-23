"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - factory", function () {

        var nectar = new Nectar(),
            MyService = function MyService() {
                this.value = Math.round(Math.random() * 99999) + 1;
            };

        MyService.prototype.getValue = function () {
            return this.value;
        };

        nectar.registerFactory("MyService", MyService);

        it("should return the MyService function", function () {

            var result1 = nectar.resolve("MyService"),
                result2 = nectar.resolve("MyService");

            expect(result1).not.toBeNull();
            expect(result1).not.toBeUndefined();
            expect(result1 instanceof MyService).toBe(true);
            expect(result1.constructor === MyService).toBe(true);
            expect(result1.getValue()).toBe(result1.value);
            expect(result2.getValue()).toBe(result2.value);
            expect(result1.getValue()).not.toBe(result2.value);
        });
    });
}(Nectar));