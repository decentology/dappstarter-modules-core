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

@customElement('fast-floward-harness')
export default class FastFlowardHarness extends LitElement {
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
      
        <!-- DAY 1 -->
      
        <action-card title="DAY 1: Kibble - Setup Account" description="Setup Account to handle Kibble"
          action="kibbleSetupAccount" method="post" fields="signer">
          <account-widget field="signer" label="Signer">
          </account-widget>
        </action-card>
      
        <action-card title="DAY 1: Kibble - Get Balance" description="Get Kibble balance in an account"
          action="kibbleGetBalance" method="get" fields="address">
          <account-widget field="address" label="Address">
          </account-widget>
        </action-card>
      
        <action-card title="DAY 1: Kibble - Get Supply" description="Get the total supply of Kibble" action="kibbleGetSupply"
          method="get" fields="">
        </action-card>
      
        <!-- DAY 2 -->
      
        <action-card title="DAY 2: Kibble - Mint Tokens" description="Mint Kibble into an account" action="kibbleMintTokens"
          method="post" fields="recipient amount">
          <account-widget field="recipient" label="Recipient">
          </account-widget>
          <text-widget field="amount" label="Amount" placeholder="30.0"></text-widget>
        </action-card>
      
        <action-card title="DAY 2: Kibble - Transfer Tokens" description="Transfer Kibble from the signer -> recipient"
          action="kibbleTransferTokens" method="post" fields="signer amount recipient">
          <account-widget field="signer" label="Signer">
          </account-widget>
          <text-widget field="amount" label="Amount" placeholder="30.0"></text-widget>
          <account-widget field="recipient" label="Recipient">
          </account-widget>
        </action-card>
      
        <!-- DAY 3 -->
      
        <action-card title="DAY 3: Kitty Items - Setup Account" description="Setup Account to handle Kitty Items"
          action="kittyItemsSetupAccount" method="post" fields="signer">
          <account-widget field="signer" label="Signer">
          </account-widget>
        </action-card>
      
        <action-card title="DAY 3: Kitty Items - Mint Kitty Item" description="Mint a Kitty Item into an account"
          action="kittyItemsMintKittyItem" method="post" fields="recipient typeID">
          <account-widget field="recipient" label="Recipient">
          </account-widget>
          <text-widget field="typeID" label="Type ID" placeholder="5"></text-widget>
        </action-card>
      
        <action-card title="DAY 3: Kitty Items - Transfer Kitty Item"
          description="Transfer a Kitty Item from the signer -> recipient" action="kittyItemsTransferKittyItem" method="post"
          fields="signer recipient withdrawID">
          <account-widget field="signer" label="Signer">
          </account-widget>
          <account-widget field="recipient" label="Recipient">
          </account-widget>
          <text-widget field="withdrawID" label="Withdraw ID" placeholder="0"></text-widget>
        </action-card>
      
        <action-card title="DAY 3: Kitty Items - Read Collection IDs" description="Read the NFT IDs in this Collection"
          action="kittyItemsReadCollectionIDs" method="get" fields="address">
          <account-widget field="address" label="Address">
          </account-widget>
        </action-card>
      
        <action-card title="DAY 3: Kitty Items - Read Collection Length" description="Read the # of NFTs in this Collection"
          action="kittyItemsReadCollectionLength" method="get" fields="address">
          <account-widget field="address" label="Address">
          </account-widget>
        </action-card>
      
        <action-card title="DAY 3: Kitty Items - Read Kitty Item Type ID" description="Get the Kitty Item's Type ID"
          action="kittyItemsReadKittyItemTypeID" method="get" fields="address itemID">
          <account-widget field="address" label="Address">
          </account-widget>
          <text-widget field="itemID" label="Item ID" placeholder="0"></text-widget>
        </action-card>
      
        <action-card title="DAY 3: Kitty Items - Read Kitty Items Supply"
          description="Get the total supply of Kitty Items in the ecosystem" action="kittyItemsReadKittyItemsSupply"
          method="get" fields="">
        </action-card>
      
        <!-- DAY 4 -->
      
        <action-card title="DAY 4: Kitty Items Market - Setup Account"
          description="Setup Account to handle a Kitty Items Marketplace" action="kittyItemsMarketSetupAccount" method="post"
          fields="signer">
          <account-widget field="signer" label="Signer">
          </account-widget>
        </action-card>
      
        <!-- TODO: Implement this action card -->
        <!-- NOTE: This is a transaction -->
        <action-card title="DAY 4: Kitty Items Market - Sell Market Item">
      
        </action-card>
      
        <action-card title="DAY 4: Kitty Items Market - Remove Market Item"
          description="Remove a Kitty Item from the Marketplace" action="kittyItemsMarketRemoveMarketItem" method="post"
          fields="signer itemID">
          <account-widget field="signer" label="Signer">
          </account-widget>
          <text-widget field="itemID" label="Item ID" placeholder="0"></text-widget>
        </action-card>
      
        <!-- TODO: Implement this action card -->
        <!-- NOTE: This is a transaction -->
        <action-card title="DAY 4: Kitty Items Market - Buy Market Item">
      
        </action-card>
      
        <!-- TODO: Implement this action card -->
        <!-- NOTE: This is a script -->
        <action-card title="DAY 4: Kitty Items Market - Read Sale Collection IDs">
      
        </action-card>
      
        <action-card title="DAY 4: Kitty Items Market - Read Sale Collection Length"
          description="Read the # of NFTs for sale in this account" action="kittyItemsMarketReadSaleCollectionLength"
          method="get" fields="marketCollectionAddress">
          <account-widget field="marketCollectionAddress" label="Market Collection Address">
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

