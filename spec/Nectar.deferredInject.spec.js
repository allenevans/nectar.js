"use strict";
(function (Nectar, undefined) {
    describe("Nectar.js Test - deferredInject", function () {
        it("should inject into MyService once MyFunction has been registered.", function () {
            
            var nectar = new Nectar(),
                result = null,
                
                MyDependency = function MyDependency() {
                    return 123;
                },

                MyService = function MyService(myDependency) {
                    result = myDependency();
                };

            nectar.deferredInject(MyService);
            
            setTimeout(function () {
                nectar.registerSingleton("myDependency", MyDependency);
            }, 10);
            
            waitsFor(function () {
                return result !== null;
            }, "Failed to wait for register myDependency", 100);

            runs(function () {
                expect(result).not.toEqual(null);
                expect(result).toEqual(123);
            });
        });
    });
}(Nectar));