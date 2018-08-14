import React, {Component} from 'react'
import ReactDOM from 'react-dom'

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
        center: {lat: 44.396276, lng: 8.943662},
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
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        title: location.name,
        imageUrl: location.imageUrl,
        animation: google.maps.Animation.DROP
      })
      marker.addListener('click', () => {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
          this.populateInfoWindow(marker, infowindow)
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }

  populateInfoWindow = (marker, infowindow) => {
    const defaultIcon = marker.getIcon()
    const {markers} = this.state
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
/*
      if (infowindow.marker) {
      if (marker.getAnimation() !== null) {
        const ind = markers.findIndex(m => m.title === infowindow.marker.title)
        markers[ind].setIcon(defaultIcon)
        markers[ind].setAnimation(null)
        alert("ráment")
        alert(ind)
        alert(markers[ind])
        alert(markers[ind].setIcon(defaultIcon))
        alert(markers[ind].setAnimation(null))
      }
*/  
      marker.setAnimation(window.google.maps.Animation.BOUNCE)
      var imageSrc = marker.imageUrl
//      infowindow.marker = marker
      var image = document.images[0]
      var downloadingImage = new Image()
      downloadingImage.onload = function(){
          image.src = this.src
      }
      downloadingImage.src = imageSrc
      marker.setAnimation(null)
      var contentString = '<h3>' + marker.title + '</h3><img src="' + image.src + '">';
      infowindow.content = contentString
      infowindow.setContent(contentString)
      marker.addListener('click', function() {
        infowindow.open(this.map, marker);
      });
/*
      var html = '<h3>' + marker.title + '</h3><img src="' + image.src + '">'
      marker.setAnimation(null)
      infowindow.setContent(html)
      infowindow.open(this.map, marker)
      // Make sure the marker property is cleared if the infowindow is closed.
*/
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
