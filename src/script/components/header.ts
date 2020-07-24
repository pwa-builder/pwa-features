import { LitElement, css, html, customElement } from "lit-element";

@customElement("app-header")
export class AppHeader extends LitElement {
  previous: string | null = null;

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

      header #tabs a,
      header #tabs button {
        padding-bottom: 6px;
        font-family: sans-serif;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
        text-align: center;
        color: hsla(0, 0%, 100%, 0.7);
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
        color: hsla(0, 0%, 100%, 0.7);
      }

      header #github {
        height: 32px;
        width: 86px;
      }

      #hubLink:focus {
        outline: auto;
      }

      #featureStore:focus {
        outline: auto;
      }

      @media (max-width: 800px) {
        header #tabs {
          margin-left: 2em;
          width: 57em;
        }
      }

      @media (min-width: 1336px) {
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

  firstUpdated() {
    this.previous = document.referrer;
  }

  gobuilder() {
    if (
      this.previous?.includes("pwabuilder") &&
      this.previous?.includes("url")
    ) {
      location.href = this.previous;
    } else {
      location.href = "https://pwabuilder.com";
    }
  }

  render() {
    return html`
      <header role="presentation">
        <img @click="${this.gobuilder}" id="icon" src="/assets/pwabuilder.svg" alt="PWABuilder icon" tabindex="0" />

        <div id="tabs">
          <a id="hubLink" @click="${this.gobuilder}" tabindex="0">My Hub</a>
          <a id="featureStore" href="/" tabindex="0">Feature Store</a>
        </div>

        <div id="github"></div>
      </header>
    `;
  }
}
