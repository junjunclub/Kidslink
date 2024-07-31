package com.ssafy.kidslink.common.fcm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FcmNotificationService {
    private static final String FCM_URL = "https://fcm.googleapis.com/fcm/send";
    private static final String FCM_SERVER_KEY = "YOUR_SERVER_KEY";

    @Autowired
    private FcmTokenService fcmTokenService;

    @Autowired
    private RestTemplate restTemplate;

    public void sendNotification(String teacherUsername, String title, String body) {
        String teacherToken = fcmTokenService.getTokenByUserId(teacherUsername);
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