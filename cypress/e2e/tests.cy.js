/* eslint-disable vitest/expect-expect */

describe("e2e tests", () => {
  it("Current puzzle", () => {
    cy.visit("/");
    cy.findByTestId("current-puzzle-url").within(() => {
      cy.findByDisplayValue(/.puz$/);
      cy.findByText("View Puzzle").click();
    });
    cy.findByText(/^Eye/);
    cy.findByText("Cyclops");
  });
});
