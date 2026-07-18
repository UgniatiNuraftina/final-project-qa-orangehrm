import './commands'

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Network Error') || err.message.includes('timeout')) {
    return false;
  }
  return true;
});