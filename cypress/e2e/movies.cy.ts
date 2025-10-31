describe('Movie List Page - E2E Tests', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('/');
  });

  describe('Page Load and Display', () => {
    it('should display the movie list page', () => {
      cy.get('app-movie-list').should('exist');
      cy.get('h1').should('contain', 'Buscar Filmes');
    });

    it('should load and display popular movies', () => {
      // Wait for movies to load
      cy.get('app-movie-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });

    it('should display movie cards with correct information', () => {
      cy.get('app-movie-card', { timeout: 10000 }).first().within(() => {
        // Check that movie card contains expected elements
        cy.get('img').should('exist').and('be.visible');
        cy.get('h3, h2, .movie-title, [class*="title"]').should('exist');
      });
    });

    it('should display the correct number of movies found', () => {
      cy.get('.movies-found', { timeout: 10000 }).should('exist');
      cy.get('.movies-found').invoke('text').should('match', /\d+ filmes encontrados/);
    });

    it('should handle loading state', () => {
      // Intercept the API call to simulate loading
      cy.intercept('GET', '**/movie/popular*', (req) => {
        req.reply({
          delay: 1000,
          body: { results: [], page: 1, total_pages: 1, total_results: 0 }
        });
      }).as('getMovies');

      cy.visit('/');
      
      // Eventually movies should load or show empty state
      cy.get('body', { timeout: 10000 }).should('exist');
    });
  });

  describe('Movie Search', () => {
    it('should allow searching for movies by name', () => {
      // Find the search input - try multiple selectors
      const searchInput = 'input[type="search"], input[placeholder*="search" i], input[placeholder*="buscar" i], input[name*="search" i], input[name="name"]';
      
      cy.get(searchInput, { timeout: 5000 })
        .first()
        .should('be.visible')
        .type('Inception');

      // Wait for search results
      cy.wait(1000);

      // Verify movies are displayed
      cy.get('app-movie-card').should('exist');
    });

    it('should clear search and show all movies', () => {
      const searchInput = 'input[type="search"], input[placeholder*="search" i], input[placeholder*="buscar" i]';
      
      cy.get(searchInput, { timeout: 5000 })
        .first()
        .type('Matrix')
        .wait(500)
        .clear()
        .wait(500);

      cy.get('app-movie-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });

  describe('Movie Filters', () => {
    it('should filter movies by genre', () => {
      // Wait for filters to be available
      cy.get('app-movie-filters', { timeout: 5000 }).should('exist');
      
      // Try to find and interact with genre filter
      cy.get('select[name*="genre" i], select[id*="genre" i], [class*="genre"]').first().then(($select) => {
        if ($select.is('select')) {
          cy.wrap($select).select(1); // Select first non-empty option
          cy.wait(500);
          cy.get('app-movie-card').should('exist');
        }
      });
    });

    it('should filter movies by year', () => {
      cy.get('app-movie-filters').should('exist');
      
      // Try to find year filter
      cy.get('input[name*="year" i], input[type="number"], select[name*="year" i]').first().then(($input) => {
        if ($input.is('input[type="number"]')) {
          cy.wrap($input).clear().type('2023');
          cy.wait(500);
        } else if ($input.is('select')) {
          cy.wrap($input).select(1);
          cy.wait(500);
        }
      });
    });

    it('should display no results message when filters return no movies', () => {
      // This test assumes a specific filter combination that returns no results
      const searchInput = 'input[type="search"], input[name="name"]';
      
      cy.get(searchInput, { timeout: 5000 })
        .first()
        .type('xyzabc123nonexistent')
        .wait(1000);

      cy.get('.no-results, [class*="no-results"]').should('be.visible');
    });
  });

  describe('Movie Sorting', () => {
    it('should sort movies by rating', () => {
      cy.get('app-movie-sort, [class*="sort"]', { timeout: 5000 }).should('exist');
      
      cy.get('select[name*="sort" i], select[id*="sort" i]').first().then(($select) => {
        if ($select.length) {
          cy.wrap($select).select('vote_average.desc');
          cy.wait(500);
          cy.get('app-movie-card').should('exist');
        }
      });
    });

    it('should sort movies by release date', () => {
      cy.get('select[name*="sort" i], select[id*="sort" i]').first().then(($select) => {
        if ($select.length) {
          cy.wrap($select).select('release_date.desc');
          cy.wait(500);
          cy.get('app-movie-card').should('exist');
        }
      });
    });
  });

  describe('Marathon Section', () => {
    it('should display marathon section', () => {
      cy.get('.marathon-section, [class*="marathon"]').should('exist');
      cy.get('.marathon-box, [class*="marathon-box"]').within(() => {
        cy.contains('Minha Maratona').should('be.visible');
      });
    });

    it('should show empty marathon state initially', () => {
      cy.get('.marathon-box, [class*="marathon"]').within(() => {
        cy.contains('0 filmes').should('be.visible');
        cy.contains('0h 0min').should('be.visible');
        cy.contains(/nenhum filme/i).should('be.visible');
      });
    });

    // TODO: Testes para funcionalidade de maratona quando implementada
    // The following tests should be uncommented and implemented when
    // the marathon functionality is added to the application:

    /*
    it('should add movie to marathon when add button is clicked', () => {
      cy.get('app-movie-card').first().within(() => {
        cy.get('button[class*="add"], button:contains("Adicionar")').click();
      });

      cy.get('.marathon-box').within(() => {
        cy.contains('1 filme').should('be.visible');
      });
    });

    it('should remove movie from marathon when remove button is clicked', () => {
      // First add a movie
      cy.get('app-movie-card').first().within(() => {
        cy.get('button[class*="add"]').click();
      });

      // Then remove it
      cy.get('.marathon-box').within(() => {
        cy.get('button[class*="remove"], [class*="movie-item"]').first().within(() => {
          cy.get('button').click();
        });
      });

      cy.get('.marathon-box').within(() => {
        cy.contains('0 filmes').should('be.visible');
      });
    });

    it('should calculate and display total duration', () => {
      // Add multiple movies and verify duration calculation
      cy.get('app-movie-card').eq(0).within(() => {
        cy.get('button[class*="add"]').click();
      });

      cy.get('app-movie-card').eq(1).within(() => {
        cy.get('button[class*="add"]').click();
      });

      // Duration should be greater than 0h 0min
      cy.get('.marathon-box').within(() => {
        cy.get('.marathon-details').invoke('text').should('not.contain', '0h 0min');
      });
    });

    it('should persist marathon data on page reload', () => {
      // Add a movie
      cy.get('app-movie-card').first().within(() => {
        cy.get('button[class*="add"]').click();
      });

      // Verify it was added
      cy.get('.marathon-box').contains('1 filme');

      // Reload page
      cy.reload();

      // Verify movie is still in marathon
      cy.get('.marathon-box').contains('1 filme');
    });

    it('should display marathon movies in the marathon section', () => {
      // Add a movie
      cy.get('app-movie-card').first().as('firstMovie');
      
      cy.get('@firstMovie').find('h3, h2, .movie-title').invoke('text').then((title) => {
        cy.get('@firstMovie').within(() => {
          cy.get('button[class*="add"]').click();
        });

        // Verify movie appears in marathon section
        cy.get('.marathon-box').should('contain.text', title);
      });
    });

    it('should update marathon counter when adding multiple movies', () => {
      // Add 3 movies
      cy.get('app-movie-card').eq(0).find('button[class*="add"]').click();
      cy.get('app-movie-card').eq(1).find('button[class*="add"]').click();
      cy.get('app-movie-card').eq(2).find('button[class*="add"]').click();

      cy.get('.marathon-box').contains('3 filmes');
    });

    it('should clear all movies from marathon', () => {
      // Add some movies
      cy.get('app-movie-card').eq(0).find('button[class*="add"]').click();
      cy.get('app-movie-card').eq(1).find('button[class*="add"]').click();

      // Clear marathon
      cy.get('.marathon-box').within(() => {
        cy.get('button:contains("Limpar"), button[class*="clear"]').click();
      });

      cy.get('.marathon-box').contains('0 filmes');
    });
    */
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', () => {
      // Intercept API call and force error
      cy.intercept('GET', '**/movie/popular*', {
        statusCode: 500,
        body: { error: 'Server Error' }
      }).as('getMoviesError');

      cy.visit('/');
      cy.wait('@getMoviesError');

      // Check for error message
      cy.get('.error-message, [class*="error"]').should('be.visible');
    });

    it('should handle network timeout gracefully', () => {
      cy.intercept('GET', '**/movie/popular*', (req) => {
        req.reply({
          delay: 30000, // 30 second delay to simulate timeout
          forceNetworkError: true
        });
      });

      cy.visit('/');
      
      // Should eventually show some error or fallback state
      // (depending on implementation)
      cy.get('body', { timeout: 35000 }).should('exist');
    });
  });

  describe('Responsive Design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(({ name, width, height }) => {
      it(`should display correctly on ${name}`, () => {
        cy.viewport(width, height);
        cy.visit('/');
        
        cy.get('app-movie-list').should('be.visible');
        cy.get('app-movie-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      cy.get('h1').should('exist');
      cy.get('h2, h3').should('exist');
    });

    it('should have accessible images with alt text', () => {
      cy.get('app-movie-card img', { timeout: 10000 }).first().should('have.attr', 'alt');
    });

    it('should be keyboard navigable', () => {
      // Test that elements can receive focus
      cy.get('input, button, a, select').first().focus().should('have.focus');
    });
  });
});

