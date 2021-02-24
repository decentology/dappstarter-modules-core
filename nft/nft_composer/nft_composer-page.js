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
///)

///(functions:language:cadence
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
          fields="admin recipient"
        >
          <account-widget
            field="admin"
            label="Admin"
            placeholder="Admin address"
          >
          </account-widget>
          <account-widget
            field="recipient"
            label="Recipient"
            placeholder="Recipient address"
          >
          </account-widget>
        </action-card>

        <action-card
          title="Transfer NFT"
          description="Transfer an NFT from one account to another"
          action="transfer"
          method="post"
          fields="accountGiver accountReceiver nftToGive"
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
          <text-widget
            field="nftToGive"
            label="NFT ID"
            placeholder="ID of the NFT you wish to trade"
          ></text-widget>
        </action-card>

        <action-card
          title="Read NFTs"
          description="Read the NFTs in an account"
          action="readNFTs"
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
///)

///(functions:language:solidity
    // Jacob is cool
///)
///(page-post-content

      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
///)

