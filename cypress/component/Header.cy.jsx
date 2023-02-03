
import Header from "../../src/components/common/Header/Header";
import { LOCATORS } from "../support/locators";
describe('Header.cy.jsx', () => {

  beforeEach(()=>{
    cy.viewport("macbook-16")
  });

  it('should load Header Component with props', () => {
    cy.mount(
    <Header 
        title={"All Events"}
        hasSearchBar
    />);
    cy.contains("All Events").should('exist');
  });
  it('should not have searchbar when hasSearchBar is false', () => {
    cy.mount(
    <Header 
        title={"All Events"}
        hasSearchBar={false}
    />);
    cy.get(LOCATORS.SEARCH_BAR).should('not.exist')
  });
})