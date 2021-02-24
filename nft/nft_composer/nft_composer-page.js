///(page-pre-content
import "../../components/page-panel.js";
import "../../components/page-body.js";
import "../../components/action-card.js";
import "../../components/account-widget.js";
import "../../components/text-widget.js";
import "../../components/number-widget.js";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('nft-composer-page')
export default class NftComposerPage extends LitElement {
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
          title="Transfer NFT"
          description="Transfer an NFT from one account to another"
          action="transfer"
          method="post"
          fields="accountGiver accountReceiver"
        >
          <account-widget
            field="accountGiver"
            label="Account Giver"
            placeholder="Account address to give"
          >
          </account-widget>
          <account-widget
            field="accountReceiver"
            label="Account Receiver"
            placeholder="Account address to receive"
          >
          </account-widget>
        </action-card>


        <action-card
          title="Setup an Account"
          description="Sets up an account so it can receive a NFT"
          action="setupAccount"
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

        <action-card
          title="Mint NFT"
          description="Mint an NFT into an account"
          action="mintNFT"
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


      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
///)
