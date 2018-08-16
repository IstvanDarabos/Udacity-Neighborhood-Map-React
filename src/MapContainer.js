import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './places.json'

export default class MapContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locations: require("./places.json"),
      query: '',
      markers: [],
      infowindow: new this.props.google.maps.InfoWindow(),
      bounceIcon: null
    };
  }

  componentDidMount() {
    this.loadMap()
    this.onclickLocation()
  }

  loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      const mapConfig = Object.assign({}, {
        center: {lat: 44.410585, lng: 8.929776},
        zoom: 13,
        mapTypeId: 'roadmap'
      })

      this.map = new maps.Map(node, mapConfig)
      this.addMarkers()

    }
  }
  
  onclickLocation = () => {
    const that = this
    const {infowindow} = this.state

    const displayInfowindow = (e) => {
      const {markers} = this.state
      const markerInd =
        markers.findIndex(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
        that.populateInfoWindow(markers[markerInd], infowindow)
    }
    document.querySelector('.locations-list').addEventListener('click', function (e) {
      if (e.target && e.target.nodeName === "LI") {
        displayInfowindow(e)
      }
    })
  }

  handleValueChange = (e) => {
    this.setState({query: e.target.value})
  }

  addMarkers = () => {
    const {google} = this.props
    let {infowindow} = this.state
    const bounds = new google.maps.LatLngBounds()

    this.state.locations.forEach((location, ind) => {
      const marker = new google.maps.Marker({
        imageUrl: location.imageUrl,
        showUrl: location.locationShowUrl,
        description1: location.someText1,
        description2: location.someText2,
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        title: location.name,
        animation: google.maps.Animation.DROP
      })
      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow)
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }

populateInfoWindow = (marker, infowindow) => {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker !== marker) {
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    marker.setAnimation(null)
    getImage(marker.imageUrl)
      var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">'+marker.title+'</h1>'+
          '<div id="bodyContent">'+
          '<p><b>' + marker.title + '</b>, ' + marker.description1 + marker.description2 + '</b>' +
          '<img src="' + marker.imageUrl + '">'+
          '<p>Attribution: '+ marker.title + ', <a style={{display: "table-cell"}} href="' + marker.showUrl + '" target="_blank">' + marker.title + '</a> '+
          '.</p>'+
          '</div>'+
          '</div>';

    infowindow.setContent(contentString)
    infowindow.open(this.map, marker)
    infowindow.addListener('closeclick', function () {
      infowindow.marker = null
    })
  }
}

  makeMarkerIcon = (markerColor) => {
    const {google} = this.props
    let markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

  render() {
    const {locations, query, markers, infowindow} = this.state
    if (query) {
      locations.forEach((l, i) => {
        if (l.name.toLowerCase().includes(query.toLowerCase())) {
          markers[i].setVisible(true)
        } else {
          if (infowindow.marker === markers[i]) {
            // close the info window if marker removed
            infowindow.close()
          }
          markers[i].setVisible(false)
        }
      })
    } else {
      locations.forEach((l, i) => {
        if (markers.length && markers[i]) {
          markers[i].setVisible(true)
        }
      })
    }
    return (
      <div>
        <div className="container">
          <div className="text-input">
            <input role="search" type='text'
                   value={this.state.value}
                   onChange={this.handleValueChange}/>
            <ul className="locations-list">{
              markers.filter(m => m.getVisible()).map((m, i) =>
                (<li key={i}>{m.title}</li>))
            }</ul>
          </div>
          <div id="googleMap" role="application" className="map" ref="map">
            loading map...
          </div>
        </div>
      </div>
    )
  }
}

function getImage(url){
  var Promise = require('es6-promise-polyfill').Promise
    return new Promise(function(resolve, reject){
        var img = new Image()
        img.onload = function(){
          setTimeout(function(){
            console.log('Handle resolved promise here.')
            resolve(url) // Yay! Everything went well!
          }, 250);
        }
        img.onerror = function(){
          console.log('Handle rejected promise here.')
          reject(url)
        }
        img.src = url
    })
}
