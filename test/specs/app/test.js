const expect = require('chai').expect

describe('Personal Portfolio App', () => {
  it('Should load with the right title', () => {
    browser.url('http://localhost:3000/')
    const actualTitle = browser.getTitle()
    expect(actualTitle).to.eql('Personal Portfolio App')
  })

  it('Should allow me to remove an investment', () => {
    browser.url('http://localhost:3000/')
    browser.click('path:first-of-type')
    browser.waitForExist('table');
    const tableRowToBeRemoved = browser.element('table:first-of-type tbody tr:first-child')
    const actual = tableRowToBeRemoved.element('button')
    tableRowToBeRemoved.click('button:first-element')
    tableRows = browser.elements('table:first-of-type tbody tr')
    expect(tableRows).to.not.include(tableRowToBeRemoved)
  })
})
