import { LitElement, css, html, customElement } from 'lit-element';


@customElement('app-header')
export class AppHeader extends LitElement {

  static get styles() {
    return css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;
        background: black;
        color: white;
        height: 52px;
      }

    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <header>

      </header>
    `;
  }
}