///(page-pre-content
import "../../components/shared/action-card.js";
import "../../components/page-panel.js";
import "../../components/page-body.js";
import "../../components/widgets/account-widget.js";
import "../../components/widgets/number-widget.js";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('onchain-token-page')
export default class OnchainTokenPage extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);

  }

  render() {
    let content = html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
///)