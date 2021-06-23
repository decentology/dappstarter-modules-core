///(page-pre-content
import "../components/page-panel.js";
import "../components/action-card.js";
import "../components/page-body.js";
import "../components/account-widget.js";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("contract-access-harness")
export default class ContractAccessHarness extends LitElement {
  @property()
  title;
  @property()
  category;
  @property()
  description;

  createRenderRoot() {
    return this;
  }

  render() {
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ACCESS CONTROL: CONTRACT ACCESS  <<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    let content = html`
      <page-body
        title="${this.title}"
        category="${this.category}"
        description="${this.description}"
      >
        <action-card
          title="Is Contract Authorized"
          description="Check if a contract is authorized"
          action="isContractAuthorized"
          method="get"
          fields="account"
        >
          <account-widget
            field="account"
            label="Contract"
            placeholder="Contract address"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Authorize Contract"
          description="Authorize a contract. Functions must check using <code class='italic bg-orange-200 pr-1 pl-1'>requireContractAuthorized()</code>"
          action="authorizeContract"
          method="post"
          fields="account"
        >
          <account-widget
            field="account"
            label="Contract"
            placeholder="Account address of contract to authorize"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Deauthorize Contract"
          description="Deauthorize a contract"
          action="deauthorizeContract"
          method="post"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address of contract to deauthorize"
          >
          </account-widget>
        </action-card>
      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;
    return content;
  }
}
///)