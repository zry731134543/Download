
console.log("math.js");
//AMD规范:
//第一个参数 id 为字符串类型，表示了模块标识，为可选参数。若不存在则模块标识应该默认定义为在加载器中被请求脚本的标识。如果存在，那么模块标识必须为顶层的或者一个绝对的标识。
//第二个参数，dependencies ，是一个当前模块依赖的，已被模块定义的模块标识的数组字面量。
//第三个参数，factory，是一个需要进行实例化的函数或者一个对象。
//define(function (){
////    console.log("math");
////    myLib.lib();
////    mylibs();
//    var add = function (x,y){
//        return x+y;
//    };
//    var print=function(){
//        console.log("print");
//    };
//    return {
//        add: add,
//        print:print
//    };
//});

//define(function(){
//    var lib=function(){
//        console.log("math1");
//        mylibs();
////        myLib.a();
//    };
//    return{
//        lib:lib
//    }
//});

//define(['myLib'],function(myLib){
//    var lib=function(){
//        console.log("math2");
//    };
//    return{
//        lib:lib
//    }
//
//});


//function maths(){
//    console.log("maths1");
//}

function maths(){
    console.log("maths2");
    mylibs();
}