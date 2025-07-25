package com.example.backend.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "attachment")

public class Attachment {
    @Id
    private UUID id;
    private String prefix;
    private String name;
    public static Attachment createAttachment(MultipartFile photo, String prefix) throws IOException {
        Attachment attachment = null;
        if (photo != null && !photo.isEmpty()) {
            UUID id = UUID.randomUUID();
            String fileName = id + "_" + photo.getOriginalFilename();
            String filePath = "backend/files" + prefix + "/" + fileName;
            File file = new File(filePath);
            file.getParentFile().mkdirs();
            try (OutputStream outputStream = new FileOutputStream(file)) {
                FileCopyUtils.copy(photo.getInputStream(), outputStream);
            }
            attachment = new Attachment(id, prefix, fileName);
        }
        return attachment;
    }
}
