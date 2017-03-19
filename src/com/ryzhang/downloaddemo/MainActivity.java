package com.ryzhang.downloaddemo;

import com.ryzhang.net.InterfaceHelp;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

public class MainActivity extends Activity {
	WebView webView;

	@SuppressLint("SetJavaScriptEnabled")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
//		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.activity_main);
		webView = (WebView) findViewById(R.id.web);
		webView.getSettings().setJavaScriptEnabled(true);
		webView.getSettings().setLoadWithOverviewMode(true);// 启动全屏
		webView.addJavascriptInterface(new InterfaceHelp(), "InterfaceHelp");
		webView.setWebChromeClient(new WebChromeClient() {
			public void onConsoleMessage(String message, int lineNumber, String sourceID) {
				Log.d("ryzhang", "console:" + message+"    lineNumber:"+lineNumber);
			}
		});
		webView.loadUrl("file:///android_asset/ife/React.html");
//		webView.loadUrl("file:///android_asset/ife/layout.html");
//		webView.loadUrl("file:///android_asset/ife/JQueryMobile.html");

	}
}
