package com.authify.service;

import com.authify.entity.UserEntity;
import com.authify.io.ProfileRequest;
import com.authify.io.ProfileResponse;
import com.authify.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    @Override
    public ProfileResponse createProfile(ProfileRequest request) {
        UserEntity newProfile=convertToUserEntity(request);
        if(!userRepository.existsByEmail(request.getEmail())){
            userRepository.save(newProfile);
            return convertToProfileResponse(newProfile);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT,"Email Already exists");


    }

    @Override
    public ProfileResponse getProfile(String email) {

        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found "+email));
        return convertToProfileResponse(userEntity);

    }

    @Override
    public void sendResetOtp(String email) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found !!"));

        // TODO : Generate 6 digit otp

        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        //calculate expiration time (current time + 15 minutes in ms)
        long expiryTime = System.currentTimeMillis() + (1000 * 60 * 15);

        // update the profile/user
        userEntity.setResetOtp(otp);
        userEntity.setResetOtpExpireAt(expiryTime);

        //save into the Database

        userRepository.save(userEntity);

        try{
           emailService.sendResetOtpEmail(userEntity.getEmail(),otp);
        }catch (Exception e){
           throw new RuntimeException("Unable to send email");

        }


    }

    private ProfileResponse convertToProfileResponse(UserEntity newProfile) {
       return ProfileResponse.builder()
                .userId(newProfile.getUserId())
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .isAccountVerified(newProfile.getIsAccountVerified())
                .build();
    }

    private UserEntity convertToUserEntity(ProfileRequest request) {

        return UserEntity.builder()
                .email(request.getEmail())
                .name(request.getName())
                .userId(UUID.randomUUID().toString())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAccountVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found :"+email));

        if(userEntity.getResetOtp()==null || !userEntity.getResetOtp().equals(otp)){
            throw new RuntimeException("Invalid otp");
        }

        if(userEntity.getResetOtpExpireAt()<System.currentTimeMillis()){
            throw new RuntimeException("OTP Expired");
        }

        userEntity.setPassword(passwordEncoder.encode(newPassword));
        userEntity.setResetOtp(null);
        userEntity.setResetOtpExpireAt(0L);
        userRepository.save(userEntity);
    }

    @Override
    public void sendOtp(String email) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("user not found !!"));
        if(userEntity.getIsAccountVerified()!=null && userEntity.getIsAccountVerified()){
             return;
        }

        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        //calculate expiration time (current time + 24 hours in ms)
        long expiryTime = System.currentTimeMillis() + (1000 * 60 * 24 * 60);
        //Update the user entity
        userEntity.setVerifyOtp(otp);
        userEntity.setVerifyOtpExpireAt(expiryTime);
        userRepository.save(userEntity);

        try{
          emailService.sendVerifyOtp(userEntity.getEmail(),otp);
        }catch (Exception e){
           throw new RuntimeException("Unable to send email");
        }

    }

    @Override
    public void verifyOtp(String email, String otp) {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found :" + email));

        if(userEntity.getVerifyOtp()==null || !userEntity.getVerifyOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        if(userEntity.getVerifyOtpExpireAt()<System.currentTimeMillis()){
            throw new RuntimeException("OTP Expired");
        }

        userEntity.setIsAccountVerified(true);
        userEntity.setVerifyOtp(null);
        userEntity.setVerifyOtpExpireAt(0L);
        userRepository.save(userEntity);
    }


}
