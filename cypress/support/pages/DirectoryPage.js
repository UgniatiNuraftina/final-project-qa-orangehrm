class DirectoryPage {
  visit() {
    cy.visit("/web/index.php/directory/viewDirectory");
  }

  get employeeNameInput() {
    return cy.get('input[placeholder="Type for hints..."]');
  }

  get autocompleteSuggestions() {
    return cy.get(".oxd-autocomplete-dropdown li, .oxd-autocomplete-option");
  }

  get invalidMessage() {
    return cy.contains(".oxd-input-field-error-message", "Invalid");
  }

  get jobTitleDropdown() {
    return cy.get(".oxd-select-text").eq(0);
  }

  get locationDropdown() {
    return cy.get(".oxd-select-text").eq(1);
  }

  get resetButton() {
    return cy.get('button[type="reset"]');
  }

  get searchButton() {
    return cy.get('button[type="submit"]');
  }

  get recordsFoundText() {
    return cy.contains(".oxd-text--span", "Records Found");
  }

  get employeeCards() {
    return cy.get(".orangehrm-directory-card");
  }

  typeEmployeeName(name) {
    this.employeeNameInput.clear().type(name);
    return this;
  }

  selectFirstSuggestion() {
    cy.get(".oxd-autocomplete-dropdown li, .oxd-autocomplete-option").first().click();
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

  clickSearch() {
    this.searchButton.click();
    return this;
  }

  clickReset() {
    this.resetButton.click();
    return this;
  }

  clickFirstEmployeeCard() {
    this.employeeCards.first().click();
    return this;
  }
}

export default new DirectoryPage();