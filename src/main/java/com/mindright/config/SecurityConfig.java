package com.mindright.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Disable CSRF if you're testing with Postman or building an API
                .authorizeHttpRequests()
                .requestMatchers("/login", "/register").permitAll()  // Allow access to login and registration pages without authentication
                .anyRequest().authenticated()  // All other requests require authentication
                .and()
                .formLogin()
                .loginPage("/login")  // Set custom login page URL
                .defaultSuccessUrl("/dashboard", true)  // Redirect to this page upon successful login
                .failureUrl("/login?error=true")  // Redirect to login page with error message on failure
                .permitAll()
                .and()
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .permitAll();

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
