"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - multiple instances", function () {

        var nectar1 = new Nectar("nectar1"),
            nectar2 = new Nectar("nectar2");

        var MyObj1 = function () {
            this.value = 1;
        };
        MyObj1.prototype.getValue = function () {
            return this.value;  
        };
        var MyObj2 = function () {
            this.value = 2;
        };
        MyObj2.prototype.getValue = function () {
            return this.value;  
        };

        //register using same name but in different instance of nectar
        nectar1.register("MyObj", MyObj1);
        nectar2.register("MyObj", MyObj2);

        nectar1.register("nectar2", nectar2);
        nectar2.register("nectar1", nectar1);

        it("should get, by reference MyObj, MyObj1 and MyObj2 from nectar1 and nectar2 respectively.", function () {

            var ResolvedMyObj1_A = null,
                ResolvedMyObj2_A = null,
                ResolvedMyObj1_B = null,
                ResolvedMyObj2_B = null;

            nectar1.inject(function (nectar1, nectar2) {
                ResolvedMyObj1_A = nectar1.resolve("MyObj");
                ResolvedMyObj2_A = nectar2.resolve("MyObj");
            });

            nectar2.inject(function (nectar1, nectar2) {
                ResolvedMyObj1_B = nectar1.resolve("MyObj");
                ResolvedMyObj2_B = nectar2.resolve("MyObj");
            });

            expect(ResolvedMyObj1_A).not.toBeUndefined();
            expect(ResolvedMyObj2_A).not.toBeUndefined();  
            expect(ResolvedMyObj1_A).not.toBeNull();
            expect(ResolvedMyObj2_A).not.toBeNull();

            expect((new ResolvedMyObj1_A()).getValue()).toEqual(1);
            expect((new ResolvedMyObj2_A()).getValue()).toEqual(2);

            expect(ResolvedMyObj1_B).not.toBeUndefined();
            expect(ResolvedMyObj2_B).not.toBeUndefined();  
            expect(ResolvedMyObj1_B).not.toBeNull();
            expect(ResolvedMyObj2_B).not.toBeNull();

            expect((new ResolvedMyObj1_B()).getValue()).toEqual(1);
            expect((new ResolvedMyObj2_B()).getValue()).toEqual(2);
        });
    });
}(Nectar));