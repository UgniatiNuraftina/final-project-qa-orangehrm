import LoginPage from "../support/pages/LoginPage";

describe("Fitur Login - OrangeHRM (dengan cy.intercept)", () => {
  let data;

  before(() => {
    cy.fixture("loginData").then((fixtureData) => {
      data = fixtureData;
    });
  });

  beforeEach(() => {
    LoginPage.visit();
  });

  it("TC_LOGIN_01 - Login valid, intercept POST /auth/validate berhasil (redirect ke dashboard)", () => {
    cy.intercept("POST", "**/auth/validate").as("loginValid");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@loginValid").its("response.statusCode").should("eq", 302);
    cy.url().should("include", "/dashboard/index");
    LoginPage.dashboardHeader.should("be.visible");
  });

  it("TC_LOGIN_02 - Username tidak terdaftar, intercept POST /auth/validate tetap di halaman login", () => {
    cy.intercept("POST", "**/auth/validate").as("loginUnregistered");
    LoginPage.login(data.unregisteredUsername, data.validUser.password);
    cy.wait("@loginUnregistered").its("response.statusCode").should("eq", 302);
    cy.url().should("include", "/auth/login");
    LoginPage.errorAlert.should("be.visible").and("contain.text", "Invalid credentials");
  });

  it("TC_LOGIN_03 - Password salah, intercept POST /auth/validate tetap di halaman login", () => {
    cy.intercept("POST", "**/auth/validate").as("loginWrongPassword");
    LoginPage.login(data.validUser.username, data.wrongPassword);
    cy.wait("@loginWrongPassword").its("response.statusCode").should("eq", 302);
    cy.url().should("include", "/auth/login");
    LoginPage.errorAlert.should("be.visible").and("contain.text", "Invalid credentials");
  });

  it("TC_LOGIN_04 - Username kosong, intercept memastikan request TIDAK terkirim", () => {
    cy.intercept("POST", "**/auth/validate").as("loginEmptyUsername");
    LoginPage.fillPassword(data.validUser.password);
    LoginPage.clickLogin();
    cy.get("@loginEmptyUsername.all").should("have.length", 0);
    LoginPage.requiredFieldMessages.should("have.length", 1).and("contain.text", "Required");
  });

  it("TC_LOGIN_05 - Password kosong, intercept memastikan request TIDAK terkirim", () => {
    cy.intercept("POST", "**/auth/validate").as("loginEmptyPassword");
    LoginPage.fillUsername(data.validUser.username);
    LoginPage.clickLogin();
    cy.get("@loginEmptyPassword.all").should("have.length", 0);
    LoginPage.requiredFieldMessages.should("have.length", 1).and("contain.text", "Required");
  });

  it("TC_LOGIN_06 - Kedua field kosong, intercept memastikan request TIDAK terkirim", () => {
    cy.intercept("POST", "**/auth/validate").as("loginBothEmpty");
    LoginPage.clickLogin();
    cy.get("@loginBothEmpty.all").should("have.length", 0);
    LoginPage.requiredFieldMessages.should("have.length", 2);
  });

  it("TC_LOGIN_09 - Username huruf kapital, intercept memvalidasi response konsisten", () => {
    cy.intercept("POST", "**/auth/validate").as("loginUpperCase");
    LoginPage.login(data.usernameUpperCase, data.validUser.password);
    cy.wait("@loginUpperCase").its("response.statusCode").should("eq", 302);
    cy.url().then((url) => {
      if (url.includes("/dashboard/index")) {
        LoginPage.dashboardHeader.should("be.visible");
      } else {
        cy.url().should("include", "/auth/login");
        LoginPage.errorAlert.should("be.visible").and("contain.text", "Invalid credentials");
      }
    });
  });

  it("TC_LOGIN_12 - Forgot Password, intercept GET halaman reset password", () => {
    cy.intercept("GET", "**/auth/requestPasswordResetCode").as("resetPasswordPage");
    LoginPage.forgotPasswordLink.click();
    cy.wait("@resetPasswordPage").its("response.statusCode").should("eq", 200);
    LoginPage.resetPasswordTitle.should("be.visible");
  });
});