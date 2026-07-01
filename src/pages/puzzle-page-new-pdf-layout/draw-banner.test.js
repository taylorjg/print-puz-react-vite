import { PDFDocument, StandardFonts } from "pdf-lib";

import puzzle753 from "@app/mocks/puzzle753.json";

import { BANNER } from "./banner-layout";
import { drawBanner } from "./draw-banner";
import { PDF_PAGE } from "./pdf-layout";
import { generateCrosswordPdf } from "./generate-crossword-pdf";

const pdfHeader = (bytes) => new TextDecoder().decode(bytes.slice(0, 5));

describe("drawBanner", () => {
  test("produces a valid PDF page", async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([PDF_PAGE.width, PDF_PAGE.height]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    drawBanner(page, font, "NO. 31,258");

    const bytes = await pdfDoc.save();
    expect(pdfHeader(bytes)).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(500);
  });
});

describe("generateCrosswordPdf banner integration", () => {
  test("still generates a valid PDF with the puzzle", async () => {
    const bytes = await generateCrosswordPdf(puzzle753);
    expect(pdfHeader(bytes)).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(1000);
  });

  test("banner body uses reference PDF width", () => {
    expect(BANNER.body.width).toBeCloseTo(219.75, 1);
  });
});
