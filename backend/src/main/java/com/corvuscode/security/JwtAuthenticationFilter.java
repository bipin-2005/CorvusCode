package com.corvuscode.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = authHeader.substring(7);

        try {

            String userEmail = jwtService.extractUsername(jwt);

            System.out.println("JWT USERNAME: " + userEmail);

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(userEmail);

            System.out.println("USER FOUND: " + userDetails.getUsername());

            boolean valid = jwtService.isTokenValid(jwt, userDetails);

            System.out.println("JWT VALID: " + valid);

            if (valid) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authToken);

                System.out.println(
                        "AUTHENTICATED: " +
                                SecurityContextHolder.getContext()
                                        .getAuthentication()
                                        .getName()
                );
            }

        } catch (UsernameNotFoundException | JwtException ex) {

            System.out.println(
                    "JWT AUTHENTICATION FAILED: " +
                            ex.getClass().getSimpleName() +
                            " - " +
                            ex.getMessage()
            );
        }

        filterChain.doFilter(request, response);
    }


}