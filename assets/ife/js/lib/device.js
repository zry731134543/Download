/**
 * 设备类型: deviceType
 * 设备屏幕宽度: screenWidth: window.screen.width,
 * 设备屏幕高度: screenHeight:window.screen.height,
 * 方法集合:1 设备状态为android手机
 * methods: {1: {callMethod: callMethod, setScreenOrientation: setScreenOrientation,getDeviceInfo: getDeviceInfo, setDeviceStatus:setDeviceStatus}
 * callMethod 调用壳的方法,setScreenOrientation 设置屏幕显示方向,getDeviceInfo 获取设备信息,setDeviceStatus 设置当前屏幕的显示状态
 * 初始化device方法:initDevice,
 * 获取设备信息 : getDevice
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
    },
    methods: {
        '1': {
            /**
             * 调用壳里面，InterfaceHelp中的methodName方法
             * InterfaceHelp为webView传来的对象名
             * args 所调用的参数方法集合
             */
            callMethod: function (methodName, args) {
                InterfaceHelp[methodName].apply(InterfaceHelp, args);
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
                //3.设置大小屏：true大屏；false小屏，可以细分
                this.screenStatus = (this.screenWidth >= 600);
            },
            //获取设备数据
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
        device.callMethod(methodName, args);
    } catch (ex) {
        console.log("调用手机方法失败");
    }
}

/**
 * 执行成功回调函数
 * @param localJson 本地数据
 * @param webJson 服务器返回回来的数据
 */
function successCallBackForApp(localJson, webJson) {
    if ((typeof childIframe != "undefined") && childIframe != null && typeof (doOk) === "undefined") {
        childIframe.contentWindow.successCallBackForApp(localJson, webJson);
        return;
    }
    if (deviceType != 3) {
        if (!localJson) {
            localJson = '';
        } else if (isString(localJson) && (localJson.indexOf("{") >= 0 || localJson.indexOf("[") >= 0)) {
            //解决非json格式的字符串被解析
            localJson = JSON.parse(localJson);
        }
        if (!webJson)
            webJson = '';
        else if (isString(webJson)
            && webJson != "[]"
            && (webJson.indexOf('Online OFF') < 0)
            && (webJson.indexOf('Connection fail') < 0)
            && (localJson.indexOf("{") >= 0 || localJson.indexOf("[") >= 0)) {
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
    if ((typeof childIframe != "undefined") && childIframe != null && typeof (doOk) === "undefined") {
        childIframe.contentWindow.failCallBackForApp(jsonParameters);
        return;
    }
    doError(jsonParameters);
}
