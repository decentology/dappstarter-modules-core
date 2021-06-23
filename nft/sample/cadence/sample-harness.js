///(page-pre-content
import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('sample-harness')
export default class SampleHarness extends LitElement {
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
///)

///(functions
        <action-card
          title="Sample Action Card"
          description="Gives an account the necessary definitions to use NFTs"
          action="provisionAccount"
          method="post"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address"
          >
          </account-widget>
        </action-card>



///)

///(page-post-content

      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
///)

