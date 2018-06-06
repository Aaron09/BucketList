import React from 'react';
import ReactDOM from 'react-dom';

export default class GoalAdder extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.submitGoal = this.submitGoal.bind(this);

    this.state = {
      newGoal: ""
    }
  }

  onChange(e) {
    this.setState({newGoal: e.target.value});
  }

  async submitGoal() {
    fetch("/new/goal", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ bucketID: this.props.bucketID, newGoal: this.state.newGoal })
    }).then(function(response) {
      console.log(response);
      this.props.newGoalUpdate(this.state.newGoal);
      this.setState({newGoal: ""});
    }.bind(this));
  }

  render() {
    return (
      <div>
        <input onChange={this.onChange} value={this.state.newGoal} />
        <button onClick={this.submitGoal}>Add Goal</button>
      </div>
    );
  }
}
