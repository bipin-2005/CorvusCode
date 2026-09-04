package com.corvuscode.judgeservice.executor;

import com.corvuscode.judgeservice.dto.ProcessResult;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.concurrent.TimeUnit;

@Component
public class ProcessRunner {

    public ProcessResult run(ProcessBuilder processBuilder, String stdin)
            throws IOException, InterruptedException {

        long start = System.currentTimeMillis();

        Process process = processBuilder.start();

        if (stdin != null && !stdin.isBlank()) {
            process.getOutputStream().write(stdin.getBytes());
        }

        process.getOutputStream().flush();
        process.getOutputStream().close();

        StringBuilder stdout = new StringBuilder();
        StringBuilder stderr = new StringBuilder();

        Thread outThread = new Thread(() -> {
            try {
                stdout.append(read(process.getInputStream()));
            } catch (IOException ignored) {}
        });

        Thread errThread = new Thread(() -> {
            try {
                stderr.append(read(process.getErrorStream()));
            } catch (IOException ignored) {}
        });

        outThread.start();
        errThread.start();

        boolean finished = process.waitFor(5, TimeUnit.SECONDS);

        if (!finished) {

            process.destroyForcibly();

            outThread.join();
            errThread.join();

            return ProcessResult.builder()
                    .stdout("")
                    .stderr("Time Limit Exceeded")
                    .exitCode(124)
                    .executionTime(5000)
                    .build();
        }

        outThread.join();
        errThread.join();

        return ProcessResult.builder()
                .stdout(stdout.toString())
                .stderr(stderr.toString())
                .exitCode(process.exitValue())
                .executionTime(System.currentTimeMillis() - start)
                .build();
    }

    private String read(InputStream stream) throws IOException {

        BufferedReader reader =
                new BufferedReader(new InputStreamReader(stream));

        StringBuilder builder = new StringBuilder();

        String line;

        while ((line = reader.readLine()) != null) {
            builder.append(line)
                    .append(System.lineSeparator());
        }

        return builder.toString();
    }
}