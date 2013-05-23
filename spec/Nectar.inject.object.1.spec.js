"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - inject object", function () {

        var nectar = new Nectar(),

            MyFunction = function () {
                return 1234567;
            },

            MyService = function MyService(MyFunction) {
                this.value = Math.round(Math.random() * 99999) + 1;
                this.funcValue = MyFunction();
            },
            FooService = function FooService(myService) {
                this.value = myService.getValue();
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

            var fooService = nectar.inject(FooService);
            var result = fooService.getValue();

            expect(result).not.toBeUndefined();
            expect(result).not.toBeNull();
            expect(result).not.toBe(0);
            expect(result).toBe(result);
        });
    });
}(Nectar));