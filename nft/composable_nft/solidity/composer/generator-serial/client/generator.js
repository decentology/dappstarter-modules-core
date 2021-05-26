import { LitElement, html, customElement, property } from "lit-element";
import "../../account-widget.js"
import "../../action-button.js";
import DappLib from "@decentology/dappstarter-dapplib";

@customElement('composable-nft-generator')
export default class ComposableNftGenerator extends LitElement {

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
    this.metaData = {
      serial: ''
    }
  }

  async actionHandler(e) {
    let serial = document.getElementById('serial').value;
    this.metaData.serial = serial;
  }

  render() {
    let content = html`
    <div class="shadow rounded-md bg-white mb-10 p-1" id="serial-gen">
        <div
          class="text-white p-3 bg-blue-400 flex justify-between items-center rounded-md rounded-b-none"
        >
          <h5 class="font-bold">Mint Serial NFT</h5>
        </div>
        <div
          class="slot ${this.innerHTML.indexOf("<") > -1 ? "p-3" : ""}"
          id="serial-creator"
        >

        <account-widget
              id="authorized"
              field="authorized"
              label="From Account"
              placeholder="Account address">
            </account-widget>

        <account-widget
              field="account"
              id="account"
              label="To Account"
              placeholder="Account address">
            </account-widget>

        <div class="input-group flex mb-3">
          <label
            class="bg-gray-200 p-2 block rounded rounded-r-none text-gray-500"
            >ID:</label
          >
          <input
            type="text"
            id="id"
            data-field="id"
            class="shadow-inner appearance-none border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter the ID of the NFT"
          />
        </div>

        <div class="input-group flex mb-3">
          <label
            class="bg-gray-200 p-2 block rounded rounded-r-none text-gray-500"
            >Serial:</label
          >
          <input
            type="text"
            id="serial"
            data-field="metaData-serial"
            value="${this.metaData.serial}"
            class="shadow-inner appearance-none border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter the Serial of the NFT"
          />
        </div>

        <div class="bg-gray-300 p-1 rounded-md rounded-t-none">
          <div class="p-2 flex items-center justify-between">
            <div>
              Mint Serial NFT
            </div>
            <action-button
              source="#serial-gen"
              action="mintNFT"
              fields="authorized account id amount metaData-serial"
              method="post"
              return="${this.return}"
              .click=${this.actionHandler}
            />
          </div>
        </div>
      </div>
    </div>
    `;
    return content;
  }

}


