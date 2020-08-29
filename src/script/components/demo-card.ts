import { LitElement, css, html, customElement, property } from 'lit-element';


@customElement('demo-card')
export class DemoCard extends LitElement {

  @property({ type: Object }) demo: any;


  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: center;
      }

      .demoCard {
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

      #demoActions {
        display: flex;
        justify-content: center;
      }

      #demoActions a {
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

      #demoActions a:hover {
        background-color: #9337d8;
        color: white;
      }

      @media (max-width: 640px) {
        .demoCard {
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
      <div class="demoCard">
        <div>
          <h3>${this.demo.name}</h3>
          <p>${this.demo.desc}</p>
        </div>

        <div id="demoActions">
          <a .href=${`demo/${this.demo.ID}`}>View Demo</a>
        </div>
      </div>
    `;
  }
}