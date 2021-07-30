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

@customElement('pack-nft-harness')
export default class PackNFTHarness extends LitElement {
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
        <!-- Flow Token -->
        <action-card title="Flow Token - Mint Flow Tokens" description="Mint Flow Tokens" action="mintFlowTokens"
          method="post" fields="amount recipient">
      
          <text-widget field="amount" label="Amount" placeholder="30.0">
          </text-widget>
      
          <account-widget field="recipient" label="Recipient">
          </account-widget>
      
        </action-card>
      
        <action-card title="Flow Token - Get Flow Balance" description="Get Flow Balance" action="getFlowBalance" method="get"
          fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="NFT - Provision an Account for NFTs" description="Gives an account the ability to deal with NFTs"
          action="provisionNFTs" method="post" fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="NFT - Get Owned NFTs" description="Get Owned NFTs" action="getNFTsInCollection" method="get"
          fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Provision an Account for Packs"
          description="Gives an account the ability to deal with Packs" action="provisionPacks" method="post"
          fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Add Pack Type" description="Add a new Pack Type to mint" action="addPackType"
          method="post" fields="packType numberOfNFTs">
      
          <text-widget field="packType" label="Pack Type" placeholder="5">
          </text-widget>
      
          <text-widget field="numberOfNFTs" label="Number of NFT" placeholder="3">
          </text-widget>
      
        </action-card>
      
        <action-card title="Packs - Mint Pack" description="Mint a Pack into the Admin's account" action="mintPacks"
          method="post" fields="packType numberOfPacks">
      
          <text-widget field="packType" label="Pack Type" placeholder="5">
          </text-widget>
      
          <text-widget field="numberOfPacks" label="Number of Packs" placeholder="4">
          </text-widget>
      
        </action-card>
      
        <action-card title="Packs - Get Owned Packs" description="Get the Pack IDs of all the Packs you own"
          action="getOwnedPacks" method="get" fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Get Pack Info" description="Get the info of a Pack" action="getPackInfo" method="get"
          fields="id acct">
      
          <text-widget field="id" label="Pack ID" placeholder="0">
          </text-widget>
      
          <account-widget field="acct" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Get Pack Type Info" description="Get the info of a Pack Type" action="getPackTypeInfo"
          method="get" fields="packType">
      
          <text-widget field="packType" label="Pack Type" placeholder="5">
          </text-widget>
      
        </action-card>
      
        <action-card title="Packs - Transfer Pack" description="Transfer Pack" action="transferPack" method="post"
          fields="giver id recipient">
      
          <account-widget field="giver" label="Giver">
          </account-widget>
      
          <text-widget field="id" label="Pack ID" placeholder="0">
          </text-widget>
      
          <account-widget field="recipient" label="Recipient">
          </account-widget>
      
        </action-card>
      
        <action-card title="Packs - Open Pack" description="Open Pack" action="openPack" method="post" fields="id recipient">
      
          <text-widget field="id" label="Pack ID" placeholder="0">
          </text-widget>
      
          <account-widget field="recipient" label="Pack Owner">
          </account-widget>
      
        </action-card>
      
        <action-card title="NFT - Transfer NFT" description="Transfer NFT" action="transferNFT" method="post"
          fields="giver id recipient">
      
          <account-widget field="giver" label="Giver">
          </account-widget>
      
          <text-widget field="id" label="ID" placeholder="0">
          </text-widget>
      
          <account-widget field="recipient" label="Recipient">
          </account-widget>
      
        </action-card>
      
        <action-card title="NFT - Get NFT Info" description="Get NFT Info" action="getNFTInfo" method="get"
          fields="account id">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
          <text-widget field="id" label="ID" placeholder="0">
          </text-widget>
      
        </action-card>
      
        <!-- Marketplace -->
      
        <action-card title="Marketplace - Provision an Account for a Marketplace"
          description="Gives an account the ability to interact with a Marketplace" action="provisionMarketplace"
          method="post" fields="account">
      
          <account-widget field="account" label="Account">
          </account-widget>
      
        </action-card>
      
        <action-card title="Marketplace - List Packs for sale"
          description="List Packs for sale. Price must be of type double." action="listPacksForSale" method="post"
          fields="price">
      
          <text-widget field="price" label="Price" placeholder="10.0">
          </text-widget>
      
        </action-card>
      
        <action-card title="Marketplace - Get Available Packs" description="Get the Available Packs to Buy"
          action="getPacksAvailable" method="get" fields="">
        </action-card>
      
        <action-card title="Marketplace - Buy Pack" description="Buy a Pack" action="buyPack" method="post"
          fields="id recipient">
      
          <text-widget field="id" label="Pack ID" placeholder="0">
          </text-widget>
      
          <account-widget field="recipient" label="Recipient">
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

