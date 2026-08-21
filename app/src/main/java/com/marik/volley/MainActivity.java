package com.marik.volley;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.ConsoleMessage;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

public final class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            getWindow().setStatusBarColor(Color.rgb(5, 5, 5));
            getWindow().setNavigationBarColor(Color.rgb(5, 5, 5));
            if (android.os.Build.VERSION.SDK_INT >= 23 &&
                    checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.CAMERA}, 1401);
            }

            webView = new WebView(this);
            webView.setBackgroundColor(Color.rgb(5, 5, 5));
            webView.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT));

            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setBuiltInZoomControls(false);
            settings.setDisplayZoomControls(false);

            webView.setWebViewClient(new WebViewClient());
            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    runOnUiThread(() -> {
                        if (android.os.Build.VERSION.SDK_INT < 23 ||
                                checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                            request.grant(request.getResources());
                        } else {
                            request.deny();
                            requestPermissions(new String[]{Manifest.permission.CAMERA}, 1401);
                        }
                    });
                }

                @Override
                public boolean onConsoleMessage(ConsoleMessage message) {
                    android.util.Log.d("VolleyCoach", message.message() + " @" + message.lineNumber());
                    return true;
                }
            });
            setContentView(webView);
            webView.loadUrl("file:///android_asset/index.html");
        } catch (Throwable error) {
            showFatalError(error);
        }
    }

    private void showFatalError(Throwable error) {
        TextView text = new TextView(this);
        text.setTextColor(Color.WHITE);
        text.setBackgroundColor(Color.rgb(5, 5, 5));
        text.setTextSize(16f);
        int p = (int) (24 * getResources().getDisplayMetrics().density);
        text.setPadding(p, p, p, p);
        text.setText("Volley Coach не смог запуститься.\n\n" +
                error.getClass().getSimpleName() + ": " + error.getMessage());
        setContentView(text);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            webView.evaluateJavascript("if(window.onAppPause){window.onAppPause()}", null);
            webView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
        }
        super.onDestroy();
    }
}
