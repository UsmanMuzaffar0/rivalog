package com.iwa.rivalog;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

import com.google.gson.JsonObject;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ForegroundServiceAndroid extends Service implements LocationListener {

    boolean isGPSEnabled = false;
    boolean isNetworkEnabled = false;
    boolean isGPSTrackingEnabled = false;
    private Location location;
    double latitude;
    double longitude;

    // The minimum distance to change updates in meters
    private static final long MIN_DISTANCE_CHANGE_FOR_UPDATES = 10; // 10 meters

    // The minimum time between updates in milliseconds
    private static final long MIN_TIME_BW_UPDATES = 1000 * 10 * 1; // 1 minute

    // Declaring a Location Manager
    private LocationManager locationManager;

    private APIInterface apiInterface;
    private Handler handler;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("MyTime", "" + Integer.parseInt(getFromUserDefaults(this, "time")));
        showData(Integer.parseInt(getFromUserDefaults(this, "time")));
        return START_STICKY;
    }

    public static String getFromUserDefaults(Context context, String key) {
        if (context == null) {
            return "";
        }
        SharedPreferences preferences = context.getSharedPreferences(
                "LocationApi", Context.MODE_PRIVATE);
        return preferences.getString(key, "");
    }

    public static String getFromUserToken(Context context, String key) {
        if (context == null) {
            return "";
        }
        SharedPreferences preferences = context.getSharedPreferences("LocationApi", Context.MODE_PRIVATE);
        return preferences.getString(key, "");
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopSelf();
        handler.removeCallbacksAndMessages(null);
    }

    private void showData(int interval) {
        //addNotification("br","AR");
        handler = new Handler(Looper.getMainLooper());
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                //addNotification();
                getLocationData();
                showData(interval);
            }
        }, interval);
    }

    private Location getLocationData() {
        try {
            locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
            // get GPS status
            isGPSEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);

            // get network provider status
            isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

            if (!isGPSEnabled && !isNetworkEnabled) {
                Toast.makeText(ForegroundServiceAndroid.this, "GPS Service disable", Toast.LENGTH_SHORT).show();
                //showSettingsAlert();
            } else {
                this.isGPSTrackingEnabled = true;
                // if GPS Enabled get lat/long using GPS Services
                if (isGPSEnabled) {
                    if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    }
                    locationManager.requestLocationUpdates(
                            LocationManager.GPS_PROVIDER,
                            MIN_TIME_BW_UPDATES,
                            MIN_DISTANCE_CHANGE_FOR_UPDATES, this);
                    if (locationManager != null) {
                        List<String> providers = locationManager.getProviders(true);
                        Location bestLocation = null;
                        for (String provider : providers) {
                            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                            }
                            location = locationManager.getLastKnownLocation(provider);
                            if (location == null) {
                                continue;
                            }
                            if (bestLocation == null || location.getAccuracy() < bestLocation.getAccuracy()) {
                                // Found best last known location: %s", l);
                                bestLocation = location;
                            }
                        }
                        //location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                        if (location != null) {
                            saveLatitude(this, "Latitude", String.valueOf(location.getLatitude()));
                            saveLongitude(this, "Longitude", String.valueOf(location.getLongitude()));
                            /*latitude = location.getLatitude();
                            longitude = location.getLongitude();
                            callApi(latitude, longitude);*/
                            callApi();
                        }
                    }
                } else {
//                    Toast.makeText(ForegroundServiceAndroid.this, "Please on GPS Service", Toast.LENGTH_SHORT).show();
                    Log.d("Foreground", " :: Please on GPS Service");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return location;

    }

    public static void saveLongitude(Context context, String key, String value) {
        if (context == null) {
            return;
        }
        SharedPreferences preferences = context.getSharedPreferences("LocationApi", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(key, value);
        editor.apply();
    }

    public static String getLongitude(Context context, String key) {
        if (context == null) {
            return "";
        }
        SharedPreferences preferences = context.getSharedPreferences(
                "LocationApi", Context.MODE_PRIVATE);
        return preferences.getString(key, "");
    }

    public static void saveLatitude(Context context, String key, String value) {
        if (context == null) {
            return;
        }
        SharedPreferences preferences = context.getSharedPreferences("LocationApi", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.putString(key, value);
        editor.apply();
    }

    public static String getLatitude(Context context, String key) {
        if (context == null) {
            return "";
        }
        SharedPreferences preferences = context.getSharedPreferences(
                "LocationApi", Context.MODE_PRIVATE);
        return preferences.getString(key, "");
    }

    private void callApi() {
        JsonData jsonData = new JsonData();
        jsonData.latitude = getLatitude(getApplicationContext(),"Latitude");
        jsonData.longitude = getLongitude(getApplicationContext(),"Longitude");
        String accessToken = "Bearer " + getFromUserToken(this, "token");

        apiInterface = APIClient.getClient().create(APIInterface.class);
        Call<JsonObject> call = apiInterface.postLocationData(accessToken, jsonData);
        call.enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
//                addNotification(jsonData.latitude, jsonData.longitude);
                Log.d("LocationData", "ApiCall success" + response.message());
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Log.d("LocationData", "ApiCall" + t.getLocalizedMessage());
            }
        });
    }

    @Override
    public void onLocationChanged(Location location) {
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
    }

    @Override
    public void onProviderEnabled(String provider) {
    }

    @Override
    public void onProviderDisabled(String provider) {
    }

    private void addNotification(String latitude, String longitude) {
        String channelId = "channelId";
        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle("RiverlogApp")
                        .setContentText(" Lat " + latitude + " Long " + longitude)
                        .setAutoCancel(true)
                        .setPriority(Notification.PRIORITY_HIGH);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        // Since android Oreo notification channel is needed.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId,
                    "Channel human readable title",
                    NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }

}