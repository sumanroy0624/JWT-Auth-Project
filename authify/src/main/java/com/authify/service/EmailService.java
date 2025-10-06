package com.authify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
  private final JavaMailSender mailSender;
  @Value("${spring.mail.properties.mail.smtp.from}")
  private String fromEmail;

  public void sendWelcomeEmail(String toEmail, String name){
    System.out.println(fromEmail);
    System.out.println(toEmail);

    SimpleMailMessage message= new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(toEmail);
    message.setSubject("Welcome to our platform");
    message.setText("Hello "+ name +",\n\n Thanks for registering with us ! \n\n Regards, \nAuthify Team");
    mailSender.send(message);

  }

  public void sendResetOtpEmail(String toEmail,String otp){
     SimpleMailMessage message=new SimpleMailMessage();
     message.setFrom(fromEmail);
     message.setTo(toEmail);
     message.setSubject("Password Reset OTP");
     message.setText("Your OTP for resetting your password is "+ otp+". Use this otp to proceed with resetting your password.  \n\n Regards, \n\nAuthify Team");

     mailSender.send(message);
  }

  public void sendVerifyOtp(String toEmail, String otp){
      SimpleMailMessage message=new SimpleMailMessage();
      message.setFrom(fromEmail);
      message.setTo(toEmail);
      message.setSubject("Account Verification OTP");
      message.setText("Your OTP is "+otp+". Verify your account using this OTP. \n\n Regards, \n\nAuthify Team");
      mailSender.send(message);
  }
}
