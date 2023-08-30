import { createTask } from './TaskSpec.cy';

describe('Task details spec', () => {
  before(() => {
    cy.login(Cypress.env('ims_username'), Cypress.env('ims_password'));
    createTask('Test task cypress', 'Test task cypress');
  });

  it('displays the task details page', () => {
    cy.visit('/dashboard/tasks/all');
    cy.get('.task-list', { timeout: 5000 })
      .should('be.visible')
      .find('a.task-details-link')
      .first()
      .click();
    cy.injectAxe();
    cy.checkPageA11y();
  });
});
