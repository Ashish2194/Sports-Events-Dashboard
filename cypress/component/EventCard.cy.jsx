import EventCard from "../../src/components/common/EventCard/EventCard";
import { LOCATORS } from "../support/locators";
describe('EventCard.cy.jsx', () => {

  beforeEach(()=>{
    cy.viewport("macbook-16")
  });

  it('should load event card with props', () => {
    const onClickSpy = cy.spy().as('onClickSpy')
    cy.mount(<EventCard
        id={1}
        category={"Swimming"}
        name={"Butterfly 100M"}
        startTime={"2022-12-17 13:00:00"}
        endTime={"2022-12-17 14:00:00"}
        onEventClick={onClickSpy}
        type={"Select"}
        disabled={false}
      />);
      cy.get(LOCATORS.EVENT_CARD_ABBREVIATION).should('have.text', "S")
      cy.get(LOCATORS.EVENT_CARD_TITLE).should('have.text', "Butterfly 100M")
      cy.get(LOCATORS.EVENT_CARD_CATEGORY).should('have.text', "(Swimming)")
      cy.get(LOCATORS.EVENT_CARD_TIME).should('have.text', "13PM - 14PM")
      cy.get(LOCATORS.EVENT_BUTTON).click()
      cy.get('@onClickSpy').should('have.been.called')
  });
  it('Should text the card in disabled state', () => {
    const onClickSpy = cy.spy().as('onClickSpy')
    cy.mount(<EventCard
        id={1}
        category={"Swimming"}
        name={"Butterfly 100M"}
        startTime={"2022-12-17 13:00:00"}
        endTime={"2022-12-17 14:00:00"}
        onEventClick={onClickSpy}
        type={"Select"}
        disabled
      />);
      cy.get(LOCATORS.EVENT_BUTTON).should('be.disabled')
  });
})