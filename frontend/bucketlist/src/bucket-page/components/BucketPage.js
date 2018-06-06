import React from 'react';
import ReactDOM from 'react-dom';
import GoalList from "./GoalList.js"
import GoalAdder from "./GoalAdder.js"

export default class BucketPage extends React.Component {

  constructor(props) {
    super(props);

    this.getBucketID = this.getBucketID.bind(this);
    this.requestBucketData = this.requestBucketData.bind(this);
    this.configureSocket = this.configureSocket.bind(this);
    this.saveCompletedGoalUpdate = this.sendCompletedGoalUpdate.bind(this);
    this.sendNewGoalUpdate = this.sendNewGoalUpdate.bind(this);

    const bucketID = this.getBucketID();

    this.state = {
      completedGoals: [],
      uncompletedGoals: [],
      bucketID: bucketID, 
      socket: this.configureSocket(bucketID)
    }
  }

  componentDidMount() {
    this.requestBucketData();
  }

  getBucketID() {
    const url = window.location.href;
    return url.substring(url.indexOf("=") + 1, url.length);
  }

  async requestBucketData() {
    const response = await fetch("/data/bucket?id=" + this.state.bucketID);
    const json = await response.json();
    
    this.setState({ completedGoals: json.completedGoals, uncompletedGoals: json.uncompletedGoals });
  }

  configureSocket(bucketID) {
    const socketURL = "ws://localhost:8080/";
    const socket = new WebSocket(socketURL);
  
    socket.onopen = function() {
      socket.send(JSON.stringify({new: true, bucketID: bucketID}));
    }.bind(this);

    socket.onmessage = function(message) {
      const json = JSON.parse(message.data);
      this.setState(json);
    }.bind(this);

    socket.onclose = function() {
      socket.send(JSON.stringify({bucketID: bucketID}));
    }.bind(this);

    return socket;
  }

  sendCompletedGoalUpdate(goal) {
    var completedGoals = this.state.completedGoals;
    var uncompletedGoals = this.state.uncompletedGoals;

    uncompletedGoals.splice(uncompletedGoals.indexOf(goal), 1);
    goals.push(goal);

    this.state.socket.send(JSON.stringify({completedGoals: completedGoals, uncompletedGoals: uncompletedGoals}));
  }

  sendNewGoalUpdate(goal) {
    var goals = this.state.uncompletedGoals;
    goals.push(goal);
    this.state.socket.send(JSON.stringify({uncompletedGoals: goals}));
  }

  render() {
    return (
      <div>
        <span>View the items in your bucket here.</span>
        <GoalAdder bucketID={this.state.bucketID} newGoalUpdate={this.sendNewGoalUpdate} />
        <span>Uncompleted Goals</span>
        <GoalList items={this.state.uncompletedGoals} completed={false} />
        <span>Completed Goals</span>
        <GoalList items={this.state.completedGoals} completed={true} />
      </div>
    );
  }
}
