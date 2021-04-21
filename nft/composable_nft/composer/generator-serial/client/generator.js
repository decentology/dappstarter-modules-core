import { LitElement, html, customElement, property } from "lit-element";

@customElement('composable-nft-generator')
export default class ComposableNftGenerator extends LitElement {

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
    `;
    return content;
  }

}


