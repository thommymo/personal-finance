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

  it('Should remove investment from table', () => {

    const tableRowToBeEdited = $('table:first-of-type tbody tr:first-child')
    const htmlOfTableRowToBeEdited = tableRowToBeEdited.getHTML()
    const Buttons = browser.elements('table:first-of-type tbody tr:first-child button')

    // 1. Get edit button and click it
    Buttons.value.forEach( (button) => {
      if(button.getText()==="Edit"){
        button.click()
      }
    })
    // 2. There should be a form in the first row now
      // TODO: Check if there is a new form

    // 3. I can edit the row
      // TODO: Check if i can add new data into the form

    // 3.1. I can click Save
    Buttons.value.forEach( (button) => {
      if(button.getText()==="Save"){
        button.click()
      }
    })
    // 3.1.1. The row now contains the new data
      // TODO: Check if the newly added data is in the row now

    // 3.2.1. I can click cancel
    Buttons.value.forEach( (button) => {
      if(button.getText()==="Edit"){
        button.click()
      }
    })
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
