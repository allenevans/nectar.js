#nectar.js

nectar.js is a JavaScript dependency injection library intended to help build loosely coupled
JavaScript applications.

Works with modern browsers and Node.Js.

##Install
```
npm install nectar.js
```

##Usage

###Initialize
```js
var nectar = new Nectar();
```

The instantiated nectar object can be stored in global scope e.g.

```js
window.nectar = new Nectar();
```

Alternatively, the nectar instance can be injected into functions to be resolved e.g.
```js
function fred(nectar) {
    alert(nectar.name);
}

(function () {
    var nectar = new Nectar();

    nectar.inject(fred);
}());
```

By default, the nectar instance is automatically registered so it can be injected. Therefore, it is not
a good idea to call any of your function parameter names "nectar". Alternatively, this can be changed
to use another name e.g.

```js
function fred(bob, nectar) {
    alert(bob.name +  " says nectar is " + typeof nectar);
}

(function () {
    var nectar = new Nectar("bob");

    nectar.inject(fred);
}());
```


###register

register - stores an object to be resolved using the given key. Put simply, what you put in is what you get back
when resolve is called.

```js
nectar.register("oh", {my : "object"});

nectar.resolve("oh");
```

```
{my : "object"}
```

###registerSingleton

Registers an object to be resolved later. When the object is resolved for the
first time, a new instance will be instantiated. Subsequent resolutions against
this key will return the first instantiated instance. The object must have
prototype methods defined in order to be instantiated during the resolve process, else the
object will be returned as is.

```js
var WhatIsTheDate = function () {
    this.date = new Date();
};

WhatIsTheDate.prototype = {
    theDate : function () {
        return this.date;
    }
};

nectar.registerSingleton("whatIsTheDate", WhatIsTheDate);

var date1 = nectar.resolve("whatIsTheDate").theDate();
alert("The date is, and will always be " + date1);

var date2 = nectar.resolve("whatIsTheDate").theDate();
alert("The date is, and will always be " + date2);
```

###registerFactory

Registers an object that will be resolved later. Every time the resolve method
is called, a new instance (if applicable) of the object will be instantiated. The object must have
prototype methods defined in order to be instantiated during the resolve process, else the
object will be returned as is.

```js
var WhatIsTheDate = function () {
    this.date = new Date();
};

WhatIsTheDate.prototype = {
    theDate : function () {
        return this.date;
    }
};

nectar.registerFactory("whatIsTheDate", WhatIsTheDate);

var date1 = nectar.resolve("whatIsTheDate").theDate();
alert("The date will keep changing " + date1);

var date2 = nectar.resolve("whatIsTheDate").theDate();
alert("The date will keep changing " + date2);
```

###inject
Injects into the given function, any resolvable arguments based on their name. Any unresolved
arguments will be set to undefined.

```js
nectar.register("iexist", "hello");

nectar.inject(function (iexist, idontexist) {

    alert("iexist and say " + iexist);
    alert("idontexist an am " + typeof idontexist);

});
```

The context of the injected function can also be set using the third parameter.

```js

var newContext = {
    hello : "i'm a new context"
};

nectar.register("iexist", "hello");

nectar.inject(function (iexist, idontexist) {

    alert("iexist and say " + iexist);
    alert("idontexist an am " + typeof idontexist);
    
    alert("hello " + this.hello);

}, null, newContext);
```