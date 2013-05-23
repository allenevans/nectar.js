"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - factory", function () {

        var nectar = new Nectar(),
        
            NumberService = function NumberService(){
                this.number = 7;
            };

        NumberService.prototype.getNumber = function () {
            return this.number;
        };

        var StringifyService = function (numberService){
            this.stringNumber = "Unknown";
            if(numberService.getNumber() === 7){
                this.stringNumber = "Seven";
            }
        };

        StringifyService.prototype.getValue = function () {
            return this.stringNumber;
        };

        var MyService = function MyService(stringifyService){
            this.value = stringifyService.getValue();
        };

        MyService.prototype.getValue = function () {
            return this.value;
        };

        nectar.registerSingleton("numberService", NumberService);
        nectar.registerFactory("stringifyService", StringifyService);
        nectar.registerFactory("MyService", MyService);

        it("should return the MyService function", function () {

            var result = null;

            nectar.inject([
                'stringifyService',
                function (strService){
                    result = strService.getValue();
                }
            ]);

            expect(result).not.toBeNull();
            expect(result).not.toBeUndefined();
            expect(result).toBe("Seven");
        });
    });
}(Nectar));