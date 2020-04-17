import { LitElement, css, html, customElement } from 'lit-element';


@customElement('comp-detail')
export class CompDetail extends LitElement {

  static get styles() {
    return css`
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <h2>Detail Page</h2>
      </div>
    `;
  }
}