package com.email.writer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

 

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final String apiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder,
                                 @Value("${gemini.api.url}") String baseUrl,
                                 @Value("${gemini.api.key}") String geminiApiKey) {

        this.apiKey = geminiApiKey;
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    public Mono<String> generateEmailReply(EmailRequest emailRequest) {

        //Build Prompt
        String prompt = buildPrompt(emailRequest);

        //Prepare  a raw JSON Body
        String requestBody = String.format("""
                {
                     "contents": [
                       {
                         "parts": [
                           {
                             "text": "%s"
                           }
                         ]
                       }
                     ]
                   }
            """, prompt);

        //Send Request
        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/gemini-3-flash-preview:generateContent")
                        .build())
                .header("x-goog-api-key",apiKey)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(this::extractResponseContent);

    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

             return root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Generate a professional email reply for the following email. consider my name is Atharv Wavare,my phone number is 8530706426\n");

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Tone: ")
                    .append(emailRequest.getTone())
                    .append(".\n");
        }

        if (emailRequest.getTargetAudience() != null && !emailRequest.getTargetAudience().isEmpty()) {
            prompt.append("Target Audience: ")
                    .append(emailRequest.getTargetAudience())
                    .append(".\n");
        }

        if (emailRequest.getPurpose() != null && !emailRequest.getPurpose().isEmpty()) {
            prompt.append("Purpose of the email: ")
                    .append(emailRequest.getPurpose())
                    .append(".\n");
        }

        prompt.append("\nOriginal Email:\n")
                .append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}

