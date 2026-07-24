import DirectoryPage from "../support/pages/DirectoryPage";
import LoginPage from "../support/pages/LoginPage";

describe("Fitur Directory - OrangeHRM (POM + intercept)", () => {
  beforeEach(() => {
    const loginAlias = LoginPage.interceptLogin();
    LoginPage.visit();
    LoginPage.login("Admin", "admin123");
    cy.wait(`@${loginAlias}`);
    DirectoryPage.visit();
  });

  it("DIR_01 - Search employee dengan memilih saran autocomplete yang valid", () => {
    DirectoryPage.typeEmployeeName("Ranga");
    const alias = DirectoryPage.interceptSearch();
    DirectoryPage.selectFirstSuggestion();
    DirectoryPage.clickSearch();
    DirectoryPage.verifySearchSuccess(alias);
  });

  it("DIR_02 - Search employee tanpa memilih saran autocomplete tampil pesan Invalid", () => {
    DirectoryPage.typeEmployeeName("Ranga");
    cy.wait(2500);
    const alias = DirectoryPage.interceptSearch();
    DirectoryPage.clickSearch();
    DirectoryPage.verifyInvalidNoRequest(alias);
  });

  it("DIR_03 - Filter berdasarkan Job Title menampilkan hasil sesuai", () => {
    const alias = DirectoryPage.interceptSearch();
    DirectoryPage.selectJobTitle("Chief Executive Officer");
    DirectoryPage.clickSearch();
    DirectoryPage.verifySearchSuccess(alias);
  });

  it("DIR_04 - Filter berdasarkan Location menampilkan hasil sesuai", () => {
    const alias = DirectoryPage.interceptSearch();
    DirectoryPage.selectLocation("Texas R&D");
    DirectoryPage.clickSearch();
    DirectoryPage.verifySearchSuccess(alias);
  });

  it("DIR_05 - Kombinasi filter Job Title dan Location", () => {
    const alias = DirectoryPage.interceptSearch();
    DirectoryPage.selectJobTitle("Chief Executive Officer");
    DirectoryPage.selectLocation("HQ - CA, USA");
    DirectoryPage.clickSearch();
    DirectoryPage.verifySearchSuccess(alias);
  });

  it("DIR_06 - Klik Reset mengembalikan filter ke kondisi awal", () => {
    const searchAlias = DirectoryPage.interceptSearch();
    DirectoryPage.selectJobTitle("Chief Executive Officer");
    DirectoryPage.clickSearch();
    cy.wait(`@${searchAlias}`);

    const resetAlias = DirectoryPage.interceptReset();
    DirectoryPage.clickReset();
    DirectoryPage.verifyResetSuccess(resetAlias);
  });

  it("DIR_07 - Halaman awal menampilkan jumlah Records Found lebih dari 0", () => {
    const alias = DirectoryPage.interceptSearch();
    DirectoryPage.visit();
    DirectoryPage.verifyInitialLoad(alias);
  });

  it("DIR_08 - Klik salah satu card karyawan menampilkan halaman profil", () => {
    const alias = DirectoryPage.interceptEmployeeDetail();
    DirectoryPage.clickFirstEmployeeCard();
    DirectoryPage.verifyEmployeeDetailLoaded(alias);
  });
});