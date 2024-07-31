package com.ssafy.kidslink.common.fcm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FcmTokenService {

    @Autowired
    private FcmTokenRepository fcmTokenRepository;

    public void saveToken(String userId, String token) {
        // 사용자 ID와 FCM 토큰을 저장합니다.
        // 사용자 ID에 따라 데이터베이스에 FCM 토큰을 저장
        fcmTokenRepository.save(new FcmToken(userId, token));
    }

    public String getTokenByUserId(String userId) {
        // 사용자 ID로 FCM 토큰을 조회합니다.
        return fcmTokenRepository.findTokenByUserId(userId);
    }
}
