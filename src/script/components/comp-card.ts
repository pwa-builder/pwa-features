import { LitElement, css, html, customElement, property } from 'lit-element';


@customElement('comp-card')
export class CompCard extends LitElement {

  @property({ type: Object }) comp: any;
  

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: center;
      }
    
      .compCard {
        width: 380px;
        height: 247px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        background: white;
        padding: 20px;
        border-radius: 4px;

        transition: all 300ms;
      }

      .compCard:hover {
        box-shadow: 0 0 11px 4px #b9b9b9;    
      }

      h3 {
        font-size: 20px;
        font-weight: 700;
        margin-top: 0;
      }

      #cardActions {
        display: flex;
        justify-content: flex-end;
      }

      #cardActions a {
        text-decoration: none;
        font-size: 14px;
        font-weight: bold;
        color: white;
        background-color: #9337d8;
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

        <div id="cardActions">
          <a .href=${`component/${this.comp.ID}`}>View Component</a>
        </div>
      </div>
    `;
  }
}