///(page
import "../../components/page-body.js";
import "../../components/composer-card.js";
import { LitElement, html, customElement, property } from "lit-element";

@customElement('composable-nft-composer')
export default class ComposableNFT extends LitElement {
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

      <div class="grid grid-cols-2 gap-6">
        <!-- START: SET URI and GET URI !-->
        <div>
          <composer-card
            title="Set URI"
            description="Set metadata URI"
            action="setURI"
            method="post"
            fields="authorized newURI">

          </composer-card>
        </div>
      </div>

      </page-body>
    `;

    return content;
  }
}
///)

