// Layout from new-layout-examples/exports-from-preview-tool/ (Telegraph PDF, A4)

export const PDF_PAGE = {
  width: 595.92,
  height: 841.92,
};

export const PDF_LAYOUT = {
  date: { x: 528, y: 25, size: 7.5 },
  grid: {
    y: 63,
    cellSize: 24,
    numberSize: 5.6,
    numberOffsetX: 0.75,
    numberOffsetY: 0.75,
    // Telegraph PDF vector strokes: inner lines 0.75 pt (drawing #531); uniform per preview.
    stroke: 0.75,
  },
  clues: {
    gapBelowGrid: 14,
    bottomMargin: 36,
    continuationY: 54,
    headerSize: 12,
    headerGap: 11,
    textSize: 10.5,
    // Measured from Telegraph PDF: 13.5 pt between consecutive text baselines.
    lineHeight: 13.5,
    left: { numberX: 51, textX: 74, maxWidth: 222 },
    right: { numberX: 308, textX: 331, maxWidth: 222 },
  },
};

/** Y (from page top) where clue columns begin, immediately below the grid. */
export const cluesStartY = (gridRows) => {
  const { y: gridY, cellSize } = PDF_LAYOUT.grid;
  const { gapBelowGrid } = PDF_LAYOUT.clues;
  return gridY + gridRows * cellSize + gapBelowGrid;
};

export const formatNumberLabel = (title) => {
  const eyeMatch = title.match(/Eye\s+(\d+)\/(\d+)/i);
  if (eyeMatch) {
    return `NO. ${Number(eyeMatch[2]).toLocaleString("en-GB")}`;
  }
  return `NO. ${title}`;
};

export const findClueNumber = (parsedPuzzle, row, col) => {
  const across = parsedPuzzle.acrossClues.find(
    ({ rowIndex, colIndex }) => rowIndex === row && colIndex === col
  );
  if (across) return across.clueNumber;
  const down = parsedPuzzle.downClues.find(
    ({ rowIndex, colIndex }) => rowIndex === row && colIndex === col
  );
  if (down) return down.clueNumber;
  return undefined;
};
