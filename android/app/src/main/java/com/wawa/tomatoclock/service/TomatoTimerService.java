package com.wawa.tomatoclock.service;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

public class TomatoTimerService extends Service {

    public static final String CHANNEL_ID = "tomato_timer_channel";
    public static final int NOTIFICATION_ID = 1001;
    public static final String ACTION_START = "com.wawa.tomatoclock.START_TIMER";
    public static final String ACTION_PAUSE = "com.wawa.tomatoclock.PAUSE_TIMER";
    public static final String ACTION_STOP = "com.wawa.tomatoclock.STOP_TIMER";
    public static final String EXTRA_TITLE = "timer_title";
    public static final String EXTRA_TIME = "timer_time_ms";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String title = "番茄钟";
        long totalMs = 25 * 60 * 1000L;

        if (intent != null) {
            String intentTitle = intent.getStringExtra(EXTRA_TITLE);
            if (intentTitle != null) {
                title = intentTitle;
            }
            totalMs = intent.getLongExtra(EXTRA_TIME, 25 * 60 * 1000L);
        }

        Notification notification = buildNotification(title, formatTime(totalMs));
        startForeground(NOTIFICATION_ID, notification);

        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public void updateNotification(String title, long remainingMs, boolean isRunning) {
        Notification notification = buildNotification(title, formatTime(remainingMs), isRunning);
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        manager.notify(NOTIFICATION_ID, notification);
    }

    private Notification buildNotification(String title, String timeText) {
        return buildNotification(title, timeText, true);
    }

    private Notification buildNotification(String title, String timeText, boolean isRunning) {
        String contentText = isRunning ? "剩余: " + timeText : "已暂停: " + timeText;

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_popup_reminder)
                .setContentTitle(title)
                .setContentText(contentText)
                .setOngoing(isRunning)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setShowWhen(false)
                .setColor(Color.parseColor("#E84A3F"))
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .addAction(0, "暂停", null)
                .addAction(0, "停止", null);

        XiaomiDynamicIslandHelper.applyDynamicIslandExtras(builder, title, timeText);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            builder.setForegroundServiceBehavior(Notification.FOREGROUND_SERVICE_IMMEDIATE);
        }

        return builder.build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "番茄钟计时",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("番茄钟运行状态");
            channel.setShowBadge(true);
            channel.enableLights(true);
            channel.setLightColor(Color.parseColor("#E84A3F"));
            channel.enableVibration(false);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

            NotificationManager manager = (NotificationManager) getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }

    private String formatTime(long ms) {
        long totalSec = ms / 1000;
        long min = totalSec / 60;
        long sec = totalSec % 60;
        return String.format("%02d:%02d", min, sec);
    }
}
