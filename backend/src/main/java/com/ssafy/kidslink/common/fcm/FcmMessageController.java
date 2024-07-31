package com.ssafy.kidslink.common.fcm;

import com.ssafy.kidslink.application.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FcmMessageController {

    @Autowired
    private FcmNotificationService notificationService;

    @PostMapping("/send-message")
    public ResponseEntity<Void> sendMessage(@RequestBody MessageRequest request) {
        notificationService.sendNotification(request.getTeacherUsername(), request.getTitle(), request.getBody());
        return ResponseEntity.ok().build();
    }
}