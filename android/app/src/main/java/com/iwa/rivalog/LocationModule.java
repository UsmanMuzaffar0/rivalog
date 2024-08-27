package com.iwa.rivalog;


import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.work.Constraints;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.iwa.rivalog.mapbox.MapNavigationActivity;

import java.util.concurrent.TimeUnit;

public class LocationModule extends ReactContextBaseJavaModule {

    private Intent intent;

    LocationModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "LocationModule";
    }

    @ReactMethod
    public void createLocationEvent(int interval, String accesstoken) {
        //saveToUserToken(getReactApplicationContext(),"token",accesstoken);

        saveToUserDefaults(getReactApplicationContext(),"time",interval);
        saveToUserToken(getReactApplicationContext(),"token",accesstoken);
        //setUpWorker(interval);
        intent = new Intent(getReactApplicationContext(),ForegroundServiceAndroid.class);
        getReactApplicationContext().startService(intent);
    }

    @ReactMethod
    public void openMapNavigation(String locale, double destinationLat, double destinationLong) {
        intent = new Intent(getReactApplicationContext(), MapNavigationActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("locale", locale);
        intent.putExtra("destinationLat", destinationLat);
        intent.putExtra("destinationLong", destinationLong);
        getReactApplicationContext().startActivity(intent);
    }

    public static void saveToUserDefaults(Context context, String key, int value) {
        if (context == null) {
            return;
        }
        SharedPreferences preferences = context.getSharedPreferences("LocationApi", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(key, String.valueOf(value));
        editor.apply();
    }

    public static void saveToUserToken(Context context, String key, String value) {
        if (context == null) {
            return;
        }
        SharedPreferences preferences = context.getSharedPreferences(
                "LocationApi", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(key, String.valueOf(value));
        editor.apply();
    }

    @ReactMethod
    public void stopService(){
        Log.d( "createLocationEvent: ","Exitttt");

        intent = new Intent(getReactApplicationContext(),ForegroundServiceAndroid.class);

        if (intent!= null){
            getReactApplicationContext().stopService(intent);
        }else {

        }
        //WorkManager.getInstance().cancelAllWorkByTag("worker");
    }

    private void setUpWorker(int interval) {
        Constraints constraints = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(MyWorker.class, interval, TimeUnit.MILLISECONDS)
                .setConstraints(constraints)
                .addTag("worker")
                .build();

        WorkManager.getInstance(getReactApplicationContext()).enqueue(workRequest);
    }

    /*private void checkOptimization() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String packageName = getReactApplicationContext().getPackageName();
            PowerManager pm = (PowerManager) getReactApplicationContext().getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                if (!pm.isIgnoringBatteryOptimizations(packageName)) {
                    Intent intent = new Intent();
                    intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                    intent.setData(Uri.parse("package:" + getReactApplicationContext().getPackageName()));
                    getReactApplicationContext().startActivity(intent);
                }
            }
        }
    }*/

}