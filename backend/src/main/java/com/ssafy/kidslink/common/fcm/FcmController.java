package com.ssafy.kidslink.common.fcm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class FcmController {
    @Autowired
    private FcmTokenService fcmTokenService;

    @PostMapping("/save-token")
    public ResponseEntity<Void> saveToken(@RequestBody FcmTokenRequest request) {
        // FCM 토큰과 사용자 ID를 데이터베이스에 저장
        fcmTokenService.saveToken(request.getUserId(), request.getToken());
        return ResponseEntity.ok().build();
    }
}
