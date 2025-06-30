package com.example.backend.Controller;

import com.example.backend.DTO.NewsDTO;
import com.example.backend.Entity.Attachment;
import com.example.backend.Entity.News;
import com.example.backend.Repository.AttachmentRepo;
import com.example.backend.Repository.NewsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsRepo newsRepo;
    private final AttachmentRepo attachmentRepo;


    @GetMapping
    public HttpEntity<?> getAllNews() {
        List<News> newsList = newsRepo.findAll();
        return ResponseEntity.ok(newsList);
    }


    @PostMapping
    public HttpEntity<?> addNews(@RequestBody NewsDTO newsDTO) {
        System.out.println(newsDTO);
        Attachment attachment = null;
        if (newsDTO.getMainPhoto() != null) {
            Optional<Attachment> byId = attachmentRepo.findById(newsDTO.getMainPhoto());
            if (byId.isPresent()) {
                attachment = byId.get();
            } else {
                return ResponseEntity.notFound().build();
            }
        }
        List<Attachment> attachments = new ArrayList<>();
        if (newsDTO.getPhotos().size() != 0) {
            for (UUID photoId : newsDTO.getPhotos()) {
                Optional<Attachment> byId = attachmentRepo.findById(photoId);
                attachments.add(byId.get());
            }
        }
        News newsEntity = new News(newsDTO.getTitleUz(), newsDTO.getTitleRu(), newsDTO.getDescriptionUz(), newsDTO.getDescriptionRu(), newsDTO.getLink(), attachment, attachments);
        newsRepo.save(newsEntity);
        return ResponseEntity.ok(newsEntity);
    }


    @DeleteMapping("/{id}")
    public HttpEntity<?> deleteNews(@PathVariable Integer id) {
        newsRepo.deleteById(id);
        return ResponseEntity.ok("News deleted successfully");
    }


    @GetMapping("/{id}")
    public HttpEntity<?> getNewsById(@PathVariable Integer id) {
        Optional<News> newsEntity = newsRepo.findById(id);
        if (newsEntity.isPresent()) {
            return ResponseEntity.ok(newsEntity.get());
        }
        return ResponseEntity.notFound().build();
    }


}
