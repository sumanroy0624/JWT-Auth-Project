package com.authify.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    public String generateToken(UserDetails userDetails){
        Map<String,Object> claims=new HashMap<>();
       return createToken(claims,userDetails.getUsername());

    }

    private String createToken(Map<String, Object> claims, String username) {
       return Jwts.builder()
               .subject(username)
               .issuedAt(new Date(System.currentTimeMillis()))
               .expiration(new Date(System.currentTimeMillis()+1000*60*60*10))
               .claims(claims)
               .signWith((SecretKey)getKey())
               .compact();
    }

    private Claims getClaims(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

    }

    public <T> T extractClaim(String token, Function<Claims,T>claimsResolver){
       final Claims claims=getClaims(token);
       return claimsResolver.apply(claims);
    }

    public String getEmailFromToken(String email){
        return getClaims(email).getSubject();
    }

    public Boolean isTokenExpired(String token){
        return getClaims(token)
                .getExpiration()
                .before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails){
        final String email=getEmailFromToken(token);
        return email.equals(userDetails.getUsername()) && (!isTokenExpired(token));
    }

    private Object getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(SECRET_KEY));
    }




}
