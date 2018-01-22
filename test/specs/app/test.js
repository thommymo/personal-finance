const expect = require('chai').expect

describe('Personal Portfolio App', () => {

  it('Should load with the right title', () => {
    browser.url('http://localhost:3000/')
    const actualTitle = browser.getTitle()
    expect(actualTitle).to.eql('Personal Portfolio App')
  })

  /*
    TODO: Test for through all portfolio types
  */


  it('Should cancel editing investment', () => {

    browser.url('http://localhost:3000/')
    browser.waitForExist('svg g .highcharts-data-label')

    const allElementsWithText = browser.elements('svg g .highcharts-data-label')

    allElementsWithText.value.forEach( (g) => {
      if(g.getText()==="Equities"){
        g.click()
      }
    })


    browser.waitForExist('table');

    const tableRowToBeEdited = $('table:first-of-type tbody tr:first-child')
    /*
      1. It should be possible to edit and cancel editing
    */

    const htmlOfTableRowToBeEdited = tableRowToBeEdited.getHTML()

    buttons = browser.elements('table:first-of-type tbody tr:first-child button')

    buttons.value.forEach( (button) => {
      if(button.getText()==="Edit"){
        button.click()
      }
    })

    buttons = browser.elements('table:first-of-type tbody tr:first-child button')

    buttons.value.forEach( (button) => {
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

  it('Should edit investment', () => {

    const tableRowToBeEdited = $('table:first-of-type tbody tr:first-child')

    /*
      1. Detect edit button and click it
    */

    let buttons = browser.elements('table:first-of-type tbody tr:first-child button')
    buttons.value.forEach( (button) => {
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
    tableRowToBeEdited.element('#name').setValue(name)

    const y = 122
    inputY = tableRowToBeEdited.element('#y').setValue(y)

    const currency = "USD"
    inputCurrency = tableRowToBeEdited.element('#currency').selectByValue(currency)

    let withInterest = false
    let withExchange = false
    let withSymbol = false
    let holdingsWithMarketPrice = false

    const symbol = "VTI"
    const exchange = "NYSE"
    const interest = 1.125

    if(tableRowToBeEdited.isExisting('#interest')){
      tableRowToBeEdited.element('#interest').setValue(interest)
      withInterest = true
    }

    if(tableRowToBeEdited.isExisting('#symbol') && tableRowToBeEdited.isExisting('#exchange') ){
      tableRowToBeEdited.element('#symbol').setValue(symbol)
      tableRowToBeEdited.element('#exchange').selectByValue(exchange)
      holdingsWithMarketPrice = true
      withExchange = true
      holdingsWithMarketPrice = true
      withSymbol = true
    }

    /*
      4. After editing the form can be saved now
    */
    buttons = browser.elements('table:first-of-type tbody tr:first-child button')
    buttons.value.forEach( (button) => {
      if(button.getText()==="Save"){
        button.click()
      }
    })

    browser.waitForExist('input',1000,true);

    /*
      5. The row now should contain the newly added Data
    */

    if(holdingsWithMarketPrice){
      expect(tableRowToBeEdited.element('td:first-child').getText()).to.eql(name)
      expect(tableRowToBeEdited.element('td:nth-child(2)').getText()).to.eql(symbol)
      expect(tableRowToBeEdited.element('td:nth-child(3)').getText()).to.eql(currency)
      expect(tableRowToBeEdited.element('td:nth-child(4)').getText()).to.eql(exchange)
    } else {
      expect(tableRowToBeEdited.element('td:first-child').getText()).to.eql(name)
      expect(tableRowToBeEdited.element('td:nth-child(2)').getText().replace(/[^0-9]/g, '')).to.include(y)
      expect(tableRowToBeEdited.element('td:nth-child(4)').getText().replace(/[^0-9]/g, '')).to.include(interest.toString().replace(/[^0-9]/g, ''))
    }


  })

  it('Should remove investment from table', () => {

    const tableRowToBeRemoved = $('table:first-of-type tbody tr:first-child')
    const htmlOfTableRowToBeRemoved = tableRowToBeRemoved.getHTML()
    const buttons = browser.elements('table:first-of-type tbody tr:first-child button')
    buttons.value.forEach( (button) => {
      if(button.getText()==="Remove"){
        button.click()
      }
    })
    const htmlOfFirstTableRowAfterClick = browser.element('table:first-of-type tbody tr:first-child').getHTML()
    expect(htmlOfFirstTableRowAfterClick).to.not.eql(htmlOfTableRowToBeRemoved)
  })


})
