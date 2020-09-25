import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

customElements.define('ol-tile-layer', class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.map = (this.closest('ol-map') ? this.closest('ol-map').map : null);

    this.map.addLayer(new TileLayer({ source: new OSM() }));
  }

  static get observedAttributes() {
    return [
      'latitude', 'longitude', 'zoom', 'min-zoom', 'max-zoom'
    ];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
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
    return this.getAttribute('zoom');
  }

  set zoom(newValue) {
    this.setAttribute('zoom', newValue);
  }
});