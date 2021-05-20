import { LitElement, html, customElement, property } from "lit-element";
import DappLib from "@decentology/dappstarter-dapplib";

@customElement('composable-nft-generator')
export default class ComposableNftGenerator extends LitElement {

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
  }

  async actionHandler(e) {
    console.log("Hello from action handler");
    let authorized = document.getElementById('authorized').value;
    let account = document.getElementById('to-account').value;
    let id = document.getElementById('id').value;
    let serial = document.getElementById('serial').value;

    let data = {
      authorized: authorized,
      account: account,
      id: id,
      amount: 1,
      metaData: {
        serial: serial
      }
    };
    let retVal = await DappLib[this.action].call(null, data);
  }

  render() {
    let content = html`
    <div class="shadow rounded-md bg-white mb-10 p-1" id="serial-gen">
        <input type="hidden" id="scale" data-field="scale" value="${this.scale}" />
        <input type="hidden" id="mdna" data-field="mdna" value="" />
        <div
          class="text-white p-3 bg-blue-400 flex justify-between items-center rounded-md rounded-b-none"
        >
          <h5 class="font-bold">Mint Serial NFT</h5>
        </div>
        <div
          class="slot ${this.innerHTML.indexOf("<") > -1 ? "p-3" : ""}"
          id="serial-creator"
        >

        <div class="input-group flex mb-3 pl-5 pt-5">
            <label class="bg-gray-200 p-2 block rounded rounded-r-none text-gray-500">From Account:</label>
            <select id="authorized" data-field="authorized" class="shadow-inner border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option>0xb1ac66b49fdc369879123332f2cdd98caad5f75a</option>
                <option>0x0d27a7c9850f71d7ef71ffbe0155122e83d9455d</option>
                <option>0x88477a8dc34d60c40b160e9e3b1721341b63c453</option>
                <option>0x2880e2c501a70f7db1691a0e2722cf6a8a9c9009</option>
                <option>0x0226df61d33e41b90be3b5fd830bae303fcb66f5</option>
                <option>0x60a4dff3d25f4e5a5480fb91d550b0efc0e9dbb3</option>
                <option>0xa2f52a2060841cc4eb4892c0234d2c6b6dcf1ea9</option>
                <option>0x71b9b9bd7b6f72d7c0841f38fa7cdb840282267d</option>
                <option>0x7f54a3318b2a728738cce36fc7bb1b927281c24e</option>
                <option>0x56fa40dd1edb0eddd7e5fb40fada372486e4fd58</option>

                <option>0x01cf0e2f2f715450</option>
                <option>0x179b6b1cb6755e31</option>
                <option>0xf3fcd2c1a78f5eee</option>
            </select>
        </div>

        <div class="input-group flex mb-3 pl-5 pt-5">
            <label class="bg-gray-200 p-2 block rounded rounded-r-none text-gray-500">To Account:</label>
            <select id="to-account" data-field="account" class="shadow-inner border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option>0xb1ac66b49fdc369879123332f2cdd98caad5f75a</option>
                <option>0x0d27a7c9850f71d7ef71ffbe0155122e83d9455d</option>
                <option>0x88477a8dc34d60c40b160e9e3b1721341b63c453</option>
                <option>0x2880e2c501a70f7db1691a0e2722cf6a8a9c9009</option>
                <option>0x0226df61d33e41b90be3b5fd830bae303fcb66f5</option>
                <option>0x60a4dff3d25f4e5a5480fb91d550b0efc0e9dbb3</option>
                <option>0xa2f52a2060841cc4eb4892c0234d2c6b6dcf1ea9</option>
                <option>0x71b9b9bd7b6f72d7c0841f38fa7cdb840282267d</option>
                <option>0x7f54a3318b2a728738cce36fc7bb1b927281c24e</option>
                <option>0x56fa40dd1edb0eddd7e5fb40fada372486e4fd58</option>

                <option>0x01cf0e2f2f715450</option>
                <option>0x179b6b1cb6755e31</option>
                <option>0xf3fcd2c1a78f5eee</option>
            </select>
        </div>

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
            data-field="serial"
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
              fields="authorized account id amount serial"
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


