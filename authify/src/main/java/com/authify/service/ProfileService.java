package com.authify.service;

import com.authify.io.ProfileRequest;
import com.authify.io.ProfileResponse;

public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest request);
    ProfileResponse getProfile(String email);
    void sendResetOtp(String email);
    void resetPassword(String email,String otp, String newPassword);
    void sendOtp(String email);
    void verifyOtp(String email, String otp);

}
