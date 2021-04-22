import "../../action-button.js";
import { LitElement, html, customElement, property } from "lit-element";
import Mondgram from './mondgram.js';

@customElement('composable-nft-generator')
export default class ComposableNftGenerator extends LitElement {

  createRenderRoot() {
    return this;
  }

  constructor(args) {
    super(args);
    this.scale = 3;
    this.metaData = {}
  }

  previewHandler() {
    let color = document.getElementById('color').value; 
    // id, scale, color
    let mondgram = new Mondgram('preview-area', this.scale, color.split(', '));
    let mDna = mondgram.generate();
    document.getElementById('mdna').value = mDna;
    this.metaData = {
      scale: this.scale,
      mdna,
      color
    }
    console.log(this.metaData);
  }

  actionHandler(e) {
    console.log('Called action handler', e)
  }

  render() {
    let content = html`

    <div class="shadow rounded-md bg-white mb-10 p-1" id="mondgram-input">
        <input type="hidden" id="scale" data-field="scale" value="${this.scale}" />
        <input type="hidden" id="mdna" data-field="mdna" value="" />
        <div
          class="text-white p-3 bg-blue-400 flex justify-between items-center rounded-md rounded-b-none"
        >
          <h5 class="font-bold">Mondgram Creator</h5>
        </div>
        <div
          class="slot ${this.innerHTML.indexOf("<") > -1 ? "p-3" : ""}"
          id="mondgram-creator"
        >

        <div class="p-4" style="height:400px;" id="preview-area">
        </div>
      
        <div class="input-group flex mb-3 pl-5 pt-5">
            <label class="bg-gray-200 p-2 block rounded rounded-r-none text-gray-500">Palette:</label>
            <select id="color" data-field="color" class="shadow-inner border rounded rounded-l-none w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option>white, red, blue, yellow</option>
                <option>green, purple, orange</option>
                <option>crimson, aquamarine, deeppink</option>
                <option>fuchsia, greenyellow, lightslategray</option>
                <option>maroon, tan, steelblue</option>
            </select>
        </div>

        <div class="bg-gray-300 p-1 rounded-md rounded-t-none">
          <div class="p-2 flex items-center justify-between">
            <div>
                Preview and generate a Mondgram
            </div>
            <div class="button-container text-right">
                <button @click=${this.previewHandler} class="text-white font-bold py-2 px-8 rounded bg-blue-500 hover:bg-blue-700">Preview Mondgram</button>
            </div>
            <action-button
                source="#mondgram-input"
                action="mintAsset"
                method="post"
                fields="scale color mdna"
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


