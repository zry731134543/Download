//对模块的加载行为进行自定义
//require.config()就写在主模块（main.js）的头部。
// 参数就是一个对象
require.config({
    //直接改变基目录
    //    baseUrl: "js/lib",

    //指定各个模块的加载路径。
    paths:{
        "device":"lib/device",
        //"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min"可使用网络链接文件
        "jquery":"lib/jquery-1.9.1.min",
        "myLib":"app/myLib",
        "math":"app/math"
    }//,
    //配置不兼容的模块
    //每个模块要定义:
    // （1）exports值（输出的变量名），表明这个模块外部调用时的名称；
    // （2）deps数组，表明该模块的依赖性。
//    shim:{
//
//    }
});
//require()函数接受两个参数
// 第一个参数是一个数组，表示主模块所依赖的模块
// 第二个参数是一个回调函数，当前面指定的模块都加载成功后，它将被调用。加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块。
require(['jquery','math','myLib','device'],function($,math,myLib){//,'myLib'
//    maths();
//    console.log(device.getDevice());
//    math.lib();

});
