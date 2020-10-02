import Layer from 'ol/layer/Layer';
import Source from 'ol/source/Source';
import { toLonLat } from 'ol/proj';
import { OLMapElement } from './ol-map-element.js';

customElements.define('ol-mapbox-style', class extends OLMapElement {
  connectedCallback() {    
    mapboxgl.accessToken = this.accessToken;
    let mbMap = new mapboxgl.Map({
      style: this.src,
      attributionControl: false,
      boxZoom: false,
      center: [0,0],
      container: this.olMap.mapDiv,
      doubleClickZoom: false,
      dragPan: false,
      dragRotate: false,
      interactive: false,
      keyboard: false,
      pitchWithRotate: false,
      scrollZoom: false,
      touchZoomRotate: false,
    });

    let mbLayer = new Layer({
      render: function (frameState) {
        let canvas = mbMap.getCanvas();
        let viewState = frameState.viewState;

        let visible = mbLayer.getVisible();
        canvas.style.display = visible ? 'block' : 'none';

        let opacity = mbLayer.getOpacity();
        canvas.style.opacity = opacity;

        // adjust view parameters in mapbox
        let rotation = viewState.rotation;
        mbMap.jumpTo({
          center: toLonLat(viewState.center),
          zoom: viewState.zoom - 1,
          bearing: (-rotation * 180) / Math.PI,
          animate: false,
        });

        // cancel the scheduled update & trigger synchronous redraw
        // see https://github.com/mapbox/mapbox-gl-js/issues/7893#issue-408992184
        // NOTE: THIS MIGHT BREAK IF UPDATING THE MAPBOX VERSION
        if (mbMap._frame) {
          mbMap._frame.cancel();
          mbMap._frame = null;
        }
        mbMap._render();

        return canvas;
      },
      source: new Source({
        attributions: [
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
        ],
      }),
    });

    this.olMap.map.addLayer(mbLayer);
  }

  get src() {
    return this.getAttribute('src');
  }

  get accessToken() {
    return this.getAttribute('access-token');
  }
});