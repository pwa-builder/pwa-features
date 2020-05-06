import { LitElement, css, html, customElement } from 'lit-element';


@customElement('comp-toast')
export class CompToast extends LitElement {

  static get styles() {
    return css`
      #toast {
        position: absolute;
        bottom: 16px;
        right: 16px;
        background: slategrey;
        color: white;
        padding: 12px;
        border-radius: 6px;
        font-weight: bold;

        animation-name: slideup;
        animation-duration: 300ms;
      }

      @keyframes slideup {
        from {
          opacity: 0;
          transform: translateY(30px);
        }

        to {
          opacity: 1;
          transform: translateY(0px);
        }
      }
    `
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div id="toast">
        <slot></slot>
      </div>
    `
  }
}