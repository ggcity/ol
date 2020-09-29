import Layer from 'ol/layer/Layer';
import Source from 'ol/source/Source';
import { toLonLat } from 'ol/proj';

customElements.define('ol-mapbox-style', class extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.map = (this.closest('ol-map') ? this.closest('ol-map') : null);

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2djaXR5IiwiYSI6ImNqNXpjM3czcjA4djIzMm4wOWQ0YjExMzcifQ.PeDOEiLNe7AkmhSa9ZK3aQ';
    let mbMap = new mapboxgl.Map({
      style: 'mapbox://styles/ggcity/ckfo8an0k02ay19p10zg06oat',
      attributionControl: false,
      boxZoom: false,
      center: [0,0],
      container: this.map,
      doubleClickZoom: false,
      dragPan: false,
      dragRotate: false,
      interactive: false,
      keyboard: false,
      pitchWithRotate: false,
      scrollZoom: false,
      touchZoomRotate: false,
    });

    var mbLayer = new Layer({
      render: function (frameState) {
        var canvas = mbMap.getCanvas();
        var viewState = frameState.viewState;

        var visible = mbLayer.getVisible();
        canvas.style.display = visible ? 'block' : 'none';

        var opacity = mbLayer.getOpacity();
        canvas.style.opacity = opacity;

        // adjust view parameters in mapbox
        var rotation = viewState.rotation;
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
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
          'City of Garden Grove',
        ],
      }),
    });

    this.map.map.addLayer(mbLayer);
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