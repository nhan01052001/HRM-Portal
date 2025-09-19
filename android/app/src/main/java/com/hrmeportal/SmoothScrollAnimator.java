package com.hrmeportal;

import java.util.TimerTask;

final class SmoothScrollAnimator extends TimerTask {
    private static final float SCROLL_FACTOR = 0.3f; // Điều chỉnh tốc độ animation
    private static final int MIN_DELTA = 1; // Delta tối thiểu để tránh animation quá chậm ở cuối
    private static final int ANIMATION_THRESHOLD = 2; // Ngưỡng để kết thúc animation

    private final LoopView loopView;
    private final int startScrollY;
    private final int targetScrollY;
    private float currentScrollY;

    SmoothScrollAnimator(LoopView loopView, int startScrollY, int targetScrollY) {
        this.loopView = loopView;
        this.startScrollY = startScrollY;
        this.targetScrollY = targetScrollY;
        this.currentScrollY = startScrollY;
    }

    @Override
    public void run() {
        if (Math.abs(currentScrollY - targetScrollY) < ANIMATION_THRESHOLD) {
            // Đã đến đích, dừng animation và thiết lập chính xác vị trí
            loopView.totalScrollY = targetScrollY;
            loopView.cancelFuture();
            loopView.handler.sendEmptyMessage(3000); // Gọi itemSelected
            return;
        }

        // Tính toán delta scroll cho mỗi bước
        float delta = (targetScrollY - currentScrollY) * SCROLL_FACTOR;

        // Đảm bảo delta không quá nhỏ để animation không quá chậm
        if (Math.abs(delta) < MIN_DELTA) {
            delta = delta > 0 ? MIN_DELTA : -MIN_DELTA;
        }

        // Cập nhật vị trí hiện tại
        currentScrollY += delta;
        loopView.totalScrollY = Math.round(currentScrollY);

        // Yêu cầu vẽ lại view
        loopView.handler.sendEmptyMessage(1000);
    }
}