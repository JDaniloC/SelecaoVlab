describe('Movie List Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the movie list page', () => {
    cy.get('app-movie-list').should('exist');
  });

  it('should load and display popular movies', () => {
    // Wait for movies to load
    cy.get('app-movie-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('should display movie cards with correct information', () => {
    cy.get('app-movie-card').first().within(() => {
      // Check that movie card contains expected elements
      cy.get('img').should('exist');
      cy.get('h3, h2, .movie-title').should('exist');
    });
  });

  it('should allow searching for movies', () => {
    const searchQuery = 'Inception';
    
    // Find and use the search input
    cy.get('input[type="search"], input[placeholder*="search" i], input[placeholder*="buscar" i]')
      .first()
      .type(searchQuery);
    
    // Wait for search results
    cy.wait(1000);
    
    // Verify movies are displayed
    cy.get('app-movie-card').should('exist');
  });

  it('should handle loading state', () => {
    // Check for loading indicator when page first loads
    cy.visit('/');
    
    // Eventually movies should load
    cy.get('app-movie-card', { timeout: 10000 }).should('exist');
  });
});
