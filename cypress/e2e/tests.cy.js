describe("happy path scenarios", () => {
  it("scrape current puzzle", () => {
    cy.visit("/");
    cy.findByTestId("current-puzzle-url").within(() => {
      cy.findByDisplayValue(/.puz$/);
      cy.findByText("View Puzzle").click();
    });
    cy.findByText(/^Eye/);
    cy.findByText("Cyclops");
  });
});
