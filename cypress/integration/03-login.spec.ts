describe('Tests for Login', () => {
  before(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('page should have navbar elements', () => {
    cy.get('.navbar-brand').contains('GraphQL API is more fun than REST API');
    cy.get('.navbar').contains('Home');
    cy.get('.navbar').contains('Posts');
    cy.get('.navbar').contains('Users');
  });

  it('page should have login form', () => {
    cy.get('.form-group').should('be.visible');
  });

  it('page should have buttons', () => {
    cy.get('.btn-outline-info').contains('Click here to go back');
    cy.get('.btn-primary').contains('Sign in');
  });

  it('Fail to login without email', () => {
    cy.fixture('user').then((user: { email: string; password: string }) => {
      cy.get(':nth-child(2) > .form-control').type(user.password);

      cy.get('.btn-primary').click();

      cy.get('.form-group').should('be.visible');
    });
  });

  //   it('Fail to login with incorrect password', () => {
  //     cy.fixture('user').then((user: { email: string; password: string; displayName: string }) => {
  //       cy.get(':nth-child(1) > .form-control').type(user.email);
  //       cy.get(':nth-child(2) > .form-control').type('12345');
  //       cy.get(':nth-child(3) > .form-control').type(user.displayName);

  //       cy.get('.btn-primary').click();

  //       cy.get('pre').contains('length must be at least 6 characters long');
  //     });
  //   });

  // TODO reimplement
  it('Login succesfully', () => {
    cy.fixture('user').then((user: { email: string; password: string; displayName: string }) => {
      cy.get(':nth-child(1) > .form-control').type(user.email);
      cy.get(':nth-child(2) > .form-control').type(user.password);

      cy.get('.btn-primary').click();

      cy.url().should('include', 'profile');
    });
  });
});

export default {};
