import olms from 'ol-mapbox-style';

customElements.define('ol-mapbox-style', class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.map = (this.closest('ol-map') ? this.closest('ol-map').map : null);

    olms(this.map, 'https://ggcity.org/tileserver/styles/standard-no-boundary/style.json');
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