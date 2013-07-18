"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - optional", function () {

        var nectar = new Nectar(),

            value = Math.round(Math.random() * 99999) + 1,
            MyFunction = function () {
                return 1234567;
            },

            MyService = function MyService(MyFunction) {
                this.value = value;
                this.funcValue = MyFunction();
            },

            FooService = function FooService(myService, multiplier) {
                this.value = myService.getValue() * multiplier;
            };

        MyService.prototype.getValue = function () {
            return this.value;
        };

        FooService.prototype.getValue = function () {
            return this.value;
        };

        nectar.register("MyFunction", MyFunction);
        nectar.registerSingleton("myService", MyService);

        it("should return the MyService function", function () {

            var optional = {
                multiplier : 2
            },
                fooService = nectar.inject(FooService, optional),
                result = fooService.getValue();

            expect(result).not.toBeUndefined();
            expect(result).not.toBe(0);
            expect(result).not.toBeNull();
            expect(result).toBe(value * 2);
        });
    });
}(Nectar));