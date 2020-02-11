<template>
  <div class="container">
    <h1 class="title mt-20">Agregar productos a MercadoLibre ({{ productsFinal.length }})</h1>
    <h2
      class="subtitle"
    >Aplicá las configuraciones de publicaciones que te gustaría que tus productos cumplan</h2>
    <hr />
    <div class="columns">
      <div class="column">
        <span class="fs-14">AGREGAR CARACTERÍSTICAS:</span>
        <br />
        <input class="input" type="text" v-model="tag" />
      </div>

      <div class="column">
        <span class="fs-14">TIPO DE PUBLICACIÓN:</span>
        <br />
        <div class="select is-fullwidth">
          <select v-model="type">
            <option value="gold_special">CLÁSICA (13%)</option>
            <option value="gold_pro">PREMIUM (28%)</option>
          </select>
        </div>
      </div>

      <div class="column">
        <span class="fs-14">¿PRODUCTOS POR 1º VEZ?</span>
        <br />
        <div class="select is-fullwidth">
          <select v-model.bool="all" @change="changeProducts()">
            <option value="false">NO, SUBIR TODOS</option>
            <option value="true">SI</option>
          </select>
        </div>
      </div>

      <div class="column">
        <span class="fs-14">ENTREGA EN:</span>
        <br />
        <div class="is-fullwidth">
          <input type="number" class="input" placeholder="Días" v-model="garanty" />
        </div>
      </div>

      <div class="column">
        <br />
        <button @click="addEach" id="boton" class="button is-primary" disabled>SUBIR A MERCADOLIBRE</button>
      </div>
    </div>
    <hr />
    <div class="notification is-info text-uppercase bold fs-13">
      Resultado de productos publicados exitosamente
      <span class="fs-16">({{ total }})</span>
    </div>
    <div class="row">
      <div class="col-md-12">
        <table class="table is-narrow is-hoverable is-fullwidth">
          <thead>
            <th>Estado</th>
            <th>Producto</th>
            <th>Mensaje</th>
          </thead>
          <tbody>
            <tr v-for="response_ in response">
              <td>
                <div
                  v-bind:class=" response_.status == 200 ? 'button is-success ' : 'button is-danger ' "
                >
                  <span class v-if="response_.status == 200">APROBADO</span>
                  <span v-else>NO APROBADO</span>
                </div>
              </td>
              <td>{{ response_.title }}</td>
              <td>
                <div v-if="response_.status == 200">
                  <b>Tipo de publicación:</b>
                  {{ response_.type }}
                  <br />
                  <b>Código MercadoLibre:</b>
                  {{ response_.code }}
                  <br />
                  <b>Precio MercadoLibre:</b>
                  {{ response_.price }}
                  <br />
                  <b>Porcentaje de recargo aplicado:</b>
                  {{ response_.percent }}
                </div>
                <div v-else>{{ response_.error.message }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      products: [],
      productsFinal: [],
      response: [],
      checkToken: [],
      configMeli: [],
      tag: "",
      garanty: 0,
      type: "",
      all: "",
      shipping: true,
      total: 0
    };
  },
  async mounted() {
    const products = await axios.get(
      process.env.apiUrl + "/product",
      this.$cookies.get("header-token")
    );

    this.products = products.data;
    this.productsFinal = products.data;

    const checkToken = await axios.get(
      process.env.apiUrl + "/mercadolibre/refresh-token"
    );

    const configMeli = await axios.get(
      process.env.apiUrl + "/mercadolibre/config"
    );

    this.checkToken = checkToken.data[0];
    this.configMeli = configMeli.data[0];

    document.getElementById("boton").removeAttribute("disabled");
  },
  methods: {
    changeProducts: async function() {
      this.productsFinal = JSON.parse(JSON.stringify(this.products));
      if (this.all !== "false") {
        var productoFinal = [];
        this.productsFinal.map(async (product, index) => {
          if (product.mercadolibre.length === 0) {
            productoFinal.push(product);
          }
        });
        this.productsFinal = productoFinal;
      }
    },
    addEach: async function() {
      document.getElementById("boton").classList.add("is-loading");
      if (this.productsFinal.length === 0) {
        document.getElementById("boton").classList.remove("is-loading");
        return;
      } else {
        let percent =
          this.type == "gold_special"
            ? this.configMeli.gold_especial_percent
            : this.configMeli.gold_pro_percent;

        this.productsFinal[0].title =
          this.productsFinal[0].title + " " + this.tag;
        const meliPostItem = await axios.post(
          process.env.apiUrl + "/mercadolibre/item",
          {
            item: this.productsFinal[0],
            shipping: this.configMeli.shipping,
            percent: percent,
            garanty: this.garanty,
            type: this.type
          },
          this.$cookies.get("header-token")
        );
        if (meliPostItem.data.status === 200) {
          this.total += 1;
        }
        await this.response.push(meliPostItem.data);
        this.productsFinal.shift();
        this.addEach();
      }
    }
  }
};
</script> 