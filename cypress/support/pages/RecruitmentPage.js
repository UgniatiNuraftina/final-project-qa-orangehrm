class RecruitmentPage {
  visit() {
    cy.visit("/web/index.php/recruitment/viewCandidates");
  }

  get statusDropdown() { return cy.get(".oxd-select-text").eq(3); }
  get jobTitleDropdown() { return cy.get(".oxd-select-text").eq(0); }
  get candidateNameInput() { return cy.get('input[placeholder="Type for hints..."]'); }
  get invalidMessage() { return cy.contains(".oxd-input-field-error-message", "Invalid"); }
  get resetButton() { return cy.get('button[type="reset"]'); }
  get searchButton() { return cy.get('button[type="submit"]'); }
  get recordsFoundText() { return cy.contains(".oxd-text--span", "Record"); }
  get addButton() { return cy.contains("button", "Add"); }
  get viewIconFirstRow() { return cy.get(".oxd-table-cell-actions button").first(); }

  // ---------- Intercept setup ----------
  interceptSearch(alias = "searchCandidate") {
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as(alias);
    return alias;
  }

  interceptCandidateDetail(alias = "candidateDetail") {
    cy.intercept("GET", "**/api/v2/recruitment/candidates/*").as(alias);
    return alias;
  }

  // ---------- Actions ----------
  selectStatus(optionText) {
    this.statusDropdown.click();
    cy.get(".oxd-select-dropdown").contains(optionText).click();
    return this;
  }

  selectJobTitle(optionText) {
    this.jobTitleDropdown.click();
    cy.get(".oxd-select-dropdown").contains(optionText).click();
    return this;
  }

  typeCandidateName(name) { this.candidateNameInput.clear().type(name); return this; }

  selectFirstSuggestion() {
    cy.get(".oxd-autocomplete-dropdown li, .oxd-autocomplete-option", { timeout: 8000 })
      .should("be.visible")
      .first()
      .click();
    return this;
  }

  clickSearch() { this.searchButton.click(); return this; }
  clickReset() { this.resetButton.click(); return this; }
  clickAdd() { this.addButton.click(); return this; }
  clickFirstViewIcon() { this.viewIconFirstRow.click(); return this; }

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
    this.statusDropdown.should("contain.text", "-- Select --");
    return this;
  }

  verifyInitialLoad(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
    this.recordsFoundText.should("be.visible").and("not.contain.text", "(0)");
    return this;
  }

  verifyAddCandidatePage() {
    cy.url().should("include", "/recruitment/addCandidate");
    return this;
  }

  verifyCandidateDetailLoaded(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/recruitment/addCandidate");
    return this;
  }
}

export default new RecruitmentPage();