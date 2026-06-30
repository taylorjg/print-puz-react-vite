import { PDFDocument, StandardFonts } from "pdf-lib";

import puzzle753 from "@app/mocks/puzzle753.json";

import { BANNER } from "./bannerLayout";
import { drawBanner } from "./drawBanner";
import { PDF_PAGE } from "./pdfLayout";
import { generateCrosswordPdf } from "./generateCrosswordPdf";

const pdfHeader = (bytes) => new TextDecoder().decode(bytes.slice(0, 5));

describe("drawBanner", () => {
  test("produces a valid PDF page", async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([PDF_PAGE.width, PDF_PAGE.height]);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    drawBanner(page, fontBold, "NO. 31,258");

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
