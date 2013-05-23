"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - getArgs", function () {

        var nectar = new Nectar();

        it("should return no args", function () {

            var item = function () {};

            expect(nectar.getArgs(item)).not.toBeNull();
            expect(nectar.getArgs(item).constructor == Array).toBe(true);
            expect(nectar.getArgs(item).length).toBe(0);
        });


        it("should return one args", function () {

            var item = function (myArg1){};

            expect(nectar.getArgs(item)).not.toBeNull();
            expect(nectar.getArgs(item).constructor == Array).toBe(true);
            expect(nectar.getArgs(item).length).toBe(1);
            expect(nectar.getArgs(item)[0]).toBe("myArg1");
        });

        it("should return two args", function () {

            var item = ["arg1", "arg2", function (a1, a2){}];

            expect(nectar.getArgs(item)).not.toBeNull();
            expect(nectar.getArgs(item).constructor == Array).toBe(true);
            expect(nectar.getArgs(item).length).toBe(2);
            expect(nectar.getArgs(item)[0]).toBe("arg1");
            expect(nectar.getArgs(item)[1]).toBe("arg2");
        });

    });
}(Nectar));