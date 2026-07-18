import RecruitmentPage from "../support/pages/RecruitmentPage";
import LoginPage from "../support/pages/LoginPage";

describe("Fitur Recruitment - OrangeHRM (POM + intercept)", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/auth/validate").as("loginRequest");
    LoginPage.visit();
    LoginPage.login("Admin", "admin123");
    cy.wait("@loginRequest");
    RecruitmentPage.visit();
  });

  it("REC_01 - Filter berdasarkan Status Shortlisted menampilkan hasil sesuai", () => {
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as("searchByStatus");
    RecruitmentPage.selectStatus("Shortlisted");
    RecruitmentPage.clickSearch();
    cy.wait("@searchByStatus").its("response.statusCode").should("eq", 200);
    RecruitmentPage.recordsFoundText.should("be.visible");
  });

  it("REC_02 - Search candidate dengan memilih saran autocomplete yang valid", () => {
    RecruitmentPage.typeCandidateName("Mia");
    cy.wait(2500);
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as("searchCandidate");
    RecruitmentPage.selectFirstSuggestion();
    RecruitmentPage.clickSearch();
    cy.wait("@searchCandidate").its("response.statusCode").should("eq", 200);
    RecruitmentPage.recordsFoundText.should("be.visible");
  });

  it("REC_03 - Search candidate tanpa memilih saran autocomplete tampil pesan Invalid", () => {
    RecruitmentPage.typeCandidateName("Mia");
    cy.wait(2500);
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as("searchCandidate");
    RecruitmentPage.clickSearch();
    RecruitmentPage.invalidMessage.should("be.visible");
    cy.get("@searchCandidate.all").should("have.length", 0);
  });

  it("REC_04 - Filter berdasarkan Job Title menampilkan hasil sesuai", () => {
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as("searchByJobTitle");
    RecruitmentPage.selectJobTitle("Software Engineer");
    RecruitmentPage.clickSearch();
    cy.wait("@searchByJobTitle").its("response.statusCode").should("eq", 200);
    RecruitmentPage.recordsFoundText.should("be.visible");
  });

  it("REC_05 - Klik Reset mengembalikan filter ke kondisi awal dan memuat ulang data", () => {
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as("searchWithFilter");
    RecruitmentPage.selectStatus("Rejected");
    RecruitmentPage.clickSearch();
    cy.wait("@searchWithFilter");

    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as("resetSearch");
    RecruitmentPage.clickReset();
    cy.wait("@resetSearch").its("response.statusCode").should("eq", 200);
    RecruitmentPage.statusDropdown.should("contain.text", "-- Select --");
  });

  it("REC_06 - Halaman awal menampilkan jumlah Records Found lebih dari 0", () => {
    cy.intercept("GET", "**/api/v2/recruitment/candidates**").as("initialLoad");
    RecruitmentPage.visit();
    cy.wait("@initialLoad").its("response.statusCode").should("eq", 200);
    RecruitmentPage.recordsFoundText.should("be.visible").and("not.contain.text", "(0)");
  });

  it("REC_07 - Klik tombol Add menampilkan halaman Add Candidate", () => {
    RecruitmentPage.clickAdd();
    cy.url().should("include", "/recruitment/addCandidate");
  });

  it("REC_08 - Klik ikon View pada salah satu baris menampilkan detail kandidat", () => {
    cy.intercept("GET", "**/api/v2/recruitment/candidates/*").as("candidateDetail");
    RecruitmentPage.clickFirstViewIcon();
    cy.wait("@candidateDetail").its("response.statusCode").should("eq", 200);
    cy.url().should("include", "/recruitment/addCandidate");
  });
});