export class OLMapElement extends HTMLElement {
  constructor() {
    super();

    if (this.closest('ol-map')) {
      this.olMap = (this.closest('ol-map') ? this.closest('ol-map') : null);
    } else {
      throw 'Parent ol-map element not found';
    }
  }
}