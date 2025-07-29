package com.example.contactbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing 
public class ContactBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(ContactBackendApplication.class, args);
    }
}