import LoginPage from "../support/pages/LoginPage";

describe("Fitur Login - OrangeHRM (POM + intercept)", () => {
  let data;

  before(() => {
    cy.fixture("loginData").then((fixtureData) => { data = fixtureData; });
  });

  beforeEach(() => {
    LoginPage.visit();
  });

  it("TC_LOGIN_01 - Login dengan kredensial valid", () => {
    const alias = LoginPage.interceptLogin();
    LoginPage.login(data.validUser.username, data.validUser.password);
    LoginPage.verifyLoginSuccess(alias);
  });

  it("TC_LOGIN_02 - Login dengan username tidak terdaftar", () => {
    const alias = LoginPage.interceptLogin();
    LoginPage.login(data.unregisteredUsername, data.validUser.password);
    LoginPage.verifyLoginFailed(alias);
  });

  it("TC_LOGIN_03 - Login dengan password salah", () => {
    const alias = LoginPage.interceptLogin();
    LoginPage.login(data.validUser.username, data.wrongPassword);
    LoginPage.verifyLoginFailed(alias);
  });

  it("TC_LOGIN_04 - Login dengan field Username kosong", () => {
    LoginPage.fillPassword(data.validUser.password);
    LoginPage.clickLogin();
    LoginPage.verifyRequiredField(1);
  });

  it("TC_LOGIN_05 - Login dengan field Password kosong", () => {
    LoginPage.fillUsername(data.validUser.username);
    LoginPage.clickLogin();
    LoginPage.verifyRequiredField(1);
  });

  it("TC_LOGIN_06 - Login dengan kedua field kosong", () => {
    LoginPage.clickLogin();
    LoginPage.verifyRequiredField(2);
  });

  it("TC_LOGIN_07 - Login dengan input melebihi 100+ karakter", () => {
    LoginPage.fillUsername(data.longString);
    LoginPage.fillPassword(data.longString);
    LoginPage.clickLogin();
    LoginPage.verifyPageStillIntact();
  });

  it("TC_LOGIN_08 - Verifikasi navigasi link Forgot Password", () => {
    const alias = LoginPage.interceptForgotPassword();
    LoginPage.forgotPasswordLink.click();
    LoginPage.verifyForgotPasswordPage(alias);
  });
});