console.log("myLib.js");
//var myLib={
//   a:function(){
//       console.log("a");
//   }
//}
define(function(){
    var my=function(){
        console.log("mylib");
    };
    return{
        my:my
    }
});
function mylibs(){
    console.log("mylibs");
}