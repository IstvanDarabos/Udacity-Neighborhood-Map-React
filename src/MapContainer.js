import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './places.json'

/**
 * basically from Google Maps API's library
 */

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
/*
  populateInfoWindow = (marker, infowindow) => {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      marker.setAnimation(window.google.maps.Animation.BOUNCE)
      marker.setAnimation(null)

      getImage(marker.imageUrl)

//    content -> '<img src=marker.imageUrl alt="Sorry, Failed to load image.">'
      
      var remoteImg = document.createElement("IMG")
      remoteImg.setAttribute("src", marker.imageUrl)
      remoteImg.setAttribute("alt", "Sorry, Failed to load image.")
      infowindow.setContent(remoteImg)
      infowindow.open(this.map, marker)

//    content -> '<p id="mapsMarker">marker.title</p>'

      var p = document.createElement('p')
      var snippet = document.createTextNode(marker.title)
      p.appendChild(snippet)
      remoteImg.appendChild(p)

      var contentString = '<img src=' + marker.imageUrl + 'alt="Sorry, This Image not loaded">'
      contentString += '<p>' + marker.title + '</p>'
      infowindow.setContent(contentString)
      infowindow.open(this.map, marker)

      infowindow.addListener('closeclick', function () {
        infowindow.marker = null
      })
    }
  }
*/
/*
    populateInfoWindow = (marker, infowindow) => {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker !== marker) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        marker.setAnimation(null)
        getImage(marker.imageUrl)
        var x = document.createElement("IMG")
        x.setAttribute("src", marker.imageUrl)
        infowindow.setContent(x)
        infowindow.open(this.map, marker)
        infowindow.addListener('closeclick', function () {
          infowindow.marker = null
        })
      }
    }
*/

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
        '<p><b>'+marker.title+'</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the '+
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
        'south west of the nearest large town, Alice Springs; 450&#160;km '+
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
        'features of the Uluru - Kata Tjuta National Park. Uluru is '+
        'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
        'Aboriginal people of the area. It has many springs, waterholes, '+
        'rock caves and ancient paintings. Uluru is listed as a World '+
        'Heritage Site.</p>'+
        '<img src="' + marker.imageUrl + '">'+
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        '(last visited June 22, 2009).</p>'+
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
