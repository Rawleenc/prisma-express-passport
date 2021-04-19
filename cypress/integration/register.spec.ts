import { Responses } from './../../src/utils/constants';

describe('Tests for Register', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('page should have navbar elements', () => {
    cy.get('.navbar-brand').contains('GraphQL API is more fun than REST API');
    cy.get('.navbar').contains('Home');
    cy.get('.navbar').contains('Posts');
    cy.get('.navbar').contains('Users');
  });

  it('page should have register form', () => {
    cy.get('.form-group').should('be.visible');
  });

  it('page should have buttons', () => {
    cy.get('.btn-outline-info').contains('Click here to go back');
    cy.get('.btn-primary').contains('Sign up');
  });

  it('Fail to register without email', () => {
    cy.fixture('user').then((user: { email: string; password: string; displayName: string }) => {
      cy.get(':nth-child(2) > .form-control').type(user.password);
      cy.get(':nth-child(3) > .form-control').type(user.displayName);

      cy.get('.btn-primary').click();

      cy.get('pre').contains('not allowed to be empty');
    });
  });

  it('Fail to register with password too short', () => {
    cy.fixture('user').then((user: { email: string; password: string; displayName: string }) => {
      cy.get(':nth-child(1) > .form-control').type(user.email);
      cy.get(':nth-child(2) > .form-control').type('12345');
      cy.get(':nth-child(3) > .form-control').type(user.displayName);

      cy.get('.btn-primary').click();

      cy.get('pre').contains('length must be at least 6 characters long');
    });
  });

  // TODO reimplement
  it('Register succesfully', () => {
    cy.fixture('user').then((user: { email: string; password: string; displayName: string }) => {
      cy.get(':nth-child(1) > .form-control').type(user.email);
      cy.get(':nth-child(2) > .form-control').type(user.password);
      cy.get(':nth-child(3) > .form-control').type(user.displayName);

      cy.get('.btn-primary').click();

      cy.url().should('include', 'login');
    });
  });

  it('Fail to register with the same user twice', () => {
    cy.fixture('user').then((user: { email: string; password: string; displayName: string }) => {
      cy.get(':nth-child(1) > .form-control').type(user.email);
      cy.get(':nth-child(2) > .form-control').type(user.password);
      cy.get(':nth-child(3) > .form-control').type(user.displayName);

      cy.get('.btn-primary').click();

      cy.get('pre').contains(Responses.unable_to_perform('add', 'user'));
    });
  });
});

export default {};
