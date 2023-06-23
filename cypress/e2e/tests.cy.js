describe("happy path scenarios", () => {
  it("use the current puzzle url", () => {
    cy.visit("/");
    cy.findByTestId("current-puzzle").within(() => {
      cy.findByDisplayValue(/.puz$/);
      cy.findByText("View Puzzle").click();
    });
    cy.findByText(/^Eye \d+\/\d+/);
    cy.findByText("Cyclops");
  });

  it("select a puzzle url from the list", () => {
    cy.visit("/");
    cy.findByTestId("puzzle-list").within(() => {
      cy.findByText("300.puz");
    });
    cy.findByTestId("puzzle-list").within(() => {
      cy.findByLabelText("Puzzles")
        .findByRole("button")
        .trigger("mousedown", { button: 0 });
    });
    cy.findByRole("listbox").findByText("312.puz").click();
    cy.findByTestId("puzzle-list").findByText("View Puzzle").click();
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

describe("error scenarios", () => {
  it("no puzzle specified", () => {
    cy.visit("/#/puzzle");
    cy.findByRole("alert").within(() => {
      cy.findByText("No puzzle specified.");
      cy.findByText("Return Home").click();
    });
    cy.location("pathname").should("eq", "/print-puz-react-vite/");
    cy.location("hash").should("eq", "#/");
  });

  it("read or parse failure", () => {
    cy.visit("/");
    cy.findByTestId("explicit-puzzle-url").within(() => {
      cy.findByLabelText("Puzzle Url").type(
        "https://www.private-eye.co.uk/pictures/crossword/download/bogus.puz"
      );
      cy.findByText("View Puzzle").click();
    });
    cy.location("pathname").should("eq", "/print-puz-react-vite/");
    cy.location("hash").should("eq", "#/puzzle");
    cy.findByRole("alert").within(() => {
      cy.findByText("Failed to read or parse puzzle.");
      cy.findByText("Return Home").click();
    });
    cy.location("pathname").should("eq", "/print-puz-react-vite/");
    cy.location("hash").should("eq", "#/");
  });
});
