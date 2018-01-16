const expect = require('chai').expect

describe('Personal Portfolio App', () => {

  it('Should load with the right title', () => {
    browser.url('http://localhost:3000/')
    const actualTitle = browser.getTitle()
    expect(actualTitle).to.eql('Personal Portfolio App')
  })

  it('Should remove investment from table', () => {
    browser.url('http://localhost:3000/')
    browser.click('path:first-of-type')
    browser.waitForExist('table');
    const tableRowToBeRemoved = $('table:first-of-type tbody tr:first-child')
    const htmlOfTableRowToBeRemoved = tableRowToBeRemoved.getHTML()
    tableRowToBeRemoved.click('button:first-child')
    const htmlOfFirstTableRowAfterClick = browser.element('table:first-of-type tbody tr:first-child').getHTML()
    expect(htmlOfFirstTableRowAfterClick).to.not.eql(htmlOfTableRowToBeRemoved)
  })
  
})
