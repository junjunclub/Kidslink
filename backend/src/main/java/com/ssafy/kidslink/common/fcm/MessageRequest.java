package com.ssafy.kidslink.common.fcm;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    private String teacherUsername;
    private String title;
    private String body;

    // Getters and Setters
}