package com.authify.controllers;

import com.authify.io.AuthRequest;
import com.authify.io.AuthResponse;
import com.authify.io.ResetPasswordRequest;
import com.authify.service.AppUserDetailsService;
import com.authify.service.ProfileService;
import com.authify.utils.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
//@RequestMapping("/api/v1.0")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;
    private final ProfileService profileService;
    @PostMapping("/login")
    public ResponseEntity<?>login(@RequestBody AuthRequest request){
       try{
           authenticate(request.getEmail(),request.getPassword());
           final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
           final String jwtToken=jwtUtils.generateToken(userDetails);

           ResponseCookie cookie=ResponseCookie.from("jwt",jwtToken)
                   .httpOnly(true)
                   .path("/")
                   .maxAge(Duration.ofDays(1))
                   .sameSite("Strict")
                   .build();

           return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,cookie.toString())
                   .body(new AuthResponse(request.getEmail(),jwtToken));
       } catch (BadCredentialsException e) {
           Map<String,Object> error=new HashMap<>();

           return new ResponseEntity<>("Email or password is incorrect",HttpStatus.BAD_REQUEST);

       }catch (DisabledException e){

           return new ResponseEntity<>("Account is disabled",HttpStatus.UNAUTHORIZED);

       }catch (Exception e){

           return new ResponseEntity<>("Authorization is failed",HttpStatus.UNAUTHORIZED);
       }
    }

    private void authenticate(String email, String password) {
       authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email,password));

    }


    @GetMapping("/is-authenticated")
    public ResponseEntity<?> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name")String email){
        return ResponseEntity.ok(email!=null);
    }

    @PostMapping("/send-reset-otp")
    public ResponseEntity<?> sendResetOtp(@RequestParam String email){
      try{
         profileService.sendResetOtp(email);    
      } catch (Exception e) {
         return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return ResponseEntity.ok("Sent otp successfully...");
    }
    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        try{
            profileService.resetPassword(request.getEmail(), request.getOtp(),request.getNewPassword());
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage());
        }
    }
    @PostMapping("/send-otp")
    public void sendVerifyOtp(@CurrentSecurityContext(expression = "authentication?.name")String email){
        try{
           profileService.sendOtp(email);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,e.getMessage());
        }
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String,Object>request,
                            @CurrentSecurityContext(expression = "authentication?.name") String email){


        if(request.get("otp").toString()==null){
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Missing details");
        }

        try{
          profileService.verifyOtp(email,request.get("otp").toString());
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok("Otp Verification Successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){
        ResponseCookie cookie=ResponseCookie.from("jwt","xcz")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,cookie.toString())
                .body("Logged out successfully");
    }

}
