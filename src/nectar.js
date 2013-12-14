/*
 * Nectar.js:   JavaScript Dependency Injection Library
 * Version  :   0.1.6
 * Date     :   14/12/2013
 * Author   :   Allen Evans
 * 
 * ------------------------------------------------------------------------------------------------
    The MIT License (MIT)

    Copyright (c) 2013 Allen Evans

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
 */
(function (window, module) {
    "use strict";

    var Nectar = function (name) {
        this.name = name || "nectar";
        this.dependencies = [];

        // list of unresolved items to be resolved once all dependencies
        // are resolvable.
        this._unresolved = []; 
    };

    /**
    *   @function isObjectConstructor.
    *   @description checks to see if object can be instantiated.
    *   @param {Object} obj object to check.
    *   @returns {Boolean} True if the object can be instantiated with the new command.
    */
    Nectar.prototype.isObjectConstructor = function (obj) {
        if (obj && typeof obj === "function" && obj.prototype) {
            return Object.keys(obj.prototype).length > 0;
        } else {
            return false;
        }
    };

    /**
    *   @function constructObject.
    *   @description creates an instance of the object using the given arguments.
    *   @param {Object} constructor object to instantiate.
    *   @param {Object} args to pass into the object constructor.
    *   @returns {Object} Newly instantiated object.
    */
    Nectar.prototype.constructObject = function (constructor, args) {

        function F() {
            constructor.apply(this, args);
        }

        if (args && args.constructor !== Array) {
            throw "Arguments passed to constructObject must be in the form of an array.";
        } else if (!constructor || !constructor.apply) {
            throw "Constructor passed does not support apply method.";
        } else {
            F.prototype = constructor.prototype;
            return new F();
        }
    };

    /**
    *   @function register.
    *   @description registers an object 
    *   @param {String} key identifier to look up item with.
    *   @param {Object} item to be stored against the key.
    */
    Nectar.prototype.register = function (key, item) {
        if (key && !Array.prototype[key]) {
            this.dependencies[key] = function () { return item; };
            
            this.processUnresolved();
        }
    };

    /**
    *   @function registerSingleton.
    *   @description registers an object to be resolved later. When the object is resolved for the
    *                first time, a new instance will be instantiated. Subsequent resolutions against
    *                this key will return the first instantiated instance.
    *   @param {String} key identifier to store singleton against.
    *   @param {Object} singleton singleton function / object constructor.
    *   @param {Object} optional resolved dependencies to use when resolving the singleton.
    */
    Nectar.prototype.registerSingleton = function (key, singleton, optional) {

        if (key && !Array.prototype[key]) {

            var self = this,
                instance = null;

            this.dependencies[key] = function () {
                if (!instance) {
                    instance = self.resolve(singleton, optional);
                }

                return instance;
            };
            
            this.processUnresolved();
        }
    };

    /**
    *   @function registerFactory.
    *   @description registers an object that will be resolved later. Every time the resolve method
    *                is called, a new instance (if applicable) of the object will be instantiated.
    *   @param {String} key identifier to store factory against.
    *   @param {Object} factory function / object constructor to be instantiated upon resolve.
    *   @param {Object} optional resolved dependencies to use when resolving the factory.
    */
    Nectar.prototype.registerFactory = function (key, factory, optional) {

        if (key && !Array.prototype[key]) {

            var self = this;

            this.dependencies[key] = function () {
                return self.inject(factory, optional);
            };
            
            this.processUnresolved();
        }
    };

    /**
    *   @function processUnresolved.
    *   @description processes any unresolved deferred inject requests.
    */
    Nectar.prototype.processUnresolved = function () {        
        var self = this;
        
        if (self._unresolved.length) {
            var toProcess = self._unresolved;
            self._unresolved = [];
            
            toProcess.forEach(function (item) {
                self.inject.apply(self, item);
            });
        }
    };
    
    /**
    *   @function hasResolveableArgs.
    *   @description checks if the item passed has named arguments that can be resolved.
    *   @param {Object} item object / function / object constructor to check.
    *   @param {Object} optional resolved dependencies.
    *   @returns {Boolean} True if the function / constructor has arguments that can be resolved.
    */
    Nectar.prototype.hasResolveableArgs = function (item, optional) {
        var self = this,
            resolveableArgs = self.getArgs(item).reduce(function (result, arg) {
                var r = self.resolve(arg, optional);
                if (r) {
                    result.push(r);
                }
                return result;
            }, []);

        return !!(resolveableArgs && resolveableArgs.length);
    };

    /**
    *   @function resolve.
    *   @description resolves an object.
    *   @param {Object} item
    *                   string => resolves by key
    *                   object => resolves object and any dependencies it may have.
    *   @param {Object} optional resolved dependencies.
    *   @returns {Object} Returns the resolved object.
    */
    Nectar.prototype.resolve = function (item, optional) {

        var self = this,
            resolved = null,
            dependency = null,
            resolvedArgs = null,
            resolveableArgs,
            args = null;

        optional = optional || {};
        optional[this.name] = self;

        if (typeof item === "string") {

            dependency = null;

            if (optional && optional[item]) {
                dependency = function () { return optional[item]; };
            } else {
                dependency = self.dependencies[item];
            }

            if (dependency) {
                resolved = dependency();

                args = this.getArgs(resolved);
                resolveableArgs = args.reduce(function (result, arg) {
                    var r = self.resolve(arg, optional);
                    if (r) {
                        result.push(r);
                    }
                    return result;
                }, []);

                if (resolveableArgs.length > 0) {

                    return (function () {
                        var res = self.inject(resolved, optional);
                        return res;
                    }());
                } else {
                    return resolved;
                }
            } else {
                return undefined;
            }
        } else if (item.constructor === Array) {
            resolvedArgs = item.map(function (arg) { return self.resolve(arg, optional); });
            return resolvedArgs;
        } else if (this.isObjectConstructor(item)) {
            args = this.getArgs(item);
            resolvedArgs = args.map(function (arg) { return self.resolve(arg, optional); });
            return this.constructObject(item, resolvedArgs);
        } else if (typeof item === "function") {
            return item;
        } else {
            return null;
        }
    };

    /**
    *   @function inject.
    *   @description for the given function, any resolvable arguments are resolved and injected
    *                   by calling the function.
    *   @param {Object} func function to resolve arguments and call.
    *   @param {Object} optional resolved dependencies.
    *   @param {Object} context when injecting functions only.
    *   @returns {Object} Returns the result of calling the function.
    */
    Nectar.prototype.inject = function (func, optional, context) {

        if (func) {

            var self = this,
                args = this.getArgs(func),
                resolvedArgs = null,
                target;

            if (func.constructor === Array) {
                target = func[func.length - 1];
                resolvedArgs = args.map(function (arg) { return self.resolve(arg, optional); });
                return target.apply(context || target, resolvedArgs);
            } else if (this.isObjectConstructor(func)) {
                args = this.getArgs(func);
                resolvedArgs = args.map(function (arg) { return self.resolve(arg, optional); });
                return this.constructObject(func, resolvedArgs);
            } else if (typeof func === "object") {
                return func;
            } else {
                if (args.length === 0) {
                    //nothing to do. call func.
                    return func.call(context || func);
                } else {
                    resolvedArgs = args.map(function (arg) { return self.resolve(arg, optional); });
                    return func.apply(context || func, resolvedArgs);
                }
            }
        } else {
            return undefined;
        }
    };

    
    /**
    *   @function deferredInject.
    *   @description for the given function, the resolvable arguments are resolved and injected
    *                   by calling the function once as soon as all arguments are resolvable.
    *   @param {Object} func function to resolve arguments and call.
    *   @param {Object} optional resolved dependencies.
    *   @param {Object} context when injecting functions only.
    *   @returns {Object} Returns the result of calling the function.
    */
    Nectar.prototype.deferredInject = function (func, optional, context) {
        
        // TODO. Refactor code.
        if (func) {

            var self = this,
                args = this.getArgs(func),
                resolvedArgs = null,
                target;

            if (func.constructor === Array) {
                target = func[func.length - 1];
                resolvedArgs = args.map(function (arg) { return self.resolve(arg, optional); });
                
                if (resolvedArgs.some(function (arg) { return arg === undefined; })) {
                    // has unresolved arguments.
                    self._unresolved.push([func, optional, context]);
                    return undefined;
                } else {
                    return target.apply(context || target, resolvedArgs);
                }
                
            } else if (this.isObjectConstructor(func)) {
                
                args = this.getArgs(func);
                resolvedArgs = args.map(function (arg) { return self.resolve(arg, optional); });
                
                if (resolvedArgs.some(function (arg) { return arg === undefined; })) {
                    // has unresolved arguments.
                    self._unresolved.push([func, optional, context]);
                    return undefined;
                } else {
                    return this.constructObject(func, resolvedArgs);
                }
                
            } else if (typeof func === "object") {
                return func;
            } else {
                if (args.length === 0) {
                    // nothing to do. call func.
                    return func.call(context || func);
                } else {
                    resolvedArgs = args.map(function (arg) { return self.resolve(arg, optional); });
                    
                    if (resolvedArgs.some(function (arg) { return arg === undefined; })) {
                        // has unresolved arguments.
                        self._unresolved.push([func, optional, context]);
                        return undefined;
                    } else {
                        return func.apply(context || func, resolvedArgs);
                    }
                }
            }
        } else {
            return undefined;
        }
    };
    
    /**
    *   @function getArgs.
    *   @description reflects to get the arguments of the given function.
    *   @param {Function} item function to get arguments for.
    *   @returns {Object} True if the function / constructor has arguments that can be resolved.
    */
    Nectar.prototype.getArgs = function (item) {
        if (item && item.constructor === Array) {
            return item.reduce(function (result, value) {
                if (typeof value === "string") {
                    result.push(value);
                }
                return result;
            }, []);
        } else if (typeof item === "function") {
            var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
                text = item.toString();
            return text.match(FN_ARGS)[1]
                .split(',')
                .reduce(function (args, arg) {
                    if (arg.length) {
                        args.push(arg.trim());
                    }
                    return args;
                }, []);
        } else {
            return [];
        }
    };

    /**
    *   @function getDependencies.
    *   @description gets a list of dependencies for the given object that need to be resolved.
    *   @param {Object} item object to get dependencies for.
    *   @returns {Array} returns dependencies for the given item..
    */
    Nectar.prototype.getDependencies = function (item) {
        var self = this,
            args = this.getArgs(item);

        return args.map(function (key) {
            return self.dependencies[key]();
        });
    };

    if (window) {
        window.Nectar = Nectar;
    }

    if (module) {
        module.exports = Nectar;
    }
}(typeof window !== "undefined" ? window : null, typeof module !== "undefined" ? module : null));