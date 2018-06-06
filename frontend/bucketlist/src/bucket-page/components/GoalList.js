import React from 'react';
import ReactDOM from 'react-dom';

export default class GoalList extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    // unused
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.items.map(function(item) {
            return <li key={item}>{item}</li>
          })}
        </ul>
      </div>
    );
  }
}
