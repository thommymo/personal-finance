import React from 'react';
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { portfolio, currency, holdingsWithMarketPrice, shareValue } from '../../data/data'
import PieChartWithData from './piechart'

it('Shows portfolio as pie chart', () => {
  const component = renderer.create(
    <PieChartWithData
      portfolio={portfolio}
      currency={currency}
      holdingsWithMarketPrice={holdingsWithMarketPrice}
      shareValue={shareValue}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})

it('App renders without crashing', () => {
  const component = shallow(<PieChartWithData />);
  expect(component.exists()).toEqual(true);
});
