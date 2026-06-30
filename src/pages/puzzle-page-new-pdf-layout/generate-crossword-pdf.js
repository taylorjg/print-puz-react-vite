import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import * as U from "@app/utils";

import {
  PDF_LAYOUT,
  PDF_PAGE,
  cluesStartY,
  findClueNumber,
  formatNumberLabel,
} from "./pdf-layout";
import { drawBanner } from "./draw-banner";

const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);

/** Standard PDF fonts only support WinAnsi; normalise puzzle text. */
const sanitizeText = (text) =>
  text
    .replace(/\u2013|\u2014|\u0096/g, "-")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/[^\u0020-\u00ff]/g, "?");

const yFromTop = (yTop) => PDF_PAGE.height - yTop;

const baselineFromTop = (yTop, fontSize) => yFromTop(yTop) - fontSize;

const wrapText = (text, font, fontSize, maxWidth) => {
  const words = sanitizeText(text).split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, fontSize);
    if (width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines.length > 0 ? lines : [""];
};

const drawMasthead = (page, fontBold, numberLabel) => {
  drawBanner(page, fontBold, numberLabel);
};

const drawGrid = (page, parsedPuzzle, font) => {
  const {
    y: gridY,
    cellSize,
    numberSize,
    numberOffsetX,
    numberOffsetY,
    stroke,
  } = PDF_LAYOUT.grid;
  const { width, height } = parsedPuzzle.puzzle;
  const gridWidth = width * cellSize;
  const gridHeight = height * cellSize;
  const gridX = (PDF_PAGE.width - gridWidth) / 2;

  for (const row of U.range(height)) {
    for (const col of U.range(width)) {
      if (parsedPuzzle.grid[row][col] !== "X") continue;
      page.drawRectangle({
        x: gridX + col * cellSize,
        y: yFromTop(gridY + (row + 1) * cellSize),
        width: cellSize,
        height: cellSize,
        color: BLACK,
      });
    }
  }

  for (const i of U.range(height + 1)) {
    const yTop = gridY + i * cellSize;
    const y = yFromTop(yTop);
    page.drawLine({
      start: { x: gridX, y },
      end: { x: gridX + gridWidth, y },
      thickness: stroke,
      color: BLACK,
    });
  }

  for (const i of U.range(width + 1)) {
    const x = gridX + i * cellSize;
    page.drawLine({
      start: { x, y: yFromTop(gridY) },
      end: { x, y: yFromTop(gridY + gridHeight) },
      thickness: stroke,
      color: BLACK,
    });
  }

  for (const row of U.range(height)) {
    for (const col of U.range(width)) {
      if (parsedPuzzle.grid[row][col] === "X") continue;
      const clueNumber = findClueNumber(parsedPuzzle, row, col);
      if (clueNumber === undefined) continue;
      const cellTop = gridY + row * cellSize;
      page.drawText(String(clueNumber), {
        x: gridX + col * cellSize + numberOffsetX,
        y: baselineFromTop(cellTop + numberOffsetY, numberSize),
        size: numberSize,
        font,
        color: BLACK,
      });
    }
  }
};

const clueEntryHeight = (clue, font, textSize, maxWidth) =>
  wrapText(clue, font, textSize, maxWidth).length * PDF_LAYOUT.clues.lineHeight;

const drawClueEntry = (
  page,
  { clueNumber, clue },
  y,
  config,
  font,
  fontBold
) => {
  const { textSize, lineHeight } = PDF_LAYOUT.clues;
  const lines = wrapText(clue, font, textSize, config.maxWidth);

  page.drawText(String(clueNumber), {
    x: config.numberX,
    y: baselineFromTop(y, textSize),
    size: textSize,
    font: fontBold,
    color: BLACK,
  });

  lines.forEach((line, index) => {
    page.drawText(line, {
      x: config.textX,
      y: baselineFromTop(y + index * lineHeight, textSize),
      size: textSize,
      font,
      color: BLACK,
    });
  });

  return lines.length * lineHeight;
};

const drawClueColumn = (ensurePage, clues, column, startY, font, fontBold) => {
  const {
    headerSize,
    headerGap,
    textSize,
    bottomMargin,
    continuationY,
    left,
    right,
  } = PDF_LAYOUT.clues;
  const config = column === "across" ? left : right;
  const pageBottom = PDF_PAGE.height - bottomMargin;

  let pageIndex = 0;
  let page = ensurePage(pageIndex);
  let y = startY;

  const header = column === "across" ? "Across" : "Down";
  page.drawText(header, {
    x: config.numberX,
    y: baselineFromTop(y, headerSize),
    size: headerSize,
    font: fontBold,
    color: BLACK,
  });
  y += headerSize + headerGap;

  for (const entry of clues) {
    const blockHeight = clueEntryHeight(
      entry.clue,
      font,
      textSize,
      config.maxWidth
    );

    if (y + blockHeight > pageBottom) {
      pageIndex += 1;
      page = ensurePage(pageIndex);
      y = continuationY;
    }

    y += drawClueEntry(page, entry, y, config, font, fontBold);
  }
};

export const generateCrosswordPdf = async (parsedPuzzle) => {
  const pdfDoc = await PDFDocument.create();
  const pages = [pdfDoc.addPage([PDF_PAGE.width, PDF_PAGE.height])];
  const ensurePage = (index) => {
    while (pages.length <= index) {
      pages.push(pdfDoc.addPage([PDF_PAGE.width, PDF_PAGE.height]));
    }
    return pages[index];
  };

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { title, author, height } = parsedPuzzle.puzzle;
  const numberLabel = formatNumberLabel(title);
  const dateText = sanitizeText(author ? `${title} · ${author}` : title);
  const firstPage = pages[0];

  drawMasthead(firstPage, fontBold, numberLabel);

  const dateWidth = font.widthOfTextAtSize(dateText, PDF_LAYOUT.date.size);
  firstPage.drawText(dateText, {
    x: PDF_PAGE.width - dateWidth - 36,
    y: baselineFromTop(PDF_LAYOUT.date.y, PDF_LAYOUT.date.size),
    size: PDF_LAYOUT.date.size,
    font,
    color: BLACK,
  });

  drawGrid(firstPage, parsedPuzzle, font);

  const clueY = cluesStartY(height);

  drawClueColumn(
    ensurePage,
    parsedPuzzle.acrossClues ?? [],
    "across",
    clueY,
    font,
    fontBold
  );
  drawClueColumn(
    ensurePage,
    parsedPuzzle.downClues ?? [],
    "down",
    clueY,
    font,
    fontBold
  );

  return pdfDoc.save();
};
