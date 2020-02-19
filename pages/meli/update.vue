<template>
  <div class="container">
    <h1 class="title mt-20">Actualizar productos de MercadoLibre ({{ prepareArray.length }})</h1>
    <h2
      class="subtitle"
    >Aplicá las configuraciones de publicaciones que te gustaría que tus productos cumplan</h2>
    <p>
      Deseo que mis anuncios se actualicen de a tandas de:
      <input
        type="number"
        id="count"
        v-model.number="count"
      />
    </p>
    <hr />
    <div v-if="total != 0">
      <progress class="progress is-warning" :value="total" :max="prepareArray.length">{{ total }}</progress>
      <hr />
    </div>
    <button
      @click="updateEach(0)"
      id="boton"
      :disabled="count == 0 || count > 500"
      class="button is-success is-fullwidth"
    >MODIFICAR PRODUCTOS A MERCADOLIBRE</button>
    <hr />
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
                <div v-bind:class="!response_.error ? 'button is-success ' : 'button is-danger ' ">
                  <span class v-if="!response_.error">APROBADO</span>
                  <span v-else>NO APROBADO</span>
                </div>
              </td>
              <td>{{ response_.title }}</td>
              <td>
                <div v-if="!response_.error">
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
                <div v-else>
                  <b>ERROR:</b>
                  {{ response_.error.message }}
                </div>
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
      prepareArray: [],
      response: [],
      count: 0,
      checkToken: [],
      estado: false,
      configMeli: [],
      total: 0,
      loop: true,
      meliTotal: 0
    };
  },
  async mounted() {
    const products = await axios.get(
      process.env.apiUrl + "/product",
      this.$cookies.get("header-token")
    );

    const checkToken = await axios.get(
      process.env.apiUrl + "/mercadolibre/refresh-token"
    );

    const configMeli = await axios.get(
      process.env.apiUrl + "/mercadolibre/config"
    );

    this.checkToken = checkToken.data[0];
    this.configMeli = configMeli.data[0];
    this.products = products.data;
    await this.prepareArrayProducts();
  },
  methods: {
    prepareArrayProducts: async function() {
      this.products.forEach(product => {
        if (product.mercadolibre.length != 0) {
          const arrayProduct = [];
          arrayProduct.push(product);
          product.mercadolibre.forEach(meli => {
            this.meliTotal++;
            let percent =
              meli.type == "gold_special"
                ? this.configMeli.gold_especial_percent
                : this.configMeli.gold_pro_percent;
            arrayProduct.push(meli.code);
            arrayProduct.push(meli.type);
            arrayProduct.push(percent);
          });
          this.prepareArray.push(arrayProduct);
        }
      });
    },
    updateEach: async function(init) {
      document.getElementById("count").setAttribute("disabled", "");
      document.getElementById("boton").setAttribute("disabled", "");
      Number(init);
      const total = Number(init + this.count);
      console.log(init + " | " + total);
      setTimeout(async () => {
        if (this.loop) {
          await this.forFinal(init, total);
          this.updateEach(total);
        }
      }, 1000);
    },
    forFinal: async function(inicio, fin) {
      for (var i = inicio; i < fin; i++) {
        if (i == this.prepareArray.length) {
          this.loop = false;
          break;
        }
        var status = await axios.get(
          "https://api.mercadolibre.com/items/" + this.prepareArray[i][1]
        );
        if (
          status.data.status != "paused" &&
          this.prepareArray[i][0].stock != 0
        ) {
          this.putMercadolibre(
            this.prepareArray[i][0],
            this.prepareArray[i][1],
            this.prepareArray[i][2],
            this.prepareArray[i][3]
          ).then(r => {
            this.response.push(r.data);
          });
        } else {
          this.response.push({
            title: this.prepareArray[i][0].title,
            error: { message: "Pausado y sin stock" }
          });
        }
        this.total++;
        console.log(this.loop);
        console.log(i);
      }
    },
    putMercadolibre: function(product, meliCode, type, percent) {
      return axios.put(
        process.env.apiUrl + "/mercadolibre/item/" + meliCode,
        {
          item: product,
          shipping: this.configMeli.shipping,
          percent: percent,
          type: type
        },
        this.$cookies.get("header-token")
      );
    }
  }
};
</script> 