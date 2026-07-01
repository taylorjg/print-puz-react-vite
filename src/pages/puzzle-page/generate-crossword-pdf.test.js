import puzzle753 from "@app/mocks/puzzle753.json";

import { generateCrosswordPdf } from "./generate-crossword-pdf";
import { cluesStartY } from "./pdf-layout";

describe("generateCrosswordPdf", () => {
  test("returns a valid PDF document", async () => {
    const bytes = await generateCrosswordPdf(puzzle753);
    expect(bytes.length).toBeGreaterThan(1000);
    const header = new TextDecoder().decode(bytes.slice(0, 5));
    expect(header).toBe("%PDF-");
  });

  test("places clues below the grid", () => {
    const gridBottom = 63 + 15 * 24;
    expect(cluesStartY(15)).toBeGreaterThan(gridBottom);
  });
});
