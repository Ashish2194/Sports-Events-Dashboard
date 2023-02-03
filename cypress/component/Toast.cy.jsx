import Toast from '../../src/components/common/Toast/Toast';
import { LOCATORS } from "../support/locators";
describe('Toast.cy.jsx', () => {

  beforeEach(()=>{
    cy.viewport("macbook-16")
  });
  it('Should render Toast Component with props', () => {
    const onClickSpy = cy.spy().as('onClickSpy')
    cy.mount(<Toast
            message={"I am error toast"}
            type="error"
            onDismiss={onClickSpy}
        />)
    cy.get(LOCATORS.TOAST).should('exist');
  });
})