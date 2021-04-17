describe('Tests for navigation bar', () => {
  it('Navigation bar navigates to posts', () => {
    cy.visit('http://localhost:3000');

    cy.get('.navbar').contains('Posts');
    cy.get('.navbar').get('li > a').eq(1).click();

    cy.url().should('include', 'posts');

    cy.visit('http://localhost:3000');
  });

  it('Navigation bar navigates to users', () => {
    cy.get('.navbar').contains('Users');
    cy.get('.navbar').get('li > a').eq(2).click();

    cy.url().should('include', 'users');

    cy.visit('http://localhost:3000');
  });
});

export default {};
