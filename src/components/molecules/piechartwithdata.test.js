import React from 'react';
import ReactDOM from 'react-dom';
import PieChartWithData from './piechartwithdata';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PieChartWithData />, div);
});
