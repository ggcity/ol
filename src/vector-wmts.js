import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {get as getProjection} from 'ol/proj';
import {getTopLeft, getWidth} from 'ol/extent';
import { Stroke, Style } from 'ol/style';
import { OLMapElement } from './ol-map-element.js';

customElements.define('ol-vector-wmts', class extends OLMapElement {
  connectedCallback() {
    let projection = getProjection(this.projection);
    let projectionExtent = projection.getExtent();
    let size = getWidth(projectionExtent) / 256;
    let resolutions = new Array(23);
    let matrixIds = new Array(23);
    for (let z = 0; z < 23; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }

    let params = new URLSearchParams({
      'REQUEST': 'GetTile',
      'SERVICE': 'WMTS',
      'VERSION': '1.0.0',
      'LAYER': this.layer,
      'STYLE': '',
      'TILEMATRIX': `${this.projection}:{z}`,
      'TILEMATRIXSET': this.projection,
      'FORMAT': 'application/vnd.mapbox-vector-tile',
      'TILECOL': '{x}',
      'TILEROW': '{y}'
    });

    let url = new URL(this.src);
    url.search = decodeURIComponent(params.toString());

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
        url: url.toString(),
        format: new MVT({}),
        projection: this.projection,
        tileGrid: new WMTSTileGrid({
          tileSize: [256,256],
          origin: getTopLeft(projectionExtent),
          resolutions: resolutions,
          matrixIds: matrixIds
        }),
        wrapX: true
      })
    });

    this.olMap.map.addLayer(layer);
  }

  get src() {
    return this.getAttribute('src');
  }

  get projection() {
    return this.getAttribute('projection') || 'EPSG:900913';
  }

  get layer() {
    return this.getAttribute('layer');
  }

  get minZoom() {
    return parseFloat(this.getAttribute('min-zoom')) || undefined;
  }

  get maxZoom() {
    return parseFloat(this.getAttribute('max-zoom')) || undefined;
  }
});