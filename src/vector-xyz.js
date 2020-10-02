import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import { Stroke, Style } from 'ol/style';
import MVT from 'ol/format/MVT';
import { createXYZ } from 'ol/tilegrid';
import { OLMapElement } from './ol-map-element.js';

customElements.define('ol-vector-xyz', class extends OLMapElement {
  connectedCallback() {
    let style_simple = new Style({
      stroke: new Stroke({
        color: '#b3b3b3',
        width: 1
      })
    });

    let layer = new VectorTileLayer({
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      style: (feature) => style_simple,
      source: new VectorTileSource({
        tilePixelRatio: 1,
        tileGrid: createXYZ({ maxZoom: this.maxZoom }),
        format: new MVT(),
        url: this.src
      })
    });

    this.olMap.map.addLayer(layer);
  }

  get src() {
    return this.getAttribute('src');
  }

  get minZoom() {
    return parseFloat(this.getAttribute('min-zoom')) || undefined;
  }

  get maxZoom() {
    return parseFloat(this.getAttribute('max-zoom')) || undefined;
  }
});