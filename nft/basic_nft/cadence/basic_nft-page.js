///(page-pre-content
import "../../components/page-panel.js";
import "../../components/page-body.js";
import "../../components/action-card.js";
import "../../components/account-widget.js";
import "../../components/text-widget.js";
import "../../components/number-widget.js";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('basic-nft-page')
export default class BasicNftPage extends LitElement {
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

        <action-card
          title="Setup Account"
          description="Setup an Account"
          action="setupAccount"
          method="post"
          fields="acct"
        >
          <account-widget
            field="acct"
            label="Account"
            placeholder="Account address"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Mint NFT"
          description="Mint an NFT into an account"
          action="mintNFT"
          method="post"
          fields="recipient"
        >
          <account-widget
            field="recipient"
            label="Account"
            placeholder="Account receiving the NFT"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Transfer NFT"
          description="Transfer an NFT from one account to another"
          action="transferNFT"
          method="post"
          fields="acct recipient withdrawID"
        >
          <account-widget
            field="acct"
            label="Account"
            placeholder="Account giving the NFT"
          >
          </account-widget>

          <account-widget
            field="recipient"
            label="Account"
            placeholder="Account receiving the NFT"
          >
          </account-widget>

          <text-widget
              field="withdrawID"
              label="Withdraw ID"
              placeholder="ID of the NFT to be transfered"
          >
          </text-widget>
        </action-card>

        <action-card
          title="Read Collection IDs"
          description="Read the NFT IDs in an account"
          action="readCollectionIDs"
          method="get"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Read Collection Length"
          description="Read the length of a collection in an account"
          action="readCollectionLength"
          method="get"
          fields="account"
        >
          <account-widget
            field="account"
            label="Account"
            placeholder="Account address"
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
