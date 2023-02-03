import EmptyResults from "../../src/components/common/EmptyResults/EmptyResults";
import { LOCATORS } from "../support/locators";
describe('EmptyResults.cy.jsx', () => {

  beforeEach(()=>{
    cy.viewport("macbook-16")
  });

  it('should load EmptyResults component with props', () => {
    cy.mount(<EmptyResults
            message={"No results found!!"}
        />);
    cy.get(LOCATORS.EMPTY_RESULTS).should('have.text', 'No results found!!')
  });
})