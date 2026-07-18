class LoginPage {
  visit() {
    cy.visit("/web/index.php/auth/login");
  }

  get usernameInput() {
    return cy.get('input[name="username"]');
  }

  get passwordInput() {
    return cy.get('input[name="password"]');
  }

  get loginButton() {
    return cy.get('button[type="submit"]');
  }

  get forgotPasswordLink() {
    return cy.get("p.orangehrm-login-forgot-header");
  }

  get requiredFieldMessages() {
    return cy.get(".oxd-input-group .oxd-input-field-error-message");
  }

  get errorAlert() {
    return cy.get(".oxd-alert-content-text");
  }

  get dashboardHeader() {
    return cy.get(".oxd-topbar-header-breadcrumb-module");
  }

  get resetPasswordTitle() {
    return cy.get(".orangehrm-forgot-password-title");
  }

  get footerLink() {
    return cy.get('a[href="http://www.orangehrm.com"]');
  }

  fillUsername(username) {
    this.usernameInput.clear().type(username);
    return this;
  }

  fillPassword(password) {
    this.passwordInput.clear().type(password);
    return this;
  }

  clickLogin() {
    this.loginButton.click();
    return this;
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
    return this;
  }
}

export default new LoginPage();