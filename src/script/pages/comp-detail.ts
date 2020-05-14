import { LitElement, css, html, customElement, property } from 'lit-element';
import { getAComp } from '../services/data';
import { handleMarkdown } from '../services/detail';

import '../components/comp-toast';
import '../components/share-button';
import { Router } from '@vaadin/router';


@customElement('comp-detail')
export class CompDetail extends LitElement {

  @property({ type: Object }) comp: any = null;
  @property({ type: String }) readme: string | null = null;

  @property({ type: Boolean }) showOptions: boolean = false;
  @property({ type: Boolean }) showToast: boolean = false;

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
        background: white;
        display: flex;
        position: absolute;
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

        display: flex;
        align-items: center;
      }

      #installOptions button img {
        height: 100%;
        width: 1em;
        margin-right: 8px;
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

      #scrolledHeaderBlock {
        visibility: hidden;
        height: 0;
        opacity: 0;
        transition: opacity 0.3s;
      }

      #scrolledHeaderBlock.open {
        visibility: inherit;
        top: 0;
        position: sticky;
        display: flex;
        align-items: center;
        justify-content: space-between;
        left: 0;
        right: 0;
        background: #f0f0f0;
        z-index: 9999;
        height: 64px;
        opacity: 1;
      }

      #scrolledHeaderBlock #installOptions {
        margin-left: -10px;
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
    this.comp = await getAComp((location.pathname.split("/").pop() as string));
    console.log(this.comp);

    this.readme = await handleMarkdown(this.comp.readme_url) || null;
    await this.requestUpdate();

    this.handleObserver();
  }

  handleObserver() {
    const target = this.shadowRoot?.querySelector("#headerInfoBlock");
    const header = this.shadowRoot?.querySelector("#scrolledHeaderBlock");

    const iObserver = new IntersectionObserver(entries => {
      console.log(entries);
      if (entries[0].isIntersecting === true) {
        console.log('intersecting');
        header?.classList.remove('open');
      } else {
        console.log('not intersecting');
        header?.classList.add('open');
      }
    });

    if (target) {
      iObserver.observe(target);
    }
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

  goBack() {
    Router.go('/');
  }

  render() {
    return html`
      <div id="compDetail">

        <div id="scrolledHeaderBlock">
          <h3>${this.comp?.name}</h3>

          <button id="installButton" @click="${this.installComp}">
            Install Component

            ${this.showOptions ? html`<div id="installOptions">
              <button @click="${() => this.copyInstall("script")}">
                <img src="/assets/copy.svg" alt="copy icon">
                with script tag
              </button>
              <button @click="${() => this.copyInstall("npm")}">
                <img src="/assets/copy.svg" alt="copy icon">
                with npm
              </button>
            </div>` : null}
          </button>
        </div>

        <section id="headerBlock">
          <div id="headerInfoBlock">

            <div id="backButtonBlock">
              <button @click="${() => this.goBack()}" id="backButton">
                <img src="/assets/back.svg" alt="back icon">
              </button>
            </div>

            <div>
              <h2>${this.comp?.name}</h2>

              <p>${this.comp?.desc}</P>

              <button id="installButton" @click="${this.installComp}">
                Install Component
              </button>

              ${this.showOptions ? html`<div id="installOptions">
              <button @click="${() => this.copyInstall("script")}">
                <img src="/assets/copy.svg" alt="copy icon">
                with script tag
              </button>
              <button @click="${() => this.copyInstall("npm")}">
                <img src="/assets/copy.svg" alt="copy icon">
                with npm
              </button>
            </div>` : null}
            </div>
          </div>

          <div id="actions">
            <share-button></share-button>
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