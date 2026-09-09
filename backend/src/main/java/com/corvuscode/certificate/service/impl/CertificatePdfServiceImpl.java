package com.corvuscode.certificate.service.impl;

import com.corvuscode.certificate.entity.Certificate;
import com.corvuscode.certificate.enums.CertificateType;
import com.corvuscode.certificate.service.CertificatePdfService;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfGState;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
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

    /*
     * ================================
     * CORVUSCODE COLOR PALETTE
     * ================================
     */

    private static final Color NAVY =
            new Color(12, 35, 58);

    private static final Color DARK_NAVY =
            new Color(7, 25, 43);

    private static final Color GOLD =
            new Color(198, 150, 54);

    private static final Color LIGHT_GOLD =
            new Color(230, 196, 112);

    private static final Color TEXT =
            new Color(35, 52, 70);

    private static final Color LIGHT_TEXT =
            new Color(92, 105, 120);

    private static final Color BACKGROUND =
            new Color(250, 250, 248);

    private static final Color WATERMARK =
            new Color(225, 229, 230);

    private static final Color SHADOW =
            new Color(0, 0, 0);


    /*
     * ================================
     * FONTS
     * ================================
     */

    private static final Font BRAND_FONT =
            FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    22,
                    Font.NORMAL,
                    Color.WHITE
            );

    private static final Font TAGLINE_FONT =
            FontFactory.getFont(
                    FontFactory.HELVETICA,
                    7,
                    Font.NORMAL,
                    LIGHT_GOLD
            );

    private static final Font TITLE_FONT =
            FontFactory.getFont(
                    FontFactory.TIMES_BOLD,
                    38,
                    Font.NORMAL,
                    NAVY
            );

    private static final Font SUBTITLE_FONT =
            FontFactory.getFont(
                    FontFactory.TIMES,
                    17,
                    Font.NORMAL,
                    GOLD
            );

    private static final Font PRESENTED_FONT =
            FontFactory.getFont(
                    FontFactory.HELVETICA,
                    10,
                    Font.NORMAL,
                    LIGHT_TEXT
            );

    private static final Font NAME_FONT =
            FontFactory.getFont(
                    FontFactory.TIMES_ITALIC,
                    33,
                    Font.NORMAL,
                    NAVY
            );

    private static final Font BODY_FONT =
            FontFactory.getFont(
                    FontFactory.HELVETICA,
                    11,
                    Font.NORMAL,
                    LIGHT_TEXT
            );

    private static final Font CONTEST_FONT =
            FontFactory.getFont(
                    FontFactory.TIMES_BOLD,
                    21,
                    Font.NORMAL,
                    NAVY
            );

    private static final Font ACHIEVEMENT_FONT =
            FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    12,
                    Font.NORMAL,
                    GOLD
            );

    private static final Font SMALL_LABEL_FONT =
            FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    7,
                    Font.NORMAL,
                    LIGHT_TEXT
            );

    private static final Font SMALL_VALUE_FONT =
            FontFactory.getFont(
                    FontFactory.HELVETICA,
                    8,
                    Font.NORMAL,
                    TEXT
            );

    private static final Font FOOTER_FONT =
            FontFactory.getFont(
                    FontFactory.HELVETICA,
                    7,
                    Font.NORMAL,
                    NAVY
            );


    @Override
    public String generateCertificatePdf(
            Certificate certificate
    ) throws IOException {

        /*
         * Create certificate directory
         */
        File directory =
                new File(CERTIFICATE_DIRECTORY);

        if (!directory.exists() && !directory.mkdirs()) {
            throw new IOException(
                    "Unable to create certificate directory: "
                            + CERTIFICATE_DIRECTORY
            );
        }


        /*
         * File name
         */
        String fileName =
                certificate.getCertificateNumber()
                        + ".pdf";

        String filePath =
                CERTIFICATE_DIRECTORY
                        + fileName;


        /*
         * A4 Landscape
         */
        Document document =
                new Document(
                        PageSize.A4.rotate(),
                        0,
                        0,
                        0,
                        0
                );


        try {

            PdfWriter writer =
                    PdfWriter.getInstance(
                            document,
                            new FileOutputStream(filePath)
                    );

            document.open();

            PdfContentByte canvas =
                    writer.getDirectContent();


            /*
             * Draw complete certificate design
             */
            drawBackground(
                    canvas,
                    document
            );

            drawCentralEmblem(
                    canvas,
                    document
            );

            drawHeader(
                    canvas,
                    document
            );

            drawTitle(
                    canvas,
                    document
            );

            drawRecipientSection(
                    canvas,
                    document,
                    certificate
            );

            drawAchievementBadge(
                    canvas,
                    certificate
            );

            drawFooterInformation(
                    canvas,
                    document,
                    certificate
            );

            drawDecorativeWatermark(
                    canvas
            );

        } catch (DocumentException e) {

            throw new IOException(
                    "Failed to generate certificate PDF",
                    e
            );

        } finally {

            if (document.isOpen()) {
                document.close();
            }
        }


        return filePath;
    }


    /*
     * ============================================================
     * BACKGROUND
     * ============================================================
     */

    private void drawBackground(
            PdfContentByte canvas,
            Document document
    ) {

        float width =
                PageSize.A4.rotate().getWidth();

        float height =
                PageSize.A4.rotate().getHeight();


        /*
         * Main background
         */
        canvas.setColorFill(BACKGROUND);

        canvas.rectangle(
                0,
                0,
                width,
                height
        );

        canvas.fill();


        /*
         * Top-left dark navy diagonal section
         */
        canvas.setColorFill(DARK_NAVY);

        canvas.moveTo(0, height);
        canvas.lineTo(250, height);
        canvas.lineTo(0, height - 175);
        canvas.lineTo(0, height);
        canvas.fill();


        /*
         * Subtle sunburst rays inside the navy corner wedge,
         * fanning out from the outer corner for extra depth
         */
        drawCornerRays(
                canvas,
                0,
                height,
                0,
                height - 175,
                250,
                height
        );


        /*
         * Gold diagonal line
         */
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(5);

        canvas.moveTo(0, height - 178);
        canvas.lineTo(255, height);

        canvas.stroke();


        /*
         * Thin light-gold accent
         */
        canvas.setColorStroke(LIGHT_GOLD);
        canvas.setLineWidth(1.5f);

        canvas.moveTo(0, height - 188);
        canvas.lineTo(265, height);

        canvas.stroke();


        /*
         * Bottom-right navy diagonal section
         */
        canvas.setColorFill(DARK_NAVY);

        canvas.moveTo(width, 0);
        canvas.lineTo(width - 250, 0);
        canvas.lineTo(width, 175);
        canvas.lineTo(width, 0);

        canvas.fill();


        drawCornerRays(
                canvas,
                width,
                0,
                width - 250,
                0,
                width,
                175
        );


        /*
         * Bottom-right gold diagonal
         */
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(5);

        canvas.moveTo(width, 178);
        canvas.lineTo(width - 255, 0);

        canvas.stroke();


        /*
         * Bottom-right light accent
         */
        canvas.setColorStroke(LIGHT_GOLD);
        canvas.setLineWidth(1.5f);

        canvas.moveTo(width, 188);
        canvas.lineTo(width - 265, 0);

        canvas.stroke();


        /*
         * Outer gold border
         */
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(1.2f);

        canvas.rectangle(
                28,
                28,
                width - 56,
                height - 56
        );

        canvas.stroke();


        /*
         * Inner border
         */
        canvas.setColorStroke(LIGHT_GOLD);
        canvas.setLineWidth(0.5f);

        canvas.rectangle(
                36,
                36,
                width - 72,
                height - 72
        );

        canvas.stroke();


        /*
         * Decorative corner lines
         */
        drawCornerDecoration(
                canvas,
                38,
                38,
                true,
                true
        );

        drawCornerDecoration(
                canvas,
                width - 38,
                38,
                false,
                true
        );

        drawCornerDecoration(
                canvas,
                38,
                height - 38,
                true,
                false
        );

        drawCornerDecoration(
                canvas,
                width - 38,
                height - 38,
                false,
                false
        );
    }


    /*
     * Thin fan of gold rays inside a corner wedge, clipped loosely
     * by only drawing short strokes near the corner apex — adds
     * texture to the flat navy triangles without needing a
     * clipping path.
     */
    private void drawCornerRays(
            PdfContentByte canvas,
            float apexX,
            float apexY,
            float armX,
            float armY,
            float tipX,
            float tipY
    ) {

        canvas.setColorStroke(LIGHT_GOLD);
        canvas.setLineWidth(0.4f);

        PdfGState faint = new PdfGState();
        faint.setStrokeOpacity(0.35f);
        canvas.setGState(faint);

        int rays = 6;

        for (int i = 1; i < rays; i++) {

            float t = i / (float) rays;

            float x = armX + (apexX - armX) * t * 0.4f;
            float y = armY + (apexY - armY) * t * 0.4f;

            float endX = tipX + (apexX - tipX) * t * 0.35f;
            float endY = tipY + (apexY - tipY) * t * 0.35f;

            canvas.moveTo(apexX, apexY);
            canvas.lineTo(
                    apexX + (x - apexX) + (endX - apexX) * 0.02f,
                    apexY + (y - apexY) + (endY - apexY) * 0.02f
            );
        }

        canvas.stroke();

        PdfGState reset = new PdfGState();
        reset.setStrokeOpacity(1f);
        canvas.setGState(reset);
    }


    /*
     * ============================================================
     * CENTRAL EMBLEM (faint background monogram)
     * ============================================================
     */

    private void drawCentralEmblem(
            PdfContentByte canvas,
            Document document
    ) {

        float width =
                PageSize.A4.rotate().getWidth();

        float height =
                PageSize.A4.rotate().getHeight();

        float centerX = width / 2;
        float centerY = height / 2 - 20;

        PdfGState faint = new PdfGState();
        faint.setFillOpacity(0.05f);
        faint.setStrokeOpacity(0.06f);
        canvas.setGState(faint);

        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(2f);

        canvas.circle(centerX, centerY, 95);
        canvas.stroke();

        canvas.circle(centerX, centerY, 88);
        canvas.stroke();

        Font monogramFont =
                FontFactory.getFont(
                        FontFactory.TIMES_BOLD,
                        110,
                        Font.NORMAL,
                        NAVY
                );

        canvas.setColorFill(NAVY);

        ColumnText.showTextAligned(
                canvas,
                Element.ALIGN_CENTER,
                new Phrase("CC", monogramFont),
                centerX,
                centerY - 38,
                0
        );

        PdfGState reset = new PdfGState();
        reset.setFillOpacity(1f);
        reset.setStrokeOpacity(1f);
        canvas.setGState(reset);
    }


    /*
     * ============================================================
     * HEADER
     * ============================================================
     */

    private void drawHeader(
            PdfContentByte canvas,
            Document document
    ) {

        float height =
                PageSize.A4.rotate().getHeight();


        /*
         * CorvusCode brand, with slight letter-spacing for polish
         */
        showCenteredText(
                canvas,
                spaceOut("CORVUSCODE"),
                BRAND_FONT,
                75,
                height - 68
        );


        /*
         * Tagline
         */
        showCenteredText(
                canvas,
                "CODE  •  COMPETE  •  GROW",
                TAGLINE_FONT,
                75,
                height - 82
        );


        /*
         * Gold separator
         */
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(1);

        canvas.moveTo(48, height - 98);
        canvas.lineTo(225, height - 98);

        canvas.stroke();

        canvas.setColorStroke(LIGHT_GOLD);
        canvas.setLineWidth(0.4f);

        canvas.moveTo(48, height - 101);
        canvas.lineTo(225, height - 101);

        canvas.stroke();
    }


    /*
     * ============================================================
     * TITLE
     * ============================================================
     */

    private void drawTitle(
            PdfContentByte canvas,
            Document document
    ) {

        float width =
                PageSize.A4.rotate().getWidth();

        float height =
                PageSize.A4.rotate().getHeight();


        /*
         * Soft shadow behind the main title for a subtle 3D lift
         */
        Font shadowFont =
                FontFactory.getFont(
                        FontFactory.TIMES_BOLD,
                        38,
                        Font.NORMAL,
                        new Color(0, 0, 0)
                );

        PdfGState shadowState = new PdfGState();
        shadowState.setFillOpacity(0.06f);
        canvas.setGState(shadowState);

        showCenteredText(
                canvas,
                spaceOut("CERTIFICATE"),
                shadowFont,
                width / 2 + 1.5f,
                height - 93.5f
        );

        PdfGState resetState = new PdfGState();
        resetState.setFillOpacity(1f);
        canvas.setGState(resetState);


        /*
         * Main title
         */
        showCenteredText(
                canvas,
                spaceOut("CERTIFICATE"),
                TITLE_FONT,
                width / 2,
                height - 92
        );


        /*
         * Subtitle
         */
        showCenteredText(
                canvas,
                spaceOut("OF ACHIEVEMENT"),
                SUBTITLE_FONT,
                width / 2,
                height - 119
        );


        /*
         * Decorative lines around subtitle, with small diamonds
         * marking the ends
         */
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(1.2f);

        canvas.moveTo(
                width / 2 - 175,
                height - 116
        );

        canvas.lineTo(
                width / 2 - 115,
                height - 116
        );

        canvas.moveTo(
                width / 2 + 115,
                height - 116
        );

        canvas.lineTo(
                width / 2 + 175,
                height - 116
        );

        canvas.stroke();

        drawDiamond(canvas, width / 2 - 180, height - 116, 3.5f);
        drawDiamond(canvas, width / 2 + 180, height - 116, 3.5f);


        /*
         * Top-right message
         */
        Font quoteFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        8,
                        Font.NORMAL,
                        NAVY
                );

        showCenteredText(
                canvas,
                "CHALLENGE TODAY",
                quoteFont,
                width - 125,
                height - 62
        );

        showCenteredText(
                canvas,
                "A BRIGHTER TOMORROW",
                quoteFont,
                width - 125,
                height - 76
        );
    }


    /*
     * ============================================================
     * RECIPIENT
     * ============================================================
     */

    private void drawRecipientSection(
            PdfContentByte canvas,
            Document document,
            Certificate certificate
    ) {

        float width =
                PageSize.A4.rotate().getWidth();

        float height =
                PageSize.A4.rotate().getHeight();


        /*
         * Presented to
         */
        showCenteredText(
                canvas,
                spaceOut("THIS CERTIFIES THAT"),
                PRESENTED_FONT,
                width / 2,
                height - 165
        );


        /*
         * Participant name
         */
        String participantName =
                certificate.getParticipantName();

        if (participantName == null
                || participantName.isBlank()) {

            participantName =
                    certificate.getUser()
                            .getFullName();
        }

        showCenteredText(
                canvas,
                participantName,
                NAME_FONT,
                width / 2,
                height - 213
        );


        /*
         * Gold line below name, flanked by small diamonds
         */
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(0.8f);

        canvas.moveTo(
                width / 2 - 175,
                height - 230
        );

        canvas.lineTo(
                width / 2 + 175,
                height - 230
        );

        canvas.stroke();

        drawDiamond(canvas, width / 2 - 180, height - 230, 2.5f);
        drawDiamond(canvas, width / 2 + 180, height - 230, 2.5f);


        /*
         * Achievement sentence
         */
        String contestName =
                certificate.getContestName();

        if (contestName == null
                || contestName.isBlank()) {

            contestName =
                    certificate.getContest()
                            .getTitle();
        }


        if (certificate.getRank() != null) {

            String achievement =
                    "has secured "
                            + getRankText(
                            certificate.getRank()
                    )
                            + " in the";

            showCenteredText(
                    canvas,
                    achievement,
                    BODY_FONT,
                    width / 2,
                    height - 263
            );


            /*
             * Contest name
             */
            showCenteredText(
                    canvas,
                    contestName,
                    CONTEST_FONT,
                    width / 2,
                    height - 290
            );


            /*
             * Description
             */
            showCenteredText(
                    canvas,
                    "in recognition of outstanding problem-solving skills,",
                    BODY_FONT,
                    width / 2,
                    height - 318
            );

            showCenteredText(
                    canvas,
                    "dedication and performance.",
                    BODY_FONT,
                    width / 2,
                    height - 333
            );

        } else {

            showCenteredText(
                    canvas,
                    "has successfully participated in the",
                    BODY_FONT,
                    width / 2,
                    height - 263
            );

            showCenteredText(
                    canvas,
                    contestName,
                    CONTEST_FONT,
                    width / 2,
                    height - 290
            );

            showCenteredText(
                    canvas,
                    "in recognition of dedication and participation.",
                    BODY_FONT,
                    width / 2,
                    height - 320
            );
        }
    }


    /*
     * ============================================================
     * ACHIEVEMENT BADGE
     * ============================================================
     */

    private void drawAchievementBadge(
            PdfContentByte canvas,
            Certificate certificate
    ) {

        float width =
                PageSize.A4.rotate().getWidth();

        float height =
                PageSize.A4.rotate().getHeight();


        /*
         * Badge is only displayed for ranked certificates
         */
        if (certificate.getRank() == null) {
            return;
        }


        float centerX =
                width - 145;

        float centerY =
                height - 225;


        /*
         * Ribbon tails drawn first, underneath the medal, each
         * with a notched (forked) bottom edge for a realistic
         * ribbon silhouette
         */
        drawRibbonTail(canvas, centerX - 13, centerY, -6);
        drawRibbonTail(canvas, centerX + 13, centerY, 6);


        /*
         * Soft drop shadow beneath the medal
         */
        PdfGState shadowState = new PdfGState();
        shadowState.setFillOpacity(0.18f);
        canvas.setGState(shadowState);

        canvas.setColorFill(SHADOW);
        canvas.circle(centerX + 2, centerY - 3, 53);
        canvas.fill();

        PdfGState resetState = new PdfGState();
        resetState.setFillOpacity(1f);
        canvas.setGState(resetState);


        /*
         * Outer gold circle
         */
        canvas.setColorFill(GOLD);

        canvas.circle(
                centerX,
                centerY,
                52
        );

        canvas.fill();


        /*
         * Thin outer edge ring for extra definition
         */
        canvas.setColorStroke(LIGHT_GOLD);
        canvas.setLineWidth(1f);

        canvas.circle(centerX, centerY, 49);
        canvas.stroke();


        /*
         * Inner dark circle
         */
        canvas.setColorFill(NAVY);

        canvas.circle(
                centerX,
                centerY,
                43
        );

        canvas.fill();


        /*
         * Inner gold ring
         */
        canvas.setColorStroke(LIGHT_GOLD);
        canvas.setLineWidth(1.2f);

        canvas.circle(
                centerX,
                centerY,
                38
        );

        canvas.stroke();


        /*
         * Rank
         */
        Font badgeRankFont =
                FontFactory.getFont(
                        FontFactory.TIMES_BOLD,
                        30,
                        Font.NORMAL,
                        Color.WHITE
                );

        showCenteredText(
                canvas,
                String.valueOf(
                        certificate.getRank()
                ),
                badgeRankFont,
                centerX,
                centerY + 4
        );


        /*
         * "st / nd / rd"
         */
        Font suffixFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        8,
                        Font.NORMAL,
                        LIGHT_GOLD
                );

        showCenteredText(
                canvas,
                getOrdinalSuffix(
                        certificate.getRank()
                ),
                suffixFont,
                centerX + 20,
                centerY + 15
        );


        /*
         * PLACE
         */
        Font placeFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        8,
                        Font.NORMAL,
                        LIGHT_GOLD
                );

        showCenteredText(
                canvas,
                "PLACE",
                placeFont,
                centerX,
                centerY - 17
        );


        /*
         * Small stars
         */
        Font starFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        8,
                        Font.NORMAL,
                        LIGHT_GOLD
                );

        showCenteredText(
                canvas,
                "★  ★  ★",
                starFont,
                centerX,
                centerY - 31
        );
    }


    /*
     * A single forked ribbon tail hanging above the medal.
     * angleOffset tilts the tail left or right for a natural
     * "V" splay, and the bottom edge is notched (a small
     * inward triangle) rather than left flat.
     */
    private void drawRibbonTail(
            PdfContentByte canvas,
            float topCenterX,
            float medalCenterY,
            float tilt
    ) {

        float topY = medalCenterY + 40;
        float bottomY = medalCenterY - 62;
        float halfWidth = 9;

        float bx = topCenterX + tilt;

        canvas.setColorFill(NAVY);

        canvas.moveTo(bx - halfWidth, topY);
        canvas.lineTo(bx + halfWidth, topY);
        canvas.lineTo(bx + halfWidth - 1, bottomY + 14);
        canvas.lineTo(bx, bottomY);
        canvas.lineTo(bx - halfWidth + 1, bottomY + 14);
        canvas.closePath();

        canvas.fill();

        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(0.8f);

        canvas.moveTo(bx - halfWidth, topY);
        canvas.lineTo(bx - halfWidth, topY - 3);

        canvas.moveTo(bx + halfWidth, topY);
        canvas.lineTo(bx + halfWidth, topY - 3);

        canvas.stroke();
    }


    /*
     * ============================================================
     * FOOTER
     * ============================================================
     */

    private void drawFooterInformation(
            PdfContentByte canvas,
            Document document,
            Certificate certificate
    ) {

        float width =
                PageSize.A4.rotate().getWidth();


        /*
         * Left: issue date
         */
        String issuedDate =
                certificate
                        .getIssuedAt()
                        .format(
                                DateTimeFormatter.ofPattern(
                                        "dd MMMM yyyy"
                                )
                        );


        showCenteredText(
                canvas,
                spaceOut("ISSUED ON"),
                SMALL_LABEL_FONT,
                160,
                72
        );

        showCenteredText(
                canvas,
                issuedDate,
                SMALL_VALUE_FONT,
                160,
                58
        );


        /*
         * Gold line
         */
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(0.8f);

        canvas.moveTo(85, 82);
        canvas.lineTo(235, 82);

        canvas.stroke();


        /*
         * Center signature
         */
        Font signatureFont =
                FontFactory.getFont(
                        FontFactory.TIMES_ITALIC,
                        22,
                        Font.NORMAL,
                        NAVY
                );

        showCenteredText(
                canvas,
                "CorvusCode",
                signatureFont,
                width / 2,
                82
        );


        canvas.setColorStroke(NAVY);
        canvas.setLineWidth(0.8f);

        canvas.moveTo(
                width / 2 - 80,
                65
        );

        canvas.lineTo(
                width / 2 + 80,
                65
        );

        canvas.stroke();


        showCenteredText(
                canvas,
                spaceOut("TEAM CORVUSCODE"),
                SMALL_LABEL_FONT,
                width / 2,
                51
        );


        /*
         * Right: certificate ID
         */
        showCenteredText(
                canvas,
                spaceOut("CERTIFICATE ID"),
                SMALL_LABEL_FONT,
                width - 160,
                72
        );

        showCenteredText(
                canvas,
                certificate.getCertificateNumber(),
                SMALL_VALUE_FONT,
                width - 160,
                58
        );


        /*
         * Verification code
         */
        showCenteredText(
                canvas,
                "VERIFICATION: "
                        + certificate.getVerificationCode(),
                SMALL_VALUE_FONT,
                width - 160,
                44
        );


        /*
         * Bottom motto
         */
        Font mottoFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        8,
                        Font.NORMAL,
                        NAVY
                );

        showCenteredText(
                canvas,
                "BUILD  •  SOLVE  •  BELONG",
                mottoFont,
                width / 2,
                25
        );
    }


    /*
     * ============================================================
     * WATERMARK / LAUREL
     * ============================================================
     */

    private void drawDecorativeWatermark(
            PdfContentByte canvas
    ) {

        float width =
                PageSize.A4.rotate().getWidth();

        float height =
                PageSize.A4.rotate().getHeight();


        /*
         * Left laurel
         */
        drawLaurel(
                canvas,
                190,
                210,
                true
        );


        /*
         * Right laurel
         */
        drawLaurel(
                canvas,
                width - 190,
                210,
                false
        );
    }


    private void drawLaurel(
            PdfContentByte canvas,
            float centerX,
            float centerY,
            boolean left
    ) {

        canvas.setColorStroke(WATERMARK);
        canvas.setLineWidth(2);


        /*
         * Main branch
         */
        canvas.moveTo(
                centerX,
                centerY - 35
        );

        if (left) {

            canvas.curveTo(
                    centerX - 55,
                    centerY - 5,
                    centerX - 70,
                    centerY + 65,
                    centerX - 55,
                    centerY + 110
            );

        } else {

            canvas.curveTo(
                    centerX + 55,
                    centerY - 5,
                    centerX + 70,
                    centerY + 65,
                    centerX + 55,
                    centerY + 110
            );
        }

        canvas.stroke();


        /*
         * Leaves, tapering in size toward the tip of the branch
         * and finished with a small berry at the very top
         */
        for (int i = 0; i < 6; i++) {

            float y =
                    centerY + i * 22;

            float xOffset =
                    8 + i * 2;

            float scale =
                    1f - (i * 0.06f);

            drawLeaf(
                    canvas,
                    centerX - xOffset,
                    y,
                    left,
                    scale
            );

            drawLeaf(
                    canvas,
                    centerX + xOffset,
                    y,
                    !left,
                    scale
            );
        }

        float tipY = centerY + 6 * 22;
        float tipX = left ? centerX - 55 : centerX + 55;

        canvas.setColorFill(WATERMARK);
        canvas.circle(tipX, tipY, 3.5f);
        canvas.fill();
    }


    private void drawLeaf(
            PdfContentByte canvas,
            float x,
            float y,
            boolean left,
            float scale
    ) {

        float direction =
                left ? -1 : 1;


        canvas.setColorFill(WATERMARK);

        canvas.moveTo(
                x,
                y
        );

        canvas.curveTo(
                x + direction * 18 * scale,
                y + 7 * scale,
                x + direction * 22 * scale,
                y + 17 * scale,
                x + direction * 26 * scale,
                y + 21 * scale
        );

        canvas.curveTo(
                x + direction * 12 * scale,
                y + 21 * scale,
                x + direction * 4 * scale,
                y + 13 * scale,
                x,
                y
        );

        canvas.closePath();

        canvas.fill();
    }


    /*
     * ============================================================
     * CORNER DECORATION
     * ============================================================
     */

    private void drawCornerDecoration(
            PdfContentByte canvas,
            float x,
            float y,
            boolean left,
            boolean bottom
    ) {

        float dx =
                left ? 1 : -1;

        float dy =
                bottom ? 1 : -1;


        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(1);


        canvas.moveTo(
                x,
                y
        );

        canvas.lineTo(
                x + dx * 18,
                y
        );

        canvas.moveTo(
                x,
                y
        );

        canvas.lineTo(
                x,
                y + dy * 18
        );

        canvas.stroke();


        canvas.setColorStroke(LIGHT_GOLD);
        canvas.setLineWidth(0.7f);


        canvas.moveTo(
                x + dx * 5,
                y
        );

        canvas.lineTo(
                x + dx * 28,
                y
        );

        canvas.moveTo(
                x,
                y + dy * 5
        );

        canvas.lineTo(
                x,
                y + dy * 28
        );

        canvas.stroke();


        /*
         * Curved flourish tying the two arms together, plus a
         * small diamond accent at the apex
         */
        canvas.setColorStroke(GOLD);
        canvas.setLineWidth(0.6f);

        canvas.moveTo(x + dx * 9, y);

        canvas.curveTo(
                x + dx * 9, y + dy * 6,
                x + dx * 6, y + dy * 9,
                x, y + dy * 9
        );

        canvas.stroke();

        drawDiamond(canvas, x + dx * 22, y + dy * 22, 2.2f);
    }


    /*
     * Small rotated-square accent used sparingly as a punctuation
     * mark around rules and corner flourishes.
     */
    private void drawDiamond(
            PdfContentByte canvas,
            float x,
            float y,
            float size
    ) {

        canvas.setColorFill(GOLD);

        canvas.moveTo(x, y + size);
        canvas.lineTo(x + size, y);
        canvas.lineTo(x, y - size);
        canvas.lineTo(x - size, y);
        canvas.closePath();

        canvas.fill();
    }


    /*
     * ============================================================
     * TEXT HELPER
     * ============================================================
     */

    private void showCenteredText(
            PdfContentByte canvas,
            String text,
            Font font,
            float x,
            float y
    ) {

        if (text == null) {
            text = "";
        }

        ColumnText.showTextAligned(
                canvas,
                Element.ALIGN_CENTER,
                new Phrase(
                        text,
                        font
                ),
                x,
                y,
                0
        );
    }


    /*
     * Inserts a thin space between characters of a short, all
     * caps label so headings read with a more deliberate, engraved
     * letter-spacing rather than sitting flush together.
     */
    private String spaceOut(
            String text
    ) {

        if (text == null || text.isBlank()) {
            return text;
        }

        StringBuilder builder =
                new StringBuilder();

        for (int i = 0; i < text.length(); i++) {

            char c = text.charAt(i);

            builder.append(c);

            if (c != ' ' && i < text.length() - 1) {
                builder.append('\u2009');
            }
        }

        return builder.toString();
    }


    /*
     * ============================================================
     * CERTIFICATE TITLE
     * ============================================================
     */

    private String getCertificateTitle(
            CertificateType type
    ) {

        if (type == null) {
            return "CERTIFICATE OF ACHIEVEMENT";
        }

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


    /*
     * ============================================================
     * RANK TEXT
     * ============================================================
     */

    private String getRankText(
            Integer rank
    ) {

        if (rank == null) {
            return "";
        }

        return rank
                + getOrdinalSuffix(rank)
                + " Place";
    }


    /*
     * ============================================================
     * ORDINAL SUFFIX
     * ============================================================
     */

    private String getOrdinalSuffix(
            Integer number
    ) {

        if (number == null) {
            return "";
        }

        int value =
                Math.abs(number);

        if (value % 100 >= 11
                && value % 100 <= 13) {

            return "th";
        }

        return switch (value % 10) {

            case 1 -> "st";

            case 2 -> "nd";

            case 3 -> "rd";

            default -> "th";
        };
    }
}