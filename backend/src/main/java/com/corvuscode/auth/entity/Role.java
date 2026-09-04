package com.corvuscode.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "roles")
public class Role {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @NotBlank
        @Column(nullable = false, unique = true, length = 50)
        private String name;

        @ManyToMany(mappedBy = "roles")
        private Set<User> users = new HashSet<>();

        public Role(String name) {
                this.name = name;
        }
}