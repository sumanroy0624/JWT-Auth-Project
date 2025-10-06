package com.authify.filters;

import com.authify.service.AppUserDetailsService;
import com.authify.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final AppUserDetailsService userDetailsService;
    private static final List<String> PUBLIC_URLS=List.of("/login","/register","/send-reset-otp","/reset-password","/logout");
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path=request.getServletPath();
        String authorizationHeader=request.getHeader("Authorization");


        if(PUBLIC_URLS.contains(path)){
            filterChain.doFilter(request,response);
            return;
        }

        String jwt=null;
        String email=null;
        // 1. Check the authorization header
        if(authorizationHeader!=null && authorizationHeader.startsWith("Bearer ")){
            jwt=authorizationHeader.substring(7);

        }
        // 2. Check in the cookies
        if(jwt==null){
            Cookie[] cookies=request.getCookies();

            if(cookies!=null){
                for(Cookie cookie:cookies){
                    if(cookie.getName().equals("jwt")){
                        jwt=cookie.getValue();
                        break;
                    }
                }
            }
        }

        // 3. Validate the token and set the security context
        if(jwt!=null){
            email=jwtUtils.getEmailFromToken(jwt);
            if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null){
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                if(jwtUtils.validateToken(jwt,userDetails)){
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken=
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                   null,
                                   userDetails.getAuthorities()
                            );
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }
        }

        System.out.println(SecurityContextHolder.getContext().getAuthentication());

        filterChain.doFilter(request,response);
    }
}
