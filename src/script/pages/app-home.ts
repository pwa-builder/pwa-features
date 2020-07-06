import { LitElement, css, html, customElement, property } from 'lit-element';

// For more info on the @pwabuilder/pwainstall component click here https://github.com/pwa-builder/pwa-install
import '@pwabuilder/pwainstall';
import '../components/comp-card';
import '../components/demo-card';
import { getAll, getFeatured, searchComps, searchDemos, getDemos } from '../services/data';

@customElement('app-home')
export class AppHome extends LitElement {

  @property({ type: Array }) comps: any[] | null = null;
  @property({ type: Array }) featured: any[] | null = null;
  @property({ type: Array }) demos: any[] | null = null;

  @property({ type: String }) cat: string | null = null;
  @property({ type: String }) searchValue: string = '';

  static get styles() {
    return css`
      pwa-install {
        position: fixed;
        bottom: 16px;
        right: 16px;
        --install-button-color: var(--app-color-primary);
      }

      button {
        cursor: pointer;
        outline: none;
      }

      #compList {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        grid-gap: 1rem;
      }

      #featured ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        margin-bottom: 10px;

        min-height: 280px;
      }

      #featured comp-card {
        margin: 8px;
      }

      #featured h2 {
        text-align: center;
        color: black;
        font-size: 24px;
      }

      #noresults {
        text-align: center;
        color: black;
        font-size: 24px;
      }

      #catBar {
        display: flex;
        justify-content: space-around;

        position: sticky;
        top: 0;

        align-items: center;

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        background: #f0f0f03d;
        padding-top: 1em;
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
        margin: 2px;
        width: 140px;
      }

      #catBar button.active {
        background: linear-gradient(270deg,#622392 17.15%,#9337d8 52.68%);
      }

      #headerText {
        color: white;

        background: linear-gradient(45deg, #3f9ccd, #7160d3);
        background-repeat: no-repeat;
        padding-left: 144px;
        margin: 0;
        padding-bottom: 2em;
        padding-top: 2em;

        height: 140px;
      }

      #headerText h1 {
        font-size: 24px;
      }

      #headerText p {
        font-size: 16px;
        line-height: 22px;
        width: 28em;
      }

      #searchBlock {
        display: flex;
        align-items: center;
        margin-bottom: 30px;

        margin-top: 8px;

        justify-content: start;
      }

      #searchBlock #search {
        display: flex;
        flex-direction: column;
      }

      #searchInput {
        width: 28em;
        height: 38px;
        border: none;
        padding: 8px;
        border-radius: 4px;
        border: none;
      }

      #search label {
        font-weight: bold;
        color: black;
        margin-bottom: 8px;
      }

      @media(max-width: 800px) {
        #headerText {
          padding: 16px;
        }

        #headerText p {
          width: initial;
        }

        #catBar {
          display: flex;
          justify-content: space-between;
          flex-direction: column;

          white-space: nowrap;
          overflow: scroll;

          padding-bottom: 1em;
        }

        #featured ul {
          flex-direction: column;
        }

        #searchBlock {
          margin-left: 0;
          margin-top: 1em;

          width: 90%;
        }

        #searchBlock #search {
          width: 100%;
        }

        #searchInput {
          width: 100%;
        }
      }

      @media(min-width: 1200px) {
        ul {
          margin-left: 6em;
          margin-right: 6em;
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
    await this.doFeatured();
    await this.doGetAll();

    if (location.search.includes('demos')) {
      await this.changeCat('demos');
    }
  }

  async doFeatured() {
    this.featured = await getFeatured();
  }

  async doGetAll() {
    const data = await getAll();
    this.comps = [...data];

    this.cat = null;
  }

  async changeCat(cat: string) {
    if (cat === 'demos') {
      const demos = await getDemos();

      this.demos = [...demos];

      this.cat = cat;
    }
  }

  async handleSearch(event: InputEvent) {
    if (this.cat === 'demos') {
      this.searchValue = (event.target as HTMLInputElement)?.value;
      const searchedValues = await searchDemos(this.searchValue);
      this.demos = [...searchedValues];
    } else {   
      this.searchValue = (event.target as HTMLInputElement)?.value;
      const searchedValues = await searchComps(this.searchValue);
      this.comps = [...searchedValues];
    }
  }

  render() {
    return html`
      <div>

        <div id="headerText">
        ${this.cat !== 'demos'
        ? html`
          <h1>PWABuilder Components</h1>

          <p>
          Add that special something to supercharge your PWA. These cross-platform features can make your website work more like an app.</p>`
        : html`
          <h1>PWABuilder Demos</h1>

          <p>
           Interested in what the modern web can do? Check out our demos below to start playing with new web APIs!</p>
        `}
        </div>


        <div id="catBar">
          <div id="searchBlock">
            <div id="search">
              <label for="searchInput">Search</label>
              <input @input="${(event: InputEvent) => this.handleSearch(event)}" .value="${this.searchValue}" id="searchInput" name="searchInput" type="search" placeholder="install component...">
            </div>
          </div>

          <div id="cats">
            <button class="${this.cat === null ? 'active' : null}" aria-pressed="${this.cat === null ? 'true' : 'false'}" @click=${this.doGetAll}>Components</button>
            <button class="${this.cat === 'demos' ? 'active' : null}" aria-pressed="${this.cat === 'demos' ? 'true' : 'false'}" @click=${() => this.changeCat('demos')}>Demos</button>
          </div>
        </div>

        ${this.searchValue.length < 1 && this.cat === null ? html`<section id="featured">
          <h2>Featured</h2>

          <ul>
            ${
        this.featured?.map((comp) => {
          return html`
                  <comp-card .comp=${comp}></comp-card>
                `
        })
        }
          </ul>
        </section>` : null}

        ${this.cat === null ? html`<ul id="compList">
          ${this.comps?.length > 0 ? html `${this.comps?.map((comp) => {
          return html`
                <comp-card .comp=${comp}></comp-card>
              `
        })}` : html `<h2 id="noresults" role="alert">No results found</h2>`
        }
        </ul>` : null}

        ${
      this.cat === 'demos' ? html`

            <ul id="compList">
              ${
        this.demos?.length > 0 ? html `${this.demos?.map((demo) => {
          return html`
                    <demo-card .demo=${demo}></demo-card>
                  `
        })}` : html `<h2 id="noresults" role="alert">No results found</h2>`
        }
            </ul>
          ` : null
      }

        <pwa-install>Install App</pwa-install>
      </div>
    `;
  }
}