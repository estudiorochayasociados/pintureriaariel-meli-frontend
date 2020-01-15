<template>
  <div class="container">
    <h1 class="title mt-20">Agregar productos a MercadoLibre ({{ products.length }})</h1>
    <h2
      class="subtitle"
    >Aplicá las configuraciones de publicaciones que te gustaría que tus productos cumplan</h2>
    <hr />
    <div class="columns">
      <div class="column">
        Agregar características:
        <br />
        <input class="input" type="text" v-model="tag" />
      </div>

      <div class="column">
        Tipo de publicación:
        <br />
        <div class="select is-fullwidth">
          <select v-model="type">
            <option value="gold_special">CLÁSICA (13%)</option>
            <option value="gold_pro">PREMIUM (28%)</option>
          </select>
        </div>
      </div>
      <div class="column">
        <br />
        <button @click="addEach" id="boton" class="button is-primary">SUBIR A MERCADOLIBRE</button>
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
      response: [],
      percent: 1.13,
      tag: "",
      type: "",
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
  },
  methods: {
    addEach: async function() {
            document.getElementById("boton").classList.add("is-loading");

      let configMeli = await axios.get(
        process.env.apiUrl + "/mercadolibre/config"
      );
      console.log(configMeli);
      let percentGoldEspecial = configMeli.data[0].gold_especial_percent;
      let percentGoldPro = configMeli.data[0].gold_pro_percent;
      let shipping = configMeli.data[0].shipping;
      let percent =
        this.type == "gold_especial" ? percentGoldEspecial : percentGoldPro;

      var checkToken = await axios.get(
        process.env.apiUrl + "/mercadolibre/refresh-token"
      );


      await this.$data.products.forEach(async product => {
        product.title = product.title + " " + this.$data.tag;
        const meliPostItem = await axios.post(
          process.env.apiUrl + "/mercadolibre/item",
          {
            item: product,
            shipping: shipping,
            percent: percent,
            type: this.type
          },
          this.$cookies.get("header-token")
        );
        if (meliPostItem.data.status === 200) {
          this.$data.total += 1;
        }
        await this.$data.response.push(meliPostItem.data);
      });

      document.getElementById("boton").classList.remove("is-loading");
    }
  }
};
</script> 