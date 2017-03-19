package com.ryzhang.net;

import android.util.Log;
import android.webkit.JavascriptInterface;

public class InterfaceHelp {
	@JavascriptInterface
	public void log(String webLog) {
		Log.d("ryzhang", "Interface:"+webLog);
	}
	@JavascriptInterface
	public void GetDeviceInfo(){
		
	}
}
