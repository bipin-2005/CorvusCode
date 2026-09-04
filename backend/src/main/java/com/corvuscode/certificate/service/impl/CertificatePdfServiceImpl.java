package com.corvuscode.certificate.service.impl;

import com.corvuscode.certificate.entity.Certificate;
import com.corvuscode.certificate.enums.CertificateType;
import com.corvuscode.certificate.service.CertificatePdfService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class CertificatePdfServiceImpl
        implements CertificatePdfService {

    private static final String CERTIFICATE_DIRECTORY =
            "uploads/certificates/";

    @Override
    public String generateCertificatePdf(
            Certificate certificate
    ) throws IOException {

        File directory =
                new File(CERTIFICATE_DIRECTORY);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName =
                certificate.getCertificateNumber()
                        + ".pdf";

        String filePath =
                CERTIFICATE_DIRECTORY
                        + fileName;

        Document document =
                new Document(
                        PageSize.A4.rotate()
                );

        try {

            PdfWriter.getInstance(
                    document,
                    new FileOutputStream(filePath)
            );

            document.open();

            addCertificateContent(
                    document,
                    certificate
            );

        } finally {

            document.close();
        }

        return filePath;
    }


    private void addCertificateContent(
            Document document,
            Certificate certificate
    ) throws DocumentException {

        /*
         * CorvusCode heading
         */
        Font brandFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        28
                );

        Paragraph brand =
                new Paragraph(
                        "CORVUSCODE",
                        brandFont
                );

        brand.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(brand);


        /*
         * Certificate heading
         */
        Font titleFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        32
                );

        Paragraph title =
                new Paragraph(
                        "CERTIFICATE",
                        titleFont
                );

        title.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(title);


        /*
         * Achievement type
         */
        Font typeFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        20
                );

        Paragraph type =
                new Paragraph(
                        getCertificateTitle(
                                certificate.getType()
                        ),
                        typeFont
                );

        type.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(type);


        document.add(
                new Paragraph(" ")
        );


        /*
         * Presented to
         */
        Font normalFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        16
                );

        Paragraph presentedTo =
                new Paragraph(
                        "This certificate is proudly presented to",
                        normalFont
                );

        presentedTo.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(presentedTo);


        /*
         * Participant name
         */
        Font nameFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        30
                );

        Paragraph name =
                new Paragraph(
                        certificate
                                .getUser()
                                .getFullName(),
                        nameFont
                );

        name.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(name);


        /*
         * Contest information
         */
        Paragraph contest =
                new Paragraph(
                        "for participating in " +
                                certificate
                                        .getContest()
                                        .getTitle(),
                        normalFont
                );

        contest.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(contest);


        /*
         * Rank information
         */
        if (certificate.getRank() != null) {

            Paragraph rank =
                    new Paragraph(
                            "Achievement: " +
                                    getRankText(
                                            certificate
                                                    .getRank()
                                    ),
                            typeFont
                    );

            rank.setAlignment(
                    Element.ALIGN_CENTER
            );

            document.add(rank);
        }


        document.add(
                new Paragraph(" ")
        );


        /*
         * Issue date
         */
        String issuedDate =
                certificate
                        .getIssuedAt()
                        .format(
                                DateTimeFormatter
                                        .ofPattern(
                                                "dd MMMM yyyy"
                                        )
                        );

        Paragraph issued =
                new Paragraph(
                        "Issued on: " + issuedDate,
                        normalFont
                );

        issued.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(issued);


        /*
         * Certificate number
         */
        Paragraph certificateNumber =
                new Paragraph(
                        "Certificate ID: " +
                                certificate
                                        .getCertificateNumber(),
                        normalFont
                );

        certificateNumber.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(
                certificateNumber
        );


        /*
         * Verification code
         */
        Paragraph verification =
                new Paragraph(
                        "Verification Code: " +
                                certificate
                                        .getVerificationCode(),
                        normalFont
                );

        verification.setAlignment(
                Element.ALIGN_CENTER
        );

        document.add(
                verification
        );
    }


    private String getCertificateTitle(
            CertificateType type
    ) {

        return switch (type) {

            case FIRST_PLACE ->
                    "1st Place";

            case SECOND_PLACE ->
                    "2nd Place";

            case THIRD_PLACE ->
                    "3rd Place";

            case PARTICIPATION ->
                    "Certificate of Participation";
        };
    }


    private String getRankText(
            Integer rank
    ) {

        return switch (rank) {

            case 1 -> "1st Place";

            case 2 -> "2nd Place";

            case 3 -> "3rd Place";

            default -> rank + "th Place";
        };
    }
}