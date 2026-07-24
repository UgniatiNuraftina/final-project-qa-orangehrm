class DirectoryPage {
  visit() {
    cy.visit("/web/index.php/directory/viewDirectory");
  }

  get employeeNameInput() { return cy.get('input[placeholder="Type for hints..."]'); }
  get invalidMessage() { return cy.contains(".oxd-input-field-error-message", "Invalid"); }
  get jobTitleDropdown() { return cy.get(".oxd-select-text").eq(0); }
  get locationDropdown() { return cy.get(".oxd-select-text").eq(1); }
  get resetButton() { return cy.get('button[type="reset"]'); }
  get searchButton() { return cy.get('button[type="submit"]'); }
  get recordsFoundText() { return cy.contains(".oxd-text--span", "Records Found"); }
  get employeeCards() { return cy.get(".orangehrm-directory-card"); }

  // ---------- Intercept setup ----------
  interceptSearch(alias = "searchEmployee") {
    cy.intercept("GET", "**/api/v2/directory/employees**").as(alias);
    return alias;
  }

  interceptReset(alias = "resetSearch") {
    cy.intercept("GET", "**/api/v2/directory/employees?limit=14&offset=0").as(alias);
    return alias;
  }

  interceptEmployeeDetail(alias = "employeeProfile") {
    cy.intercept("GET", "**/api/v2/directory/employees/*?model=detailed").as(alias);
    return alias;
  }

  // ---------- Actions ----------
  typeEmployeeName(name) { this.employeeNameInput.clear().type(name); return this; }

  selectFirstSuggestion() {
    cy.get(".oxd-autocomplete-dropdown li, .oxd-autocomplete-option", { timeout: 8000 })
      .should("be.visible")
      .first()
      .click();
    return this;
  }

  selectJobTitle(optionText) {
    this.jobTitleDropdown.click();
    cy.get(".oxd-select-dropdown").contains(optionText).click();
    return this;
  }

  selectLocation(optionText) {
    this.locationDropdown.click();
    cy.get(".oxd-select-dropdown").contains(optionText).click();
    return this;
  }

  clickSearch() { this.searchButton.click(); return this; }
  clickReset() { this.resetButton.click(); return this; }
  clickFirstEmployeeCard() { this.employeeCards.first().click(); return this; }

  // ---------- Assertions ----------
  verifySearchSuccess(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
    this.recordsFoundText.should("be.visible");
    return this;
  }

  verifyInvalidNoRequest(alias) {
    this.invalidMessage.should("be.visible");
    cy.get(`@${alias}.all`).should("have.length", 0);
    return this;
  }

  verifyResetSuccess(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
    this.jobTitleDropdown.should("contain.text", "-- Select --");
    return this;
  }

  verifyInitialLoad(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
    this.recordsFoundText.should("be.visible").and("not.contain.text", "(0)");
    return this;
  }

  verifyEmployeeDetailLoaded(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
    return this;
  }
}

export default new DirectoryPage();