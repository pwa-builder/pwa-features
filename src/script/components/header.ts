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

      header #icon {
        height: 32px;
        width: 86px;
        cursor: pointer;
      }

      header #tabs {
        width: 14em;
        display: flex;
        justify-content: space-around;
      }

      header #tabs a, header #tabs button {
        padding-bottom: 6px;
        font-family: sans-serif;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
        text-align: center;
        color: hsla(0,0%,100%,.7);
        align-items: center;
        text-transform: uppercase;
        font-size: 14px;
        text-decoration: none;
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
      }

      header #tabs a {
        color: white;
      }

      header #tabs #hubLink {
        color: hsla(0,0%,100%,.7);
      }

      header #github {
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

  gobuilder() {
    location.href = 'https://pwabuilder.com';
  }

  render() {
    return html`
      <header>
        <img @click="${this.gobuilder}" id="icon" src="/assets/pwabuilder.svg" alt="PWABuilder icon">

        <div id="tabs">
          <a id="hubLink" href="https://pwabuilder.com">My Hub</a>
          <a href="/">Feature Store</a>
        </div>

        <div id="github">
        </div>
      </header>
    `;
  }
}