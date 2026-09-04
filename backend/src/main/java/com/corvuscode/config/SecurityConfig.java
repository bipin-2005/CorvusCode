package com.corvuscode.config;

import com.corvuscode.security.CustomUserDetailsService;
import com.corvuscode.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

       return http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
               .authorizeHttpRequests(auth -> auth

                       .requestMatchers("/api/auth/**")
                       .permitAll()

                       /*
                        * Public certificate verification.
                        * Anyone with a verification code can verify
                        * a CorvusCode certificate.
                        */
                       .requestMatchers(
                               "/api/certificates/verify/**"
                       )
                       .permitAll()

                       /*
                        * Admin APIs.
                        */
                       .requestMatchers("/api/admin/**")
                       .hasRole("ADMIN")

                       /*
                        * Public problem APIs.
                        */
                       .requestMatchers(
                               HttpMethod.GET,
                               "/api/problems/**"
                       )
                       .permitAll()

                       /*
                        * Admin-only resources.
                        */
                       .requestMatchers(
                               "/api/test-cases/**",
                               "/api/starter-codes/**"
                       )
                       .hasRole("ADMIN")

                       /*
                        * Everything else requires authentication.
                        */
                       .anyRequest()
                       .authenticated()
               )
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        )
        .build();
    }

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService userDetailsService) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOrigins(List.of("http://localhost:5173"));
    configuration.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
    ));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", configuration);

    return source;
}
}