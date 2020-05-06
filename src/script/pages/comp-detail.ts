import { LitElement, css, html, customElement, property } from 'lit-element';
import { getAComp } from '../services/data';
import { handleMarkdown } from '../services/detail';

import '../components/comp-toast';


@customElement('comp-detail')
export class CompDetail extends LitElement {

  @property({ type: Object }) comp: any = null;
  @property({ type: String }) readme: string | null = null;

  @property({ type: Boolean }) showOptions: boolean = false;
  @property({ type: Boolean }) showToast: boolean = false;

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

      #installButton {
        border-radius: 20px;
        background: rgb(147, 55, 216);
        color: white;
        border: none;
        font-weight: bold;
        font-size: 14px;
        padding: 10px;
        padding-left: 14px;
        padding-right: 14px;

        cursor: pointer;
      }

      #installOptions {
        background: #9337d8;
        width: 8.73em;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 0px 0px 6px 6px;
        padding: 5px;
        margin-top: -.9em;
        padding-top: 22px;

        animation-name: appear;
        animation-duration: 200ms;
      }

      #installOptions button {
        background: white;
        color: #9337d8;
        padding: 5px;
        padding-left: 10px;
        padding-right: 10px;
        margin-bottom: 8px;
        font-weight: bold;
        border: none;
        border-radius: 22px;
        width: 100%;
        cursor: pointer;
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

        #actions {
          margin-top: 1em;
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
    this.comp = await getAComp((location.pathname.split("/").pop() as string));
    console.log(this.comp);

    this.readme = await handleMarkdown(this.comp.readme_url) || null;
    await this.requestUpdate();
    console.log(this.readme);
  }

  installComp() {
    this.showOptions = !this.showOptions;
  }

  async copyInstall(type: string) {
    try {

      if (type === "script") {
        await navigator.clipboard.writeText(`<script type="module" src="${this.comp.install_url}"></script>`);
      }
      else if (type === "npm") {
        await navigator.clipboard.writeText(`npm install ${this.comp.package_name}`);
      }

      this.showOptions = false;

      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 3000)
    }
    catch (err) {
      console.error(err);
    }
  }

  render() {
    return html`
      <div id="compDetail">

        <section id="headerBlock">
          <div>
            <h2>${this.comp?.name}</h2>

            <p>${this.comp?.desc}</P>

            <button id="installButton" @click="${this.installComp}">
              Install Component
            </button>

            ${this.showOptions ? html`<div id="installOptions">
              <button @click="${() => this.copyInstall("script")}">with script tag</button>
              <button @click="${() => this.copyInstall("npm")}">with NPM</button>
            </div>` : null}
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

        ${this.showToast ? html`<comp-toast>copied to your clipboard</comp-toast>` : null}
      </div>
    `;
  }
}