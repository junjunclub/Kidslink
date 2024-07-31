package com.ssafy.kidslink.common.fcm;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FcmTokenRepository extends JpaRepository<FcmToken, Long> {

    @Query("SELECT f.token FROM FcmToken f WHERE f.userId = :userId")
    String findTokenByUserId(@Param("userId") String userId);

    @Query("SELECT f.token FROM FcmToken f WHERE f.username = :username")
    String findTokenByUsername(@Param("username") String username);
}