
/**
 *
 * @type {{deviceType: (deviceType|*),
 * 设备类型
 * screenWidth: window.screen.width,
 * 设备屏幕宽度
 * screenHeight:window.screen.height,
 * 设备屏幕高度
 * methods: {1: {callMethod: callMethod, setScreenOrientation: setScreenOrientation, getDeviceInfo: getDeviceInfo, setDeviceStatus:setDeviceStatus},
 * 2: {callMethod: callMethod, setScreenOrientation: setScreenOrientation, getDeviceInfo: getDeviceInfo, setDeviceStatus:setDeviceStatus}},
 * 方法集合:1 设备状态为手机,2 设备状态为pc
 * callMethod 调用壳的方法,setScreenOrientation 设置屏幕显示方向,getDeviceInfo 获取设备信息,setDeviceStatus 设置当前屏幕的显示状态
 * initDevice: initDevice,
 * 初始化device方法
 * getDevice: getDevice
 * 获取设备信息
 * }}
 */
var doOk;//记录成功回调方法
var doError;//记录失败回调方法

var device = {
    deviceType: deviceType,//1:Android,2:IOS,3:PC
    screenWidth: null,//屏幕宽度
    screenHeight: null,//屏幕高度
    screenStatus: null,//标识大屏小屏状态：true大屏；false小屏
    screenOrientation: false,//屏幕显示方式,true竖屏,false横屏
    browserVersion: null,//浏览器版本号
    initDevice: function () {
    this.callMethod = this.methods[this.deviceType]['callMethod'];
    this.setScreenOrientation = this.methods[this.deviceType]['setScreenOrientation'];
    this.setDeviceStatus = this.methods[this.deviceType]['setDeviceStatus'];
    this.getDeviceData = this.methods[this.deviceType]['getDeviceData'];
    return this;
    },
    getDevice: function () {
        var deviceInfo = this.methods[this.deviceType]['getDeviceInfo']();
        return deviceInfo || null;
    } ,
    methods: {
        '1': {
            //与壳进行交互
            callMethod: function (methodName, args) {
                //调用壳里面，JSInterfaceHelper中的methodName方法
                JSInterface[methodName].apply(JSInterface, args);
            },
            //设置屏幕方向
            setScreenOrientation: function (orientation, okCallback, failCallback) {
                //强制设置屏幕的方向
                callDeviceMethod('setScreenOrientation', orientation, okCallback, failCallback);
            },
            //获取设备信息
            getDeviceInfo: function () {
                return localStorage.getItem('device');
            },
            //设置屏幕状态
            setDeviceStatus: function () {
                //1.设置屏幕的高度宽度
                this.screenWidth = document.body.clientWidth;
                this.screenHeight = document.body.clientHeight;
                //2.屏幕显示方式,true竖屏,false横屏
                this.screenOrientation = (this.screenHeight > this.screenWidth) ? true : false;
                //3.设置大小屏：true大屏；false小屏
                if (this.screenOrientation) {
                    this.screenStatus = (this.screenWidth >= 600);
                } else {
                    this.screenStatus = (this.screenWidth >= 600);
                }
            },
            //获取设备数据
            getDeviceData: function (okCallback, failCallback) {
                callDeviceMethod('GetDeviceInfo', okCallback, failCallback);
            }
        },
        '2': {
            callMethod: function (methodName, args, argsStr) {
                callDeviceIOS(methodName, args);
            },
            setScreenOrientation: function (orientation, okCallback, failCallback) {
                callDeviceMethod('setScreenOrientation', orientation, okCallback, failCallback);
            },
            setDeviceStatus: function () {
                this.screenWidth = document.body.clientWidth;
                this.screenHeight = document.body.clientHeight;

                this.screenOrientation = (this.screenHeight > this.screenWidth) ? true : false;
                if (this.screenOrientation) {
                    this.screenStatus = (this.screenWidth >= 600);
                }
                else {
                    this.screenStatus = (this.screenWidth >= 600);
                }
            },
            getDeviceInfo: function () {
                return null;
            }
        },
        '3': {
            callMethod: function (methodName, args, argsStr) {
                return eval('window.external.' + methodName + '(' + argsStr + ')');
            },
            setScreenOrientation: function () {
                return null;
            },
            getDeviceInfo: function () {
                return null;
            },
            setDeviceStatus: function () {
                this.screenWidth = document.body.clientWidth;
                this.screenHeight = document.body.clientHeight;
                //获取浏览器版本
                this.browser = getBrowserInfo();

                this.browserVersion = (this.browser + "").replace(/[^0-9.]/ig, "");
                if (this.browserVersion == "7.0") {
                    if (window.addEventListener) {
                        this.browserVersion = "8.0";
                    }
                }
                this.screenOrientation = false;
                if (this.screenOrientation) {
                    this.screenStatus = (this.screenWidth >= 600);
                }
                else {
                    this.screenStatus = (this.screenWidth >= 600);
                }
            },
            getDeviceData: function (okCallback, failCallback) {
                callDeviceMethod('GetDeviceInfo', okCallback, failCallback);
            }
        }
    }
};

/**
 * 调用Android客户端的方法
 * 调用方式:callAndroidMethod('interPretTPD',"aa",function(msg){},function(msg){});
 * @arguments:(客户端方法名,[[客户端方法参数1],[客户端方法参数2]...],调用成功回调函数,调用失败回调函数)
 */
function callDeviceMethod() {
    //获取方法参数
    if (arguments.length == 0)
        return;
    var methodName = arguments[0];//壳中的方法名
    var args = [];//方法的参数集合
    var argsStr = '';
    for (var i = 0, len = arguments.length; i < len; i++) {
        if (i > 0 && (typeof arguments[i] !== 'function')) {
            //调用Android函数的函数参数
            args.push(arguments[i]);
            //调用windows函数的函数参数
            argsStr += '\'' + arguments[i] + '\',';
        } else if (typeof arguments[i] == 'function' && len - i == 2) {
            //执行成功回调函数赋值给doOk
            doOk = arguments[i];
        } else if (typeof arguments[i] == 'function' && len - i == 1) {
            //执行失败回调函数赋值给doError
            doError = arguments[i];
        }
    }
    if (argsStr.length > 0)
        argsStr = argsStr.substring(0, argsStr.length - 1);
    try {
        device.callMethod(methodName, args, argsStr);
    } catch (ex) {
        createModal(document.getElementById('body'), ex.message);
    }
}

/**
 * 执行成功回调函数
 * @param localJson 本地数据
 * @param webJson 服务器返回回来的数据
 */
function successCallBackForApp(localJson, webJson) {
    if((typeof childIframe != "undefined") && childIframe != null && typeof (doOk) === "undefined"){
        childIframe.contentWindow.successCallBackForApp(localJson, webJson);
        return;
    }
    if (deviceType != 3) {
        if (!localJson) {
            localJson = '';
        } else if (isString(localJson) && (localJson.indexOf("{")>=0 || localJson.indexOf("[")>=0)) {
            //解决非json格式的字符串被解析
            localJson = JSON.parse(localJson);
        }
        if (!webJson)
            webJson = '';
        else if (isString(webJson)
            && webJson != "[]"
            && (webJson.indexOf('Online OFF') < 0)
            && (webJson.indexOf('Connection fail') < 0)
            && (localJson.indexOf("{")>=0 || localJson.indexOf("[")>=0)) {
            webJson = JSON.parse(webJson);
        }
    }
    doOk(localJson, webJson);
}

/**
 * 执行失败回调函数
 * @param jsonParameters 反馈数据
 */
function failCallBackForApp(jsonParameters) {
    if((typeof childIframe != "undefined") && childIframe != null && typeof (doOk) === "undefined")
    {
        childIframe.contentWindow.failCallBackForApp(jsonParameters);
        return;
    }
    doError(jsonParameters);
}

/**
 * 没有使用页面的逻辑，直接从壳中调用页面的JS方法
 * @param funName 全局的JS方法名称
 * @param objParam 对象的方式传递
 */
function methodFromShellDirect(funName, objArg){
    if((typeof childIframe != "undefined")
        && childIframe != null
        && typeof childIframe.contentWindow[funName] == 'function'){
        childIframe.contentWindow[funName](objArg);
        return;
    }
    window[funName](objArg);
}




/**
 * JS与IOS的壳中进行交互
 * @param functionName 壳中的函数名
 * @param parameter 传递到壳中的参数
 */
function callDeviceIOS(functionName, parameter) {
    connectWebViewJavascriptBridge(function (bridge) {
        bridge.init(function (message, responseCallback) {
            var data = { 'Javascript Responds': 'Wee!' };
            responseCallback(data);
        });
        bridge.registerHandler('javascriptHandler', function (data, responseCallback) {
            if (functionName == 'UpdateCourse') {
                successCallBackForApp(data);
            }
            if (functionName == 'DownloadCourse') {
                successCallBackForApp(data);
                responseCallback(1);
            }
            else {
                if (data.local != "") {
                    data.local = JSON.parse(data.local);
                }

                if (data.web != "" && data.web !== "Online OFF" && "Connection fail") {
                    data.web = JSON.parse(data.web);
                }
                successCallBackForApp(data.local, data.web);
            }
        })

        bridge.registerHandler('localJavascriptHandler', function (data, responseCallback) {
            objLocal = data;
            responseCallback(1);
        })

        bridge.registerHandler('webJavascriptHandler', function (data, responseCallback) {
            objWeb = data;
            successCallBackForApp(objLocal, objWeb);
        })

        bridge.registerHandler('errorJavascriptHandler', function (data, responseCallback) {
            failCallBackForApp(data);
        })

        bridge.callHandler(functionName, parameter, function (response) {
            createModal(document.getElementById('body'), response, 2);
        });
    })
}

/**
 * IOS的Bridge
 * @param callback
 */
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge);
        }, false);
    }
}