import { LitElement, css, html, customElement, property } from 'lit-element';
import { getAComp } from '../services/data';
import { handleMarkdown } from '../services/detail';


@customElement('comp-detail')
export class CompDetail extends LitElement {

  @property({ type: Object }) comp: any = null;
  @property({ type: String }) readme: string | null = null;

  static get styles() {
    return css`
      #headerBlock {
        margin-left: 9em;
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
        width: 78%;
        height: 22em;
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

      @media(max-width: 800px) {
        #headerBlock, #demo, #readme {
          margin-left: 0;
          margin-right: 0;
        }

        #headerBlock {
          flex-direction: column;
        }

        #demo iframe {
          width: 100%;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    this.comp = await getAComp((location.pathname.split("/").pop() as string));
    console.log(this.comp);

    this.readme = await handleMarkdown(this.comp.readme_url) || null;
    await this.requestUpdate();
    console.log(this.readme);
  }

  render() {
    return html`
      <div>

        <section id="headerBlock">
          <div>
            <h2>${this.comp?.name}</h2>

            <p>${this.comp?.desc}</P>
          </div>

          <div id="actions">
            <button>Share</button>
            <a .href="${this.comp?.github_url}">Github</a>
            <a .href="${this.comp?.npm_url}">npm</a>
          </div>
        </section>

        <section id="demo">
          <h2 id="demoHeader">Demo</h2>
          <iframe .src="${this.comp?.embed}"></iframe>
        </section>

        <section id="readme" .innerHTML="${this.readme}"></section>
      </div>
    `;
  }
}