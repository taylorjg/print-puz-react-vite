describe("happy path scenarios", () => {
  it("use the current puzzle url", () => {
    cy.visit("/");
    cy.findByTestId("current-puzzle-url").within(() => {
      cy.findByDisplayValue(/.puz$/);
      cy.findByText("View Puzzle").click();
    });
    cy.findByText(/^Eye \d+\/\d+/);
    cy.findByText("Cyclops");
  });

  it("select a puzzle from the list", () => {
    cy.visit("/");
    cy.findByTestId("puzzle-list").within(() => {
      cy.findByLabelText("Puzzles").select("312.puz");
      cy.findByText("View Puzzle").click();
    });
    cy.findByText("Eye 1157/312 Apr 2006");
    cy.findByText("Cyclops");
  });

  it("enter an explicit puzzle url", () => {
    cy.visit("/");
    cy.findByTestId("explicit-puzzle-url").within(() => {
      cy.findByLabelText("Puzzle Url").type(
        "https://www.private-eye.co.uk/pictures/crossword/download/753.puz"
      );
      cy.findByText("View Puzzle").click();
    });
    cy.findByText("Eye 753/1598");
    cy.findByText("Cyclops");
  });
});
