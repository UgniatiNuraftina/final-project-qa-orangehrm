import DirectoryPage from "../support/pages/DirectoryPage";
import LoginPage from "../support/pages/LoginPage";

describe("Fitur Directory - OrangeHRM (POM + intercept)", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/auth/validate").as("loginRequest");
    LoginPage.visit();
    LoginPage.login("Admin", "admin123");
    cy.wait("@loginRequest");
    DirectoryPage.visit();
  });

  it("DIR_01 - Search employee dengan memilih saran autocomplete yang valid", () => {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("searchEmployee");
    DirectoryPage.typeEmployeeName("Ranga");
    cy.wait(1000);
    DirectoryPage.selectFirstSuggestion();
    DirectoryPage.clickSearch();
    cy.wait("@searchEmployee").its("response.statusCode").should("eq", 200);
    DirectoryPage.recordsFoundText.should("be.visible");
  });

  it("DIR_02 - Search employee tanpa memilih saran autocomplete tampil pesan Invalid", () => {
    DirectoryPage.typeEmployeeName("Ranga");
    cy.wait(2500);
    cy.intercept("GET", "**/api/v2/directory/employees**").as("searchEmployee");
    DirectoryPage.clickSearch();
    DirectoryPage.invalidMessage.should("be.visible");
    cy.get("@searchEmployee.all").should("have.length", 0);
  });

  it("DIR_03 - Filter berdasarkan Job Title menampilkan hasil sesuai", () => {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("searchByJobTitle");
    DirectoryPage.selectJobTitle("Chief Executive Officer");
    DirectoryPage.clickSearch();
    cy.wait("@searchByJobTitle").its("response.statusCode").should("eq", 200);
    DirectoryPage.recordsFoundText.should("be.visible");
  });

  it("DIR_04 - Filter berdasarkan Location menampilkan hasil sesuai", () => {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("searchByLocation");
    DirectoryPage.selectLocation("Texas R&D");
    DirectoryPage.clickSearch();
    cy.wait("@searchByLocation").its("response.statusCode").should("eq", 200);
    DirectoryPage.recordsFoundText.should("be.visible");
  });

  it("DIR_05 - Kombinasi filter Job Title dan Location", () => {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("searchCombined");
    DirectoryPage.selectJobTitle("Chief Executive Officer");
    DirectoryPage.selectLocation("HQ - CA, USA");
    DirectoryPage.clickSearch();
    cy.wait("@searchCombined").its("response.statusCode").should("eq", 200);
  });

  it("DIR_06 - Klik Reset mengembalikan filter ke kondisi awal dan memuat ulang data", () => {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("searchWithFilter");
    DirectoryPage.selectJobTitle("Chief Executive Officer");
    DirectoryPage.clickSearch();
    cy.wait("@searchWithFilter");

    cy.intercept("GET", "**/api/v2/directory/employees?limit=14&offset=0").as("resetSearch");
    DirectoryPage.clickReset();
    cy.wait("@resetSearch").its("response.statusCode").should("eq", 200);
    DirectoryPage.jobTitleDropdown.should("contain.text", "-- Select --");
  });

  it("DIR_07 - Halaman awal menampilkan jumlah Records Found lebih dari 0", () => {
    cy.intercept("GET", "**/api/v2/directory/employees**").as("initialLoad");
    DirectoryPage.visit();
    cy.wait("@initialLoad").its("response.statusCode").should("eq", 200);
    DirectoryPage.recordsFoundText.should("be.visible").and("not.contain.text", "(0)");
  });

  it("DIR_08 - Klik salah satu card karyawan menampilkan halaman profil", () => {
    cy.intercept("GET", "**/api/v2/directory/employees/*?model=detailed").as("employeeProfile");
    DirectoryPage.employeeCards.first().click();
    cy.wait("@employeeProfile").its("response.statusCode").should("eq", 200);
  });
});