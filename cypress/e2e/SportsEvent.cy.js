import CONSTANTS from "../../src/constants";
import { LOCATORS } from "../support/locators";
describe('Sports Events Dashboard', () => {
    beforeEach(() => {
        cy.intercept(CONSTANTS.API_URL, { fixture: 'SportsEvents.json' }).as("sportsEvents");
        cy.visit('/');
    });

    it('Should load Sports Events Dashboard', () => {
        // Check the initial state of Sports Events Dashboard Dashboard
        cy.get(LOCATORS.LOADER).should('exist');
        cy.wait('@sportsEvents')
        cy.contains("All Events");
        cy.get(LOCATORS.ALL_EVENTS_CONTAINER).children().should('have.length',3);
        cy.contains("Selected Events");
        cy.get(LOCATORS.EMPTY_RESULTS_CONTAINER).should('exist');
    })
    it('Should have different categories with cards', () => {
        cy.wait('@sportsEvents')
        // Check sports event category and its children
        cy.contains("Swimming").should('exist');
        cy.contains("Athletics").should('exist');
        cy.contains("Boxing").should('exist');
        cy.get(LOCATORS.EVENTS_TILE_CONTAINER).children().should('have.length', 10);
    });
    it('Should test if search works correctly', () => {
        cy.wait('@sportsEvents');
        // Happy Path scenario of search
        cy.get(LOCATORS.SEARCH_BAR).type('Weight');
        cy.get(LOCATORS.CATEGORY_CONTAINER).children().should('have.length', 3);
        // When search has leading/trailing spaces, it should work as expected
        cy.get(LOCATORS.SEARCH_BAR).clear().type('   Weight   ');
        cy.get(LOCATORS.CATEGORY_CONTAINER).children().should('have.length', 3);
        //Negative scenario when your search does not match any of the event's name
        cy.get(LOCATORS.SEARCH_BAR).clear().type('Lorem Ipsum');
        cy.contains('No events found!!')
    });
    it('Should be able to select and deselect events without any issues', () => {
        cy.wait('@sportsEvents');
        // Select event and see if its moved to selected events container
        cy.get(LOCATORS.EVENT_BUTTON).should('have.text', 'Select');
        cy.get(LOCATORS.EVENT_BUTTON).click();
        cy.get(LOCATORS.SELECTED_RESULTS_CONTAINER).children().should('have.length', 1);
        cy.get(LOCATORS.EVENT_BUTTON).should('have.text', 'Remove');
        cy.get(LOCATORS.EVENT_CONTAINER_DISABLED).should('have.length',2);
        // remove selected event back to where it was
        cy.get(LOCATORS.EVENT_BUTTON).click();
        cy.get(LOCATORS.EVENT_BUTTON).should('have.text', 'Select');
        cy.get(LOCATORS.EMPTY_RESULTS_CONTAINER).should('exist');
    });
    it('Should trigger error toast on more than 3 events selection', () => {
        cy.get(LOCATORS.EVENT_BUTTON).click();
        cy.get(LOCATORS.EVENT_BUTTON_ATHLETICS).click();
        cy.get(LOCATORS.EVENT_BUTTON_BOXING).click();
        cy.get(LOCATORS.EVENT_BUTTON_SWIMMING).click();
        cy.get(LOCATORS.TOAST).should('have.text', "Can't select more than 3 events")
    });
})