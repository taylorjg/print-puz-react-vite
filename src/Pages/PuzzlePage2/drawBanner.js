import { rgb } from "pdf-lib";

import { BANNER } from "./bannerLayout";
import { PDF_PAGE } from "./pdfLayout";

const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);

const yFromTop = (yTop) => PDF_PAGE.height - yTop;

/**
 * Telegraph-style cryptic crossword banner: hangers, notched bar, white label.
 * Coordinates match the reference PDF (top-left origin converted to PDF y-up).
 */
export const drawBanner = (page, fontBold, numberLabel) => {
  const { body, hangers, notches, text } = BANNER;
  const label = `CRYPTIC CROSSWORD ${numberLabel}`;

  for (const hanger of hangers) {
    page.drawRectangle({
      x: hanger.x,
      y: yFromTop(hanger.y + hanger.height),
      width: hanger.width,
      height: hanger.height,
      color: BLACK,
    });
  }

  page.drawRectangle({
    x: body.x,
    y: yFromTop(body.y + body.height),
    width: body.width,
    height: body.height,
    color: BLACK,
  });

  for (const center of [notches.left, notches.right]) {
    page.drawCircle({
      x: center.x,
      y: yFromTop(center.y),
      size: notches.radius,
      color: WHITE,
      borderWidth: 0,
    });
  }

  const textWidth = fontBold.widthOfTextAtSize(label, text.size);
  page.drawText(label, {
    x: body.x + (body.width - textWidth) / 2,
    y: yFromTop(text.baselineFromTop),
    size: text.size,
    font: fontBold,
    color: WHITE,
  });
};
