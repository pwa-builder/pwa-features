import { LitElement, css, html, customElement, property } from "lit-element";

@customElement("browser-support")
export class BrowserSupport extends LitElement {
  @property({ type: Array }) supportData: any[] | null = null;

  static get styles() {
    return css`
      #support {
        display: flex;
        flex-direction: column;

        background: white;
        width: 64%;
        padding-right: 1em;
        margin-left: 9em;
        margin-top: 2em;
        padding-left: 1em;
        padding-bottom: 1em;
        border-radius: 8px;
      }

      #support img {
        height: 2em;
        width: 2em;
      }

      #supportDetails {
        display: flex;
      }

      .supportBlock {
        display: flex;
        align-items: center;

        width: 8em;
        background: #f0f0f0;
        border-radius: 8px;
        padding-top: 6px;
        padding-bottom: 6px;
        padding-left: 16px;
        padding-right: 8px;
        justify-content: space-between;
        margin-right: 8px;
        font-weight: bold;
      }

      @media (max-width: 800px) {
        #support {
          margin-left: 0;
          width: inherit;
        }

        #supportDetails {
          display: grid;
          grid-template-columns: auto auto;
          width: fit-content;
          grid-gap: 10px;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="support">
        <h3>Browser Support</h3>

        <div id="supportDetails">
          ${this.supportData?.map((platform: any) => {
            return html`
              <div
                class="supportBlock"
                aria-label="${platform.browser +
                " " +
                (platform.support ? "supported" : "not supported")}"
              >
                ${platform.browser}
                ${platform.support
                  ? html`<img
                      src="/assets/check.svg"
                      alt="checked"
                      aria-hidden="true"
                    />`
                  : html`<img
                      src="/assets/close.svg"
                      alt="no support"
                      aria-hidden="true"
                    />`}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}
