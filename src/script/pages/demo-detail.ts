import { LitElement, css, html, customElement, property } from 'lit-element';
import { getADemo } from '../services/data';

import '../components/comp-toast';
import '../components/share-button';
import { Router } from '@vaadin/router';


@customElement('demo-detail')
export class DemoDetail extends LitElement {

  @property({ type: Object }) demo: any = null;

  static get styles() {
    return css`
      #headerBlock {
        margin-left: 3em;
        color: black;
        margin-top: 48px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 10em;
      }

      #headerBlock p {
        max-width: 34em;
      }

      #headerBlock h2 {
        margin-top: 0;
      }

      #learnMoreButton {
        border-radius: 20px;
        background: rgb(147, 55, 216);
        color: white;
        border: none;
        font-weight: bold;
        font-size: 14px;
        padding: 10px;
        padding-left: 14px;
        padding-right: 14px;

        text-decoration: none;

        cursor: pointer;

        display: inline-flex;
        width: 7em;
        justify-content: space-between;
      }

      #learnMoreButton img {
        width: 1.2em;
      }

      #installOptions {
        background: white;
        display: flex;
        flex-direction: column;
        border-radius: 0px 0px 6px 6px;
        padding: 5px;

        padding-left: 12px;
        align-items: flex-start;
        border-radius: 6px;
        margin-left: 1.8em;
        width: 10em;
        box-shadow: 0 0 4px 1px rgba(0,0,0,.18039);
        justify-content: flex-start;

        animation-name: appear;
        animation-duration: 200ms;
      }

      #installOptions button {
        height: 40px;
        font-weight: 600;
        font-size: 14px;
        line-height: 21px;
        background: none;
        color: #000;
        padding-left: 0;
        padding-right: 0;
        width: initial;
        border: none;
        cursor: pointer;

        width: 100%;
        text-align: start;
      }

      #compDetail {
        padding: 14px;
      }

      #actions {
        align-self: end;
        display: flex;
      }

      #actions button, #actions a {
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

      #actions a {
        width: 4em;
        text-decoration: none;
      }

      #demo {
        display: flex;
        margin-top: 2em;
        margin-bottom: 4em;

        flex-direction: column;
        align-items: start;
        margin-left: 9em;
        margin-right: 10em;
        color: black;
      }

      #demo iframe {
        width: 100%;
        height: 34em;
      }

      #readme {
        background: white;
        padding: 20px;
        border-radius: 12px;
        margin-top: 2em;
        margin-left: 9em;
        margin-right: 9em;
        overflow: auto;
      }

      #backButtonBlock {
        margin-right: 2em;
      }

      #backButton {
        height: 4em;
        border: none;
        background: white;
        border-radius: 50%;
        padding: 14px;
        width: 4em;
        cursor: pointer;
      }

      #backButton img {
        height: 100%;
      }

      #headerInfoBlock {
        display: flex;
        flex-direction: row;
        align-items: start;
      }

      @media(max-width: 800px) {
        #headerBlock, #demo, #readme {
          margin-left: 0;
          margin-right: 0;
        }

        #headerBlock {
          flex-direction: column;
        }

        #backButtonBlock {
          margin-right: 1em;
        }

        #demo iframe {
          width: 100%;
        }

        #actions {
          margin-top: 1em;
          margin-left: 4.4em;
        }
      }

      @keyframes appear {
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    this.demo = await getADemo((location.pathname.split("/").pop() as string));
    console.log(this.demo);

  }

  goBack() {
    Router.go('/?cat=demos');
  }

  render() {
    return html`
      <div id="compDetail">

        <section id="headerBlock">
          <div id="headerInfoBlock">

            <div id="backButtonBlock">
              <button @click="${() => this.goBack()}" id="backButton">
                <img src="/assets/back.svg" alt="back icon">
              </button>
            </div>

            <div>
              <h2>${this.demo?.name}</h2>

              <p>${this.demo?.desc}</P>

              <a .href="${this.demo?.learn_more}" id="learnMoreButton">
                Learn More

                <img src="/assets/link.svg" alt="link icon">
              </a>
            </div>
          </div>

          <div id="actions">
            <share-button></share-button>
            <a .href="${this.demo?.github_url}">Github</a>
          </div>
        </section>

        <section id="demo">
          <h2 id="demoHeader">Demo</h2>
          <iframe .src="${this.demo?.demo_url}"></iframe>
        </section>
      </div>
    `;
  }
}