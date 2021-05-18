///(page-pre-content
import "../../components/action-card.js";
import "../../components/page-panel.js";
import "../../components/page-body.js";
import "../../components/account-widget.js";
import "../../components/number-widget.js";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('token-page')
export default class TokenPage extends LitElement {
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


        <!-- Start: Mint !-->
        <div>
          <action-card
            title="Create Fungible Token"
            description="Create FT"
            action="createFT"
            method="post"
            fields="mintAuthority decimals">

            <account-widget
              field="mintAuthority"
              label="Mint Authority Account"
              placeholder="Account address">
            </account-widget>


            <number-widget
              field="decimals"
              label="Decimals: "
              placeholder="Decimal places"
              value="10">
            </number-widget>

          </action-card>
        </div>

        <action-card
            title="Get Sample Counter"
            description="Count how many times the counter was incremented"
            action="getCounter"
            method="get"
          >
          </action-card>
  
          <action-card
            title="Increment Counter"
            description="Increments the counter by one"
            action="incrementCounter"
            method="post"
          >
          </action-card>

      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
///)