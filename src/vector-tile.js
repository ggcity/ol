import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { Stroke, Style } from 'ol/style';
import MVT from 'ol/format/MVT';
import { createXYZ } from 'ol/tilegrid';

customElements.define('ol-vector-tile', class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.map = (this.closest('ol-map') ? this.closest('ol-map').map : null);

    let style_simple = new Style({
      stroke: new Stroke({
        color: '#b3b3b3',
        width: 1
      })
    });
  
    let layer = 'gis:parcels';
    let parcel = new VectorTileLayer({
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      style: (feature) => style_simple,
      source: new VectorTileSource({
        tilePixelRatio: 1,
        tileGrid: createXYZ({maxZoom: 22}),
        format: new MVT(),
        url: 'https://ggcity.org/geoserver/gwc/service/tms/1.0.0/' + layer +
            '@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
      })
    });

    this.map.addLayer(parcel);
 }

  static get observedAttributes() {
    return [
      'min-zoom', 'max-zoom'
    ];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
  }

  get minZoom() {
    return parseFloat(this.getAttribute('min-zoom')) || null;
  }

  get maxZoom() {
    return parseFloat(this.getAttribute('max-zoom')) || undefined;
  }
});