import { LitElement, css, html, customElement, property } from 'lit-element';
import { getADemo } from '../services/data';

import '../components/comp-toast';
import '../components/share-button';
import { Router } from '@vaadin/router';
import { handleMarkdown } from '../services/detail';


@customElement('demo-detail')
export class DemoDetail extends LitElement {

  @property({ type: Object }) demo: any = null;
  @property({ type: String }) readme: string | null = null;

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

      #demoMain {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      #liveButton {
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
        margin-right: 4px;
        width: 7em;
        justify-content: center;
      }

      #learnMoreButton {
        border-radius: 20px;
        background: black;
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

        margin-top: 14px;
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

      #demo img {
        width: 100%;
        height: 30em;
        object-fit: contain;

        background: white;
        border-radius: 12px;
        padding-bottom: 18px;
        padding-top: 18px;
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

      #support {
        display: flex;
        flex-direction: column;

        background: white;
        width: 56%;
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

    if (this.demo.more_info) {
      const markdownData = await handleMarkdown(`/data/markdown/${this.demo.more_info}`);

      if (markdownData) {
        this.readme = markdownData;
      }
    }

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

            <div id="demoMain">
              <div>
                <h2>${this.demo?.name}</h2>

                <p>${this.demo?.desc}</P>

                <iframe width="560" height="315" src="${this.demo?.video_url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>

              <div>
                <a .href="${this.demo?.demo_url}" id="liveButton" target="_blank" rel="noopener noreferrer">
                  Live Demo
                </a>

                <a .href="${this.demo?.learn_more}" id="learnMoreButton" target="_blank" rel="noopener noreferrer">
                  Learn More

                  <img src="/assets/link.svg" alt="link icon">
                </a>
              </div>
            </div>
          </div>

          <div id="actions">
            <share-button></share-button>
            <a .href="${this.demo?.spec_url}" target="_blank" rel="noopener noreferrer">Spec</a>
            <a .href="${this.demo?.github_url}" target="_blank" rel="noopener noreferrer">Github</a>
          </div>
        </section>

        ${!this.demo?.video_url ? html`<section id="demo">
          <img .src="${this.demo?.screenshot_url}">
        </section>` : null}

        ${
          this.demo?.support ? html`
            <section id="support">
              <h3>Browser Support</h3>

              <div id="supportDetails">
                ${
                  this.demo?.support.map((platform: any) => {
                    return html`
                      <div class="supportBlock">
                        ${platform.browser}

                        ${platform.support ? html`<img src="/assets/check.svg" alt="checked">` : html`<img src="/assets/close.svg" alt="no support">`}
                      </div>
                    `
                  })
                }
              </div>
            </section>
          ` : null
        }

        ${this.readme ? html`<section id="readme" .innerHTML="${this.readme}"></section>` : null}
      </div>
    `;
  }
}