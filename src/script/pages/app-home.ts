import { LitElement, css, html, customElement, property } from 'lit-element';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import '../components/comp-card';

@customElement('app-home')
export class AppHome extends LitElement {

  @property({ type: Array }) comps: any[] | null = null

  static get styles() {
    return css`
      pwa-install {
        position: absolute;
        bottom: 16px;
        right: 16px;
      }

      button {
        cursor: pointer;
      }

      ul {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        grid-gap: 1rem;
      }

      #catBar {
        display: flex;
        justify-content: space-around;
      }

      #catBar button {
        background: linear-gradient(270deg,#242424 23.15%,#3c3c3c 57.68%);
        color: #fff;
        font-family: sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 21px;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        margin: 10px;
        width: 158px;
      }

      #headerText {
        color: white;
        margin-left: 6em;
        margin-right: 6em;
        margin-bottom: 64px;
      }

      #headerText p {
        font-size: 18px;
        width: 28em;
      }

      @media(max-width: 800px) {
        #headerText {
          margin-left: 0;
          margin-right: 0;
        }

        #headerText p {
          width: initial;
        }

        #catBar {
          display: flex;
          justify-content: space-between;
        }
      }

      @media(min-width: 1200px) {
        ul {
          margin-left: 6em;
          margin-right: 6em;
        }

        #catBar {
          margin-left: 11em;
          margin-right: 11em;
        }
      }

      @media(spanning: single-fold-vertical) {
        #welcomeBlock {
          width: 50%;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    await this.getAll();
  }

  async getAll() {
    const resp = await fetch('/assets/components.json');
    this.comps = await resp.json();
  }

  async changeCat(cat: string) {
    const resp = await fetch('/assets/components.json');
    const comps = await resp.json();

    let temp: any[] = [];
    comps.forEach((comp: any) => {
      if (comp.categories.includes(cat)) {
        temp.push(comp);
      }
    });

    this.comps = [...temp];
  }

  render() {
    return html`
      <div>

        <div id="headerText">
          <h1>PWABuilder Components</h1>

          <p>
Add that special something to supercharge your PWA. These cross-platform features can make your website work more like an app.</p>
        </div>

        <div id="catBar">
          <button @click=${this.getAll}>All</button>
          <button @click=${() => this.changeCat('pwa')}>PWA</button>
          <button @click=${() => this.changeCat('auth')}>Auth</button>
          <button @click=${() => this.changeCat('graph')}>Microsoft Graph</button>
          <button>Templates</button>
        </div>

        <ul>
          ${
            this.comps?.map((comp) => {
              return html`
                <comp-card .comp=${comp}></comp-card>
              `
            })
          }
        </ul>

        <pwa-install>Install PWA Starter</pwa-install>
      </div>
    `;
  }
}