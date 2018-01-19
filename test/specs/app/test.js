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

  it('Should edit investment', () => {

    const tableRowToBeEdited = $('table:first-of-type tbody tr:first-child')

    /*
      1. Detect edit button and click it
    */

    let Buttons = browser.elements('table:first-of-type tbody tr:first-child button')
    Buttons.value.forEach( (button) => {
      if(button.getText()==="Edit"){
        button.click()
      }
    })

    /*
      2. There should be a form in the first row of tbody now
    */

    expect(tableRowToBeEdited.getHTML()).to.include('<input')

    /*
      3. The form can be edited now
    */

    const name = "Test Investement"
    inputName = tableRowToBeEdited.element('#name')
    inputName.setValue(name)
    const y = 120221
    inputY = tableRowToBeEdited.element('#y')
    inputY.setValue(y)
    const currency = "AUD"
    inputCurrency = tableRowToBeEdited.element('#currency')
    inputCurrency.selectByValue(currency)

    let withInterest = false
    let withExchange = false
    let withSymbol = false

    const interest = 1.125
    if(tableRowToBeEdited.isExisting('#interest')){
      inputInterest = tableRowToBeEdited.element('#interest')
      inputInterest.setValue(interest)
      withInterest = true
    }
    if(tableRowToBeEdited.isExisting('#exchange')){
      inputExchange = tableRowToBeEdited.element('#exchange')
      inputExchange.setValue("NSYE")
      withExchange = true
    }
    if(tableRowToBeEdited.isExisting('#symbol')){
      inputSymbol = tableRowToBeEdited.element('#symbol')
      inputSymbol.setValue("VTI")
      withSymbol = true
    }

    /*
      4. After editing the form can be saved now
    */
    Buttons = browser.elements('table:first-of-type tbody tr:first-child button')
    Buttons.value.forEach( (button) => {
      if(button.getText()==="Save"){
        button.click()
      }
    })

    browser.waitForExist('input',1000,true);

    /*
      5. The row now should contain the newly added Data
    */

    expect(tableRowToBeEdited.element('td:first-child').getText()).to.eql(name)
    expect(tableRowToBeEdited.element('td:nth-child(2)').getText().replace(/[^0-9]/g, '')).to.include(y)
    expect(tableRowToBeEdited.element('td:nth-child(4)').getText().replace(/[^0-9]/g, '')).to.include(interest.toString().replace(/[^0-9]/g, ''))

  })

  it('Should cancel editing investment', () => {

    const tableRowToBeEdited = $('table:first-of-type tbody tr:first-child')
    /*
      1. It should be possible to edit and cancel editing
    */

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

    /*
      2. The row should contain old Data now
    */

    const htmlOfFirstTableRowAfterClickingCancel = browser.element('table:first-of-type tbody tr:first-child').getHTML()
    expect(htmlOfTableRowToBeEdited).to.eql(htmlOfFirstTableRowAfterClickingCancel)


  })

})
