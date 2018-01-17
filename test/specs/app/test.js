const expect = require('chai').expect

describe('Personal Portfolio App', () => {

  it('Should load with the right title', () => {
    browser.url('http://localhost:3000/')
    const actualTitle = browser.getTitle()
    expect(actualTitle).to.eql('Personal Portfolio App')
  })

  it('Should remove investment from table', () => {
    browser.url('http://localhost:3000/')
    browser.waitForExist('button',20000)
    browser.click('path:first-of-type')
    browser.waitForExist('table');
    const tableRowToBeRemoved = $('table:first-of-type tbody tr:first-child')
    const htmlOfTableRowToBeRemoved = tableRowToBeRemoved.getHTML()
    const Buttons = browser.elements('table:first-of-type tbody tr:first-child button')
    Buttons.value.forEach( (button) => {
      if(button.getText()==="Remove"){
        button.click()
      }
    })
    const htmlOfFirstTableRowAfterClick = browser.element('table:first-of-type tbody tr:first-child').getHTML()
    expect(htmlOfFirstTableRowAfterClick).to.not.eql(htmlOfTableRowToBeRemoved)
  })

  it('Should add investment to table', () => {

    const tableRowToBeEdited = $('table:first-of-type tbody tr:first-child')
    let Buttons = browser.elements('table:first-of-type tbody tr:first-child button')

    // 1. Get edit button and click it
    Buttons.value.forEach( (button) => {
      if(button.getText()==="Edit"){
        button.click()
      }
    })
    // 2. There should be a form in the first row now
    expect(tableRowToBeEdited.getHTML()).to.include('<input')

    // 3. I can edit the row
    const name = "Test Investement"
    inputName = tableRowToBeEdited.element('#name')
    inputName.setValue(name)
    // inputY = tableRowToBeEdited.element('#y')
    // inputY.setValue("1000")
    // inputCurrency = tableRowToBeEdited.element('#currency')
    // inputCurrency.setValue("CHF")
    // inputInterest = tableRowToBeEdited.element('#interest')
    // inputInterest.setValue("1")
    // inputExchange = tableRowToBeEdited.element('#exchange')
    // inputExchange.setValue("NSYE")
    // inputSymbol = tableRowToBeEdited.element('#symbol')
    // inputSymbol.setValue("VTI")
    Buttons = browser.elements('table:first-of-type tbody tr:first-child button')
    // 3.1. I can click Save
    Buttons.value.forEach( (button) => {
      if(button.getText()==="Save"){
        button.click()
      }
    })
    browser.waitForExist('input',1000,true);
    // 3.1.1. The row now contains the new Data
    expect(tableRowToBeEdited.element('td:first-child').getText()).to.eql(name)
    // 3.2.1. I can click cancel
    const htmlOfTableRowToBeEdited = tableRowToBeEdited.getHTML()

    Buttons = browser.elements('table:first-of-type tbody tr:first-child button')

    Buttons.value.forEach( (button) => {
      if(button.getText()==="Edit"){
        button.click()
      }
    })

    Buttons = browser.elements('table:first-of-type tbody tr:first-child button')

    Buttons.value.forEach( (button) => {
      if(button.getText()==="Cancel"){
        button.click()
      }
    })
    
    // 3.2.2. The row now contains the old Data
    const htmlOfFirstTableRowAfterClickingCancel = browser.element('table:first-of-type tbody tr:first-child').getHTML()
    expect(htmlOfTableRowToBeEdited).to.eql(htmlOfFirstTableRowAfterClickingCancel)


  })

})
