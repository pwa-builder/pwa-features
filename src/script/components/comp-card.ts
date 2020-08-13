import { LitElement, css, html, customElement, property } from "lit-element";

@customElement("comp-card")
export class CompCard extends LitElement {
  @property({ type: Object }) comp: any;

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: center;
      }

      .compCard {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        background: white;
        padding: 20px;
        border-radius: 4px;

        width: 380px;
        height: 180px;
      }

      h3 {
        font-size: 14px;
        font-weight: 700;
        margin-top: 0;
      }

      p {
        font-size: 14px;
      }

      .cardActions {
        display: flex;
        justify-content: center;
      }

      .cardActions a {
        text-decoration: none;
        font-size: 14px;
        font-weight: bold;
        border-radius: 20px;
        padding: 10px;
        padding-left: 14px;
        padding-right: 14px;
        border: none;
        text-transform: uppercase;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        color: #9337d8;

        transition: all 260ms;
      }

      .cardActions a:hover {
        background-color: #9337d8;
        color: white;
      }

      @media (max-width: 640px) {
        .compCard {
          width: 100%;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="compCard">
        <div>
          <h3>${this.comp.name}</h3>
          <p>${this.comp.desc}</p>
        </div>

        <div class="cardActions">
          <a
            aria-label="${`View ${this.comp.name} Component link`}"
            .href=${`component/${this.comp.ID}`}
            >View Component</a
          >
        </div>
      </div>
    `;
  }
}
