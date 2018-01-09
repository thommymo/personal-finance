import React from 'react';
import PieChartWithData from './piechart';
import renderer from 'react-test-renderer'
import { portfolio, currency, holdingsWithMarketPrice, shareValue } from '../../data/data'

it('Shows portfolio as pie chart', () => {
  const component = renderer.create(
    <PieChartWithData portfolio={portfolio} currency={currency} holdingsWithMarketPrice={holdingsWithMarketPrice} shareValue={shareValue} />
      );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
