import { LitElement, css, html, customElement, property } from "lit-element";

@customElement("share-button")
export class ShareButton extends LitElement {
  @property({ type: String }) shareURL: string | null = null;

  static get styles() {
    return css`
      button {
        color: black;
        padding: 10px;
        background: transparent;
        border: 1px solid black;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 700;
        width: 6em;
        margin-right: 10px;
        cursor: pointer;

        display: flex;
        justify-content: center;
      }

      button img {
        width: 1em;
        margin-right: 2px;
      }
    `;
  }

  constructor() {
    super();
  }

  async share() {
    try {
      await (navigator as any).share({
        title: "PWABuilder",
        text: "Check this out!",
        url: location.href,
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return html`
      <button @click="${() => this.share()}" aria-label="Share">
        <img src="/assets/share.svg" alt="share icon" />
        Share
      </button>
    `;
  }
}
