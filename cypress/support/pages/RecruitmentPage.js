class RecruitmentPage {
  visit() {
    cy.visit("/web/index.php/recruitment/viewCandidates");
  }

  get statusDropdown() {
    return cy.get(".oxd-select-text").eq(3);
  }

  get jobTitleDropdown() {
    return cy.get(".oxd-select-text").eq(0);
  }

  get candidateNameInput() {
    return cy.get('input[placeholder="Type for hints..."]');
  }

  get invalidMessage() {
    return cy.contains(".oxd-input-field-error-message", "Invalid");
  }

  get resetButton() {
    return cy.get('button[type="reset"]');
  }

  get searchButton() {
    return cy.get('button[type="submit"]');
  }

  get recordsFoundText() {
    return cy.contains(".oxd-text--span", "Record");
  }

  get addButton() {
    return cy.contains("button", "Add");
  }

  get viewIconFirstRow() {
    return cy.get(".oxd-table-cell-actions button").first();
  }

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

  typeCandidateName(name) {
    this.candidateNameInput.clear().type(name);
    return this;
  }

  selectFirstSuggestion() {
    cy.get(".oxd-autocomplete-dropdown li, .oxd-autocomplete-option").first().click();
    return this;
  }

  clickSearch() {
    this.searchButton.click();
    return this;
  }

  clickReset() {
    this.resetButton.click();
    return this;
  }

  clickAdd() {
    this.addButton.click();
    return this;
  }

  clickFirstViewIcon() {
    this.viewIconFirstRow.click();
    return this;
  }
}

export default new RecruitmentPage();