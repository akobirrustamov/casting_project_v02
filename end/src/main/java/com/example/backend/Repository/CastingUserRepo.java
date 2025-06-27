package com.example.backend.Repository;

import com.example.backend.Entity.CastingUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CastingUserRepo extends JpaRepository<CastingUser,Integer> {

    @Query(value = "SELECT * FROM casting_user where telegram_id=:telegramId", nativeQuery = true)
    List<CastingUser> findByTelegramId(String telegramId);
}
