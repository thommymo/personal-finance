import React from 'react';
import TableWithHoldingsFinMarkets from './tablewithholdingsfinmarkets';
import renderer from 'react-test-renderer'
import { portfolio, currency, shareValue } from '../../data/data'

it('Shows portfolio as pie chart', () => {
  const component = renderer.create(
    <TableWithHoldingsFinMarkets
      portfolioSelection="Equities"
      color="blue"
      portfolio={portfolio}
      exchangeRates={currency}
      shareValue={shareValue}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
