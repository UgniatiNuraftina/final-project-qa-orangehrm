class LoginPage {
  visit() {
    cy.visit("/web/index.php/auth/login");
  }

  get usernameInput() { return cy.get('input[name="username"]'); }
  get passwordInput() { return cy.get('input[name="password"]'); }
  get loginButton() { return cy.get('button[type="submit"]'); }
  get forgotPasswordLink() { return cy.get("p.orangehrm-login-forgot-header"); }
  get requiredFieldMessages() { return cy.get(".oxd-input-group .oxd-input-field-error-message"); }
  get errorAlert() { return cy.get(".oxd-alert-content-text"); }
  get dashboardHeader() { return cy.get(".oxd-topbar-header-breadcrumb-module"); }
  get resetPasswordTitle() { return cy.get(".orangehrm-forgot-password-title"); }

  interceptLogin(alias = "loginRequest") {
    cy.intercept("POST", "**/auth/validate").as(alias);
    return alias;
  }

  interceptForgotPassword(alias = "resetPasswordPage") {
    cy.intercept("GET", "**/auth/requestPasswordResetCode").as(alias);
    return alias;
  }

  fillUsername(username) { this.usernameInput.clear().type(username); return this; }
  fillPassword(password) { this.passwordInput.clear().type(password); return this; }
  clickLogin() { this.loginButton.click(); return this; }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
    return this;
  }

  verifyLoginSuccess(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 302);
    cy.url().should("include", "/dashboard/index");
    this.dashboardHeader.should("be.visible");
    return this;
  }

  verifyLoginFailed(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 302);
    cy.url().should("include", "/auth/login");
    this.errorAlert.should("be.visible").and("contain.text", "Invalid credentials");
    return this;
  }

  verifyRequiredField(count) {
    this.requiredFieldMessages.should("have.length", count).and("contain.text", "Required");
    return this;
  }

  verifyForgotPasswordPage(alias) {
    cy.wait(`@${alias}`).its("response.statusCode").should("eq", 200);
    this.resetPasswordTitle.should("be.visible");
    return this;
  }

  verifyPageStillIntact() {
    cy.get("body").should("be.visible");
    return this;
  }
}

export default new LoginPage();