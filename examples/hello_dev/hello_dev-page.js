///(page-post-content

import '../../components/action-card.js';
import '../../components/page-body.js';
import "../../components/page-panel.js";
import '../../components/text-widget.js';
import '../../components/number-widget.js';
import '../../components/account-widget.js';
import DOM from "../../components/dom";
import DappLib from "@decentology/dappstarter-dapplib";
import { LitElement, html, customElement, property } from "lit-element";

@customElement("hello-dev-page")
export default class HelloDevPage extends LitElement {
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
      /*>>>>>>>>>>>>>>>>>>>>>>>>>>> EXAMPLES: HELLO DEV  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
      return html`
        <page-body
          title="${this.title}"
          category="${this.category}"
          description="${this.description}"
        >
          <action-card
            title="Get Greeting Count"
            description="Count how many times the greeting was made"
            action="countHellos"
            method="get"
          >
          </action-card>
  
          <action-card
            title="Increment Greeting Count"
            description="Increments the greeting count by one"
            action="sayHello"
            method="post"
          >
          </action-card>
        </page-body>
        <page-panel id="resultPanel"></page-panel>
      `;
    }
}
///)

