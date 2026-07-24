import RecruitmentPage from "../support/pages/RecruitmentPage";
import LoginPage from "../support/pages/LoginPage";

describe("Fitur Recruitment - OrangeHRM (POM + intercept)", () => {
  beforeEach(() => {
    const loginAlias = LoginPage.interceptLogin();
    LoginPage.visit();
    LoginPage.login("Admin", "admin123");
    cy.wait(`@${loginAlias}`);
    RecruitmentPage.visit();
  });

  it("REC_01 - Filter berdasarkan Status Shortlisted menampilkan hasil sesuai", () => {
    const alias = RecruitmentPage.interceptSearch();
    RecruitmentPage.selectStatus("Shortlisted");
    RecruitmentPage.clickSearch();
    RecruitmentPage.verifySearchSuccess(alias);
  });

  it("REC_02 - Search candidate dengan memilih saran autocomplete yang valid", () => {
    RecruitmentPage.typeCandidateName("Mia");
    const alias = RecruitmentPage.interceptSearch();
    RecruitmentPage.selectFirstSuggestion();
    RecruitmentPage.clickSearch();
    RecruitmentPage.verifySearchSuccess(alias);
  });

  it("REC_03 - Search candidate tanpa memilih saran autocomplete tampil pesan Invalid", () => {
    RecruitmentPage.typeCandidateName("Mia");
    cy.wait(2500);
    const alias = RecruitmentPage.interceptSearch();
    RecruitmentPage.clickSearch();
    RecruitmentPage.verifyInvalidNoRequest(alias);
  });

  it("REC_04 - Filter berdasarkan Job Title menampilkan hasil sesuai", () => {
    const alias = RecruitmentPage.interceptSearch();
    RecruitmentPage.selectJobTitle("Software Engineer");
    RecruitmentPage.clickSearch();
    RecruitmentPage.verifySearchSuccess(alias);
  });

  it("REC_05 - Klik Reset mengembalikan filter ke kondisi awal", () => {
    const searchAlias = RecruitmentPage.interceptSearch();
    RecruitmentPage.selectStatus("Rejected");
    RecruitmentPage.clickSearch();
    cy.wait(`@${searchAlias}`);

    const resetAlias = RecruitmentPage.interceptSearch("resetSearch");
    RecruitmentPage.clickReset();
    RecruitmentPage.verifyResetSuccess(resetAlias);
  });

  it("REC_06 - Halaman awal menampilkan jumlah Records Found lebih dari 0", () => {
    const alias = RecruitmentPage.interceptSearch();
    RecruitmentPage.visit();
    RecruitmentPage.verifyInitialLoad(alias);
  });

  it("REC_07 - Klik tombol Add menampilkan halaman Add Candidate", () => {
    RecruitmentPage.clickAdd();
    RecruitmentPage.verifyAddCandidatePage();
  });

  it("REC_08 - Klik ikon View pada salah satu baris menampilkan detail kandidat", () => {
    const alias = RecruitmentPage.interceptCandidateDetail();
    RecruitmentPage.clickFirstViewIcon();
    RecruitmentPage.verifyCandidateDetailLoaded(alias);
  });
});