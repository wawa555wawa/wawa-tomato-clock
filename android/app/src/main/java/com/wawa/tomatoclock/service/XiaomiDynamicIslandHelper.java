package com.wawa.tomatoclock.service;

import android.os.Bundle;
import androidx.core.app.NotificationCompat;

public final class XiaomiDynamicIslandHelper {

    private static final String EXTRA_MIUI_DYNAMIC_ISLAND = "miui.notification.dynamicIslandEnabled";
    private static final String EXTRA_MIUI_SUPPORT_DYNAMIC = "miui.notification.isSupportDynamicIsland";
    private static final String EXTRA_MIUI_DYNAMIC_LEVEL = "miui.notification.level";
    private static final String EXTRA_MIUI_MESSAGE_COUNT = "miui.maml.messageCount";
    private static final String EXTRA_MIUI_SHOW_ACTION = "miui.expandableNotificationStyle";

    private XiaomiDynamicIslandHelper() {
    }

    public static void applyDynamicIslandExtras(
            NotificationCompat.Builder builder,
            String title,
            String timeText) {

        Bundle extras = new Bundle();
        extras.putBoolean(EXTRA_MIUI_DYNAMIC_ISLAND, true);
        extras.putBoolean(EXTRA_MIUI_SUPPORT_DYNAMIC, true);
        extras.putInt(EXTRA_MIUI_DYNAMIC_LEVEL, 2);
        extras.putInt(EXTRA_MIUI_MESSAGE_COUNT, 1);
        extras.putString(EXTRA_MIUI_SHOW_ACTION, "bigtext");
        extras.putString("android.title", title);
        extras.putString("android.text", timeText);

        builder.setStyle(new NotificationCompat.BigTextStyle()
                .bigText(title + "\n剩余时间: " + timeText)
                .setSummaryText("番茄钟运行中"));

        builder.getExtras().putAll(extras);
    }
}
