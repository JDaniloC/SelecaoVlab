// Custom commands can be added here
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command declarations here
      // Example: login(email: string, password: string): Chainable<void>
    }
  }
}

export {};
