///(page-pre-content
import "../../components/page-panel.js";
import "../../components/page-body.js";
import "../../components/action-card.js";
import "../../components/account-widget.js";
import "../../components/text-widget.js";
import "../../components/number-widget.js";
import "../../components/switch-widget.js";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('nft-studio-page')
export default class NFTStudio extends LitElement {
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

///(functions:language:solidity
      <div class="grid grid-cols-2 gap-6">
        <!-- START: SET URI and GET URI !-->
        <div>
          <action-card
            title="Set URI"
            description="Set URI of NFT"
            action="setURI"
            method="post"
            fields="authorized newURI">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="newURI"
              label="URI: "
              placeholder="Enter the URI here">
            </text-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Get URI"
            description="Get URI of NFT"
            action="getURI"
            method="get"
            fields="id">

            <text-widget
              field="id"
              label="ID: "
              placeholder="Enter the ID of the NFT here">
            </text-widget>
          </action-card>
        </div>
        <!-- END: SET URI and GET URI !-->

        <!-- Start: Mint !-->
        <div>
          <action-card
            title="Mint a single NFT/FT"
            description="If quantity is set to 1, it will be an NFT. If quantity is more than 1, it will be a FT."
            action="mint"
            method="post"
            fields="authorized account id amount data">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="account"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="id"
              label="ID: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="data"
              label="Data: "
              placeholder="Enter associated data in hex">
            </text-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Mint a batch of NFT/FT"
            description="If quantity is set to 1, it will be an NFT. If quantity is more than 1, it will be a FT."
            action="mintBatch"
            method="post"
            fields="authorized account id1 id2 id3 amount1 amount2 amount3 data">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="account"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="id1"
              label="ID 1: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount1"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="id2"
              label="ID 2: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount2"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="id3"
              label="ID 3: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount3"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="data"
              label="Data: "
              placeholder="Enter associated data in hex">
            </text-widget>
          </action-card>
        </div>
        <!-- End: Mint !-->

        <!-- START: Balance !-->
        <div>
          <action-card
            title="Get balance of an account for an ID"
            description="Get balance of an account for an ID"
            action="balanceOf"
            method="get"
            fields="account id">

            <account-widget
              field="account"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="id"
              label="ID: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Get balance of a batch of multiple accounts for multiple IDs"
            description="Get balance of a batch of multiple accounts for multiple IDs"
            action="balanceOfBatch"
            method="get"
            fields="account1 account2 account3 id1 id2 id3">

            <account-widget
              field="account1"
              label="Account 1"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="id1"
              label="ID 1: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <account-widget
              field="account2"
              label="Account 2"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="id2"
              label="ID 2: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <account-widget
              field="account3"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="id3"
              label="ID 3: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>
          </action-card>
        </div>
        <!-- End: Balance !-->

        <!-- Start: Proxy !-->
        <div>
          <action-card
            title="Set Approval"
            description="Give approval to a proxy to transfer funds on behalf of the main account"
            action="setApprovalForAll"
            method="post"
            fields="from operator approved">

            <account-widget
              field="from"
              label="Authorizing account"
              placeholder="Select account address">
            </account-widget>

            <account-widget
              field="operator"
              label="Proxy"
              placeholder="Select proxy address">
            </account-widget>

            <switch-widget 
              field="approved" 
              label="Approve" 
              placeholder="">
            </switch-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Check if the proxy is authorized"
            description="Check if the proxy is authorized"
            action="isApprovedForAll"
            method="get"
            fields="account operator">

            <account-widget
              field="account"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="operator"
              label="Operator"
              placeholder="Account address">
            </account-widget>
          </action-card>
        </div>
        <!-- End: Proxy !-->

        <!-- Start: Transfer !-->
        <div>
          <action-card
            title="Transfer NFT/FT"
            description="Transfer tokens from one account to another"
            action="safeTransferFrom"
            method="post"
            fields="authorized from to id amount data">

            <account-widget
              field="authorized"
              label="Proxy Account"
              placeholder="Proxy account">
            </account-widget>

            <account-widget
              field="from"
              label="Sender's Account"
              placeholder="Sender's account">
            </account-widget>

            <account-widget
              field="to"
              label="Recipient's Account"
              placeholder="Recipient's account">
            </account-widget>

            <text-widget
              field="id"
              label="ID: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="data"
              label="Data: "
              placeholder="Enter associated data in hex">
            </text-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Transfer a batch of NFT/FT"
            description="Transfer multiple kinds of tokens from one account to another"
            action="safeBatchTransferFrom"
            method="post"
            fields="authorized from to id1 id2 id3 amount1 amount2 amount3 data">

            <account-widget
              field="authorized"
              label="Proxy Account"
              placeholder="Proxy account">
            </account-widget>

            <account-widget
              field="from"
              label="Sender's Account"
              placeholder="Sender's account">
            </account-widget>

            <account-widget
              field="to"
              label="Recipient's Account"
              placeholder="Recipient's account">
            </account-widget>

            <text-widget
              field="id1"
              label="ID 1: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount1"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="id2"
              label="ID 2: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount2"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="id3"
              label="ID 3: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount3"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="data"
              label="Data: "
              placeholder="Enter associated data in hex">
            </text-widget>
          </action-card>
        </div>
        <!-- End: Transfer !-->

        <!-- Start: Burn !-->
        <div>
          <action-card
            title="Burn a single NFT/FT"
            description="If quantity is set to 1, it will be an NFT. If quantity is more than 1, it will be a FT."
            action="burn"
            method="post"
            fields="authorized account id amount">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="account"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="id"
              label="ID: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>
          </action-card>
        </div>

        <div>
          <action-card
            title="Burn a batch of NFT/FT"
            description="If quantity is set to 1, it will be an NFT. If quantity is more than 1, it will be a FT."
            action="burnBatch"
            method="post"
            fields="authorized account id1 id2 id3 amount1 amount2 amount3">

            <account-widget
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

            <account-widget
              field="account"
              label="Account"
              placeholder="Account address">
            </account-widget>

            <text-widget
              field="id1"
              label="ID 1: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount1"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="id2"
              label="ID 2: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount2"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>

            <text-widget
              field="id3"
              label="ID 3: "
              placeholder="Enter the ID of the NFT/FT here">
            </text-widget>

            <text-widget
              field="amount3"
              label="Quantity: "
              placeholder="Enter the quanity of the NFT/FT here">
            </text-widget>
          </action-card>
        </div>
        <!-- End: Burn !-->
      </div> 
///)
///(functions:language:cadence
        <action-card
          title="Provision an Account"
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

        <action-card
          title="Mint NFT"
          description="Mint an NFT into an account"
          action="mintNFT"
          method="post"
          fields="recipient"
        >

          <account-widget
            field="recipient"
            label="Recipient"
            placeholder="Recipient address"
          >
          </account-widget>
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


///)

///(page-post-content

      </page-body>
      <page-panel id="resultPanel"></page-panel>
    `;

    return content;
  }
}
///)

