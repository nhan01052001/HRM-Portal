// BadgeModule.java
package com.hrmeportal;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import me.leolin.shortcutbadger.ShortcutBadger;

public class BadgeModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public BadgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "BadgeModule";
    }

    @ReactMethod
    public void setBadgeCount(int count) {
        ShortcutBadger.applyCount(reactContext, count);
        sendBadgeCountEvent(count);
        // Use the ShortcutBadger library to set the badge count for non-Xiaomi devices
        // if (!isXiaomiDevice()) {
            // ShortcutBadger.applyCount(reactContext, count);
            // sendBadgeCountEvent(count);
        // } else {
        //     //For Xiaomi devices, update the notification with the badge count
        //     showNotification(count);
        //     sendBadgeCountEvent(count);
        // }
    }

    private void sendBadgeCountEvent(int count) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onBadgeCountChange", count);
    }

    private boolean isXiaomiDevice() {
        // Check if the device is a Xiaomi device
        String manufacturer = Build.MANUFACTURER;
        return "Xiaomi".equalsIgnoreCase(manufacturer);
    }

    private void showNotification(int count) {
        // Create a notification channel (required for API 26 and above)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel("badge_channel_Xiaomi", "Badge Channel Xiaomi", NotificationManager.IMPORTANCE_DEFAULT);
            NotificationManager notificationManager = reactContext.getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(reactContext, "badge_channel_Xiaomi")
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle("Test Notification")
                .setContentText("content text" + count)
                .setNumber(count)
                .setPriority(NotificationCompat.PRIORITY_HIGH); // Set high priority

        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(reactContext);
        notificationManagerCompat.notify(1, builder.build());

        // Update the notification with the badge count
        Notification updatedNotification = builder.setNumber(count).build();
        ShortcutBadger.applyNotification(reactContext, updatedNotification, count);
    }
}
