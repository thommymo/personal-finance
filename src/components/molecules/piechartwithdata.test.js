import React from 'react';
import PieChartWithData from './piechartwithdata';
import renderer from 'react-test-renderer'
import { portfolio } from '../../data/data'

it('Shows portfolio as pie chart', () => {
  const component = renderer.create(
    <PieChartWithData portfolio={portfolio}/>
      );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
