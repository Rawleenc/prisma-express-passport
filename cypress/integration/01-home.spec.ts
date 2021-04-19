describe('Tests for home page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('420 is bigger than 69', () => {
    expect(420).to.greaterThan(69);
  });

  it('page should have navbar elements', () => {
    cy.get('.navbar-brand').contains('GraphQL API is more fun than REST API');
    cy.get('.navbar').contains('Home');
    cy.get('.navbar').contains('Posts');
    cy.get('.navbar').contains('Users');
  });

  it('page should have introduction test', () => {
    cy.get('.jumbotron > p').should('be.visible');

    cy.get('.jumbotron > p').contains('Hello and welcome. This API is built up of the following: Users and Posts.');
  });

  it('page should have buttons', () => {
    cy.get('.btn-info').contains('Click here to register');
    cy.get('.btn-primary').contains('Click here to log in');
  });

  it('Register navigates to register page', () => {
    cy.get('.btn-info').contains('Click here to register');
    cy.get('.btn-info').click();
    cy.url().should('include', 'register');
  });

  it('Login navigates to login page', () => {
    cy.get('.btn-primary').contains('Click here to log in');
    cy.get('.btn-primary').click();
    cy.url().should('include', 'login');
  });
});

export default {};
