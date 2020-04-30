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
        color: black;
        height: 52px;
      }

      header img {
        height: 32px;
        width: 86px;
      }

      @media(min-width: 1336px) {
        header {
          padding-left: 154px;
          padding-right: 154px;
        }
      }

    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <header>
        <img src="/assets/pwabuilder.svg" alt="PWABuilder icon">

        <div id="github">
        </div>
      </header>
    `;
  }
}