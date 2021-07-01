///(page-pre-content
import "../components/page-panel.js";
import "../components/page-body.js";
import "../components/action-card.js";
import "../components/account-widget.js";
import "../components/text-widget.js";
import "../components/number-widget.js";
import "../components/switch-widget.js";
import "../components/custom_nft/generator/generator.js";

import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('custom-nft-harness')
export default class CustomNFTHarness extends LitElement {
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
      <page-body title="${this.title}" category="${this.category}" description="${this.description}">
        ///)
      
        ///(functions
        <action-card title="Provision an Account" description="Gives an account the necessary definitions to use NFTs"
          action="provisionAccount" method="post" fields="account">
          <account-widget field="account" label="Account" placeholder="Account address">
          </account-widget>
        </action-card>
      
        <custom-nft-generator></custom-nft-generator>
      
        <action-card title="Read NFTs" description="Read the NFTs in an account" action="readNFTs" method="get"
          fields="account">
          <account-widget field="account" label="Account" placeholder="Account address">
          </account-widget>
        </action-card>
      
        <action-card title="Read NFT Metadata" description="Read the Metadata for this NFT" action="readNFTMetadata"
          method="get" fields="account id">
          <account-widget field="account" label="Account" placeholder="Account address">
          </account-widget>
      
          <text-widget field="id" label="NFT ID" placeholder="ID of the NFT you wish to read"></text-widget>
        </action-card>
      
        <action-card title="Transfer NFT" description="Transfer an NFT from one account to another" action="transfer"
          method="post" fields="accountGiver accountReceiver withdrawID">
          <account-widget field="accountGiver" label="Account Giver" placeholder="Account address to give">
          </account-widget>
          <account-widget field="accountReceiver" label="Account Receiver" placeholder="Account address to receive">
          </account-widget>
          <text-widget field="withdrawID" label="NFT ID" placeholder="ID of the NFT you wish to trade"></text-widget>
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

