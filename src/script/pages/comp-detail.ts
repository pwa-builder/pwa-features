import { LitElement, css, html, customElement, property } from 'lit-element';
import { getAComp } from '../services/data';
import { handleMarkdown } from '../services/detail';
import { Router } from '@vaadin/router';

import '../components/comp-toast';
import '../components/share-button';
import '../components/browser-support';
import { doCapture } from '../services/analytics';


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

      #compActionsBlock {
        display: flex;
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

        display: inline-flex;
        justify-content: space-between;
        align-items: center;
      }

      #installButton img {
        width: 14px;
        margin-left: 8px;
      }

      #demoVid {
        margin-bottom: 14px;
      }

      #mobileDemoVid {
        display: none;
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
        margin-top: 4em;
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
        margin-bottom: 2em;

        flex-direction: column;
        align-items: start;
        margin-left: 9em;
        margin-right: 10em;
        color: black;
      }

      #demo iframe {
        width: 100%;
        height: 26em;
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
        width: 4em;
        border: none;
        background: white;
        border-radius: 50%;
        padding: 20%;
        width: 4em;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #backButton img {
        height: 100%;
        width: 100%;
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
        padding-left: 1em;
        padding-right: 1em;

        background: #ffffff9e;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
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
        z-index: 9999;
        height: 64px;
        opacity: 1;
      }

      #scrolledHeaderBlock #installOptions {
        margin-left: -10px;
      }

      #scrolledHeaderBlock #headerBackButtonBlock {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #scrolledHeaderBlock #headerBackButtonBlock #backButton {
        margin-right: 14px;
        height: 3em;
        width: 3em;
        padding: 10px;
      }

      #docsLink {
        color: white;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        border-radius: 20px;
        background: black;
        border-width: initial;
        border-style: none;
        border-color: initial;
        border-image: initial;
        padding: 10px 14px;
        text-decoration: none;
        margin-left: 4px;
        
        display: flex;
        align-items: center;

        width: 9em;
        display: inline-flex;
        justify-content: space-between;
      }

      #docsLink img {
        width: 1.2em;
      }

      #detailInfoBlock {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      #liveDemoLink {
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
        margin-right: 4px;
        margin-left: 6px;
        width: 7em;
        justify-content: center;
        height: 16.8px;
      }

      #liveDemoLink img {
        width: 1.2em;
        margin-left: 8px;
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

        #mobileDemoVid {
          display: block;
          width: 100%;
          margin-top: 2em;
          border-radius: 8px;
        }

        #demoVid {
          display: none;
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

    // this.readme = await handleMarkdown(this.comp.readme_url) || null;
    const readmeData = await handleMarkdown(this.comp.readme_url) || null;

    if (readmeData?.includes('404') === false) {
      this.readme = readmeData;
    }

    await this.requestUpdate();

    this.handleObserver();
  }

  handleObserver() {
    const target = this.shadowRoot?.querySelector("#headerInfoBlock");
    const header = this.shadowRoot?.querySelector("#scrolledHeaderBlock");

    const iObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting === true) {
        header?.classList.remove('open');
      } else {
        header?.classList.add('open');
      }
    });

    if (target) {
      iObserver.observe(target);
    }
  }

  installComp() {
    this.showOptions = !this.showOptions;

    const config =  {
      uri: window.location.href,
      pageName: `${this.comp?.name}`,
      pageHeight: window.innerHeight
    }
    doCapture(config);
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
    <link rel="stylesheet"
      href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.1.1/build/styles/default.min.css">
      
      <meta property="og:title" content="${this.comp?.name}">
      <meta property="og:description" content="Check out this component on PWABuilder.">
      <meta property="og:image" content="${this.comp?.screenshot_url}">
      <meta property="og:url" content="${location.href}">
      <meta name="twitter:card" content="summary_large_image">

      <div id="scrolledHeaderBlock">
        <div id="headerBackButtonBlock">
          <button @click="${() => this.goBack()}" id="backButton" aria-label="Back">
            <img src="/assets/back.svg" alt="back icon">
          </button>

          <h3>${this.comp?.name}</h3>
        </div>

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

      <div id="compDetail">

        <section id="headerBlock">
          <div id="headerInfoBlock">

            <div id="backButtonBlock">
              <button @click="${() => this.goBack()}" id="backButton">
                <img src="/assets/back.svg" alt="back icon">
              </button>
            </div>

            <div id="detailInfoBlock">
              <h2>${this.comp?.name}</h2>

              <p>${this.comp?.desc}</P>

              ${this.comp?.video_url ? html`<iframe id="demoVid" width="560" height="315" src="${this.comp?.video_url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : null}

              <div id="compActionsBlock">
                <button id="installButton" @click="${this.installComp}">
                  Install Component

                  <img src="/assets/down.svg" alt="dropdown">

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

                ${
      this.comp?.live_demo_url && !this.comp?.embed ? html`
                    <a id="liveDemoLink" href="${this.comp?.live_demo_url}" target="_blank" rel="noopener noreferrer">
                    Live demo

                    <img src="/assets/link.svg" alt="link icon">
                    </a>
                  ` : null
      }

${this.comp?.docs_url ? html`<a id="docsLink" .href="${this.comp?.docs_url}">Documentation <img src="/assets/link.svg" alt="link icon"></a>` : null}
              </div>

            </div>
          </div>

          <div id="actions">
            <share-button></share-button>
            <a .href="${this.comp?.github_url}" target="_blank" rel="noopener noreferrer">Github</a>
            <a .href="${this.comp?.npm_url}" target="_blank" rel="noopener noreferrer">npm</a>
          </div>
        </section>

        ${this.comp?.video_url ? html`<iframe id="mobileDemoVid" width="560" height="315" src="${this.comp?.video_url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : null}

        ${this.comp?.embed && !this.comp?.live_demo_url ? html`<section id="demo">
          <h2 id="demoHeader">Demo</h2>
          <iframe .src="${this.comp?.embed}"></iframe>
        </section>` : null}

        ${
      this.comp?.support ? html`
            <section id="support">
              <browser-support .supportData="${this.comp?.support}"></browser-support>
            </section>
          ` : null
      }

        ${this.readme ? html`<section id="readme" .innerHTML="${this.readme}"></section>` : null}

        ${this.showToast ? html`<comp-toast>copied to your clipboard</comp-toast>` : null}
      </div>
    `;
  }
}