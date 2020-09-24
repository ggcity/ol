import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import { olCss } from 'ol/ol.css';

let template = document.createElement('template');

template.innerHTML = /*html*/`
  <style>
    @import 'https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.4.3/css/ol.css';

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
    const map = new Map({
      target: this.map,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 0
      })
    });
  }

  get map() {
    return this.shadowRoot.querySelector('#map');
  }
});