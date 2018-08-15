import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css'
import MapContainer from './MapContainer'
import './places.json'

class App extends Component {
  render() {
    return (
      <div>
        <a className="menu" tabIndex="0">
        </a>
        <h1 className="heading"> Genova Neighborhood Map </h1>
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBqeCAur3WuwLz9vaZyfuVA4WzfqSFjmiM'
})(App)

