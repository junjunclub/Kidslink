package com.ssafy.kidslink.common.fcm;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

// 제대로 동작하면, 후에 컨트롤러 위치 변경
@RestController
@RequestMapping("/api/notify")
@RequiredArgsConstructor
@Slf4j
public class FcmNotificationController {

    private static final String FCM_URL = "https://fcm.googleapis.com/fcm/send";
    private static final String FCM_SERVER_KEY = "YOUR_SERVER_KEY";

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

    @Autowired
    private RestTemplate restTemplate;

    public void sendNotification(String teacherUsername, String title, String body) {
        String teacherToken = fcmTokenRepository.findTokenByUsername(teacherUsername);
        if (teacherToken != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "key=" + FCM_SERVER_KEY);
            headers.set("Content-Type", "application/json");

            String payload = String.format(
                    "{\"to\": \"%s\", \"notification\": {\"title\": \"%s\", \"body\": \"%s\"}}",
                    teacherToken, title, body
            );

            HttpEntity<String> entity = new HttpEntity<>(payload, headers);
            restTemplate.postForEntity(FCM_URL, entity, String.class);
        } else {
            throw new RuntimeException("FCM token for teacher not found");
        }
    }
}