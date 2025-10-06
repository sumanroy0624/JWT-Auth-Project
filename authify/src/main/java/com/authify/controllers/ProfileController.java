package com.authify.controllers;

import com.authify.io.ProfileRequest;
import com.authify.io.ProfileResponse;
import com.authify.service.EmailService;
import com.authify.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final EmailService emailService;
    private final ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody ProfileRequest request){
        try{
            ProfileResponse response=profileService.createProfile(request);
            emailService.sendWelcomeEmail(response.getEmail(),response.getName());
            return new ResponseEntity<>(response,HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>("Email already exist",HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name")String email){
        return profileService.getProfile(email);
    }
}
