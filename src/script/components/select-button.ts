import { LitElement, css, html, customElement, property } from "lit-element";

@customElement("select-button")
export class SelectButton extends LitElement {
  @property({ type: Boolean }) showMenu: boolean = false;

  private componentIdList: Set<String>;

  static get styles() {
    return css`
      .selectMenuBlock {
        display: flex;
      }
    `;
  }

  constructor() {
    super();
    this.componentIdList = new Set();
  }

  render() {
    return html`<div
      class="selectMenuBlock"
      @focusout="${this.handleFocusOut}"
      @keyup=${this.handleKeyUp}
    >
      <slot name="button" @slotchange="${this.handleSlotChange}"></slot>
      ${this.showMenu
        ? html`<slot name="menu" @slotchange="${this.handleSlotChange}"></slot>`
        : null}
    </div>`;
  }

  handleFocusOut(evt: FocusEvent) {
    // Generate when focus events once when they are relevant
    if (this.componentIdList.size === 0) {
      this.generateComponentIdList();
    }

    const focusOutComponentId = (<HTMLElement>evt?.relatedTarget)?.id;
    if (
      this.showMenu &&
      !this.componentIdList.has(focusOutComponentId)
    ) {
      this.close();
    }
  }

  handleKeyUp(evt: KeyboardEvent) {
    const keyStroke = evt.key;
    if (keyStroke === "Escape") {
      this.close();
    }
  }

  handleSlotChange() {
    // Clear list if a slot changes values, warning: this doesn't trigger if a child node changes.
    this.componentIdList.clear();
  }

  close() {
    let event = new CustomEvent("close-select-menu", {
      composed: true,
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  private generateComponentIdList() {
    const slots = this.shadowRoot?.querySelectorAll("slot") || [];
    let queue: Array<Node | HTMLElement> = [];

    if (slots) {
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        queue.push(...slot.assignedNodes({ flatten: true }));
      }
    }

    let queuePos = 0;
    while (queuePos < queue.length) {
      let current = queue[queuePos] as HTMLElement;
      if (current.children) {
        // Typescript being really picky as HTMLElementCollection cannot typecast into Array<HTMLElement>
        queue = queue.concat(...(current.children as unknown) as Array<HTMLElement>);
      }

      if (current.id) {
        this.componentIdList.add(current.id);
      }

      queuePos++;
    }
  }
}