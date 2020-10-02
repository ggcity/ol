import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';

let template = document.createElement('template');

template.innerHTML = /*html*/`
  <style>
    @import 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.4.3/css/ol.css';
    @import 'https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css';

    :host {
      display: block;
    }

    #map {
      width: 100%;
      height: 100%;
    }
  </style>

  <div id='map'><div>
`;

customElements.define('ol-map', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.view = new View({
      center: fromLonLat([this.longitude, this.latitude]),
      zoom: this.zoom,
      projection: this.projection,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      constrainResolution: true
    });

    this.map = new Map({
      target: this.shadowRoot.querySelector('#map'),
      view: this.view
    });

    this.view.on('change', this._viewChanged.bind(this));
    this._syncAttributeToMap = true;
  }

  _viewChanged(e) {
    this._syncAttributeToMap = false;
    this.longitude = this.view.getCenter()[0];
    this.latitude = this.view.getCenter()[1];
    this.zoom = this.view.getZoom();
    this._syncAttributeToMap = true;
  }

  static get observedAttributes() {
    return [
      'latitude', 'longitude', 'zoom'
    ];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this._syncAttributeToMap) {
      if (attrName === 'latitude' || attrName === 'longitude') {
        this.view.setCenter([this.longitude, this.latitude]);
      } else if (attrName === 'zoom') {
        this.view.setZoom(this.zoom);
      }
    }
  }

  get latitude() {
    return this.getAttribute('latitude');
  }

  set latitude(newValue) {
    this.setAttribute('latitude', newValue);
  }

  get longitude() {
    return this.getAttribute('longitude');
  }

  set longitude(newValue) {
    this.setAttribute('longitude', newValue);
  }

  get zoom() {
    return parseFloat(this.getAttribute('zoom')) ||  0;
  }

  set zoom(newValue) {
    this.setAttribute('zoom', newValue);
  }

  get minZoom() {
    return parseFloat(this.getAttribute('min-zoom')) || null;
  }

  get maxZoom() {
    return parseFloat(this.getAttribute('max-zoom')) || null;
  }

  get projection() {
    return this.getAttribute('projection') || 'EPSG:3857';
  }

  get mapDiv() {
    return this.shadowRoot.querySelector('#map');
  }
});