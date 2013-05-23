"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - register array with no arguments", function () {

        var nectar = new Nectar();

        var MyService = function MyService(){
            this.value = Math.random(1000);
        };

        nectar.register("MyService", [MyService]);

        var result = nectar.resolve("MyService");

        it("should return the MyService function", function () {

            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result == MyService).toBe(false);
            expect(result.constructor == Array).toBe(true);

        });

    });
}(Nectar));

