import React from 'react';
import ReactDOM from 'react-dom';

export default class WelcomePage extends React.Component {

  constructor(props) {
    super(props);

    this.createBucket = this.createBucket.bind(this);
  }

  createBucket() {
    fetch("/new/bucket", 
      {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({})
      }
    ).then(function(response) {
      return response.json();
    }).then(function(json) {
      console.log(json);
    });
  }

  render() {
    return (
      <div>
        <span>Welcome to MyBucketList.</span>
        <button onClick={this.createBucket}>Create a Bucket</button>
      </div>
    );
  }
}
