import "../../action-card.js"
import "../../text-widget.js"
import "../../account-widget.js"

import { LitElement, html, customElement, property } from "lit-element";
import DappLib from "@decentology/dappstarter-dapplib";

@customElement('custom-nft-generator')
export default class CustomNftGenerator extends LitElement {

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  render() {
    let content = html`
      <action-card
        title="Mint Serial"
        description="Mint a Serial NFT"
        action="mintNFT"
        method="post"
        fields="account metaData-serial"
      >
        <account-widget
          field="account"
          label="Account"
          placeholder="Account address"
        >
        </account-widget>

        <text-widget
          field="metaData-serial"
          label="Serial"
          placeholder="Serial"
        >
        </text-widget>
      </action-card>
    `;
    return content;
  }

}


