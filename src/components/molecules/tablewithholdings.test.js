import React from 'react';
import TableWithHoldings from './tablewithholdings';
import renderer from 'react-test-renderer'
import { portfolio, currency, shareValue } from '../../data/data'

it('Shows portfolio as pie chart', () => {
  const component = renderer.create(
    <TableWithHoldings
      portfolioSelection="Cash"
      color="blue"
      portfolio={portfolio}
      currency={currency}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
