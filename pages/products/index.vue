<template>
  <div class="container">
    <h1 class="title mt-20">Actualizar Productos ({{ webProduct.length }})</h1>
    <h2 class="subtitle">Actualizar los productos de tu desarrollo web a nuestra plataforma</h2>
    <p>
      Deseo que mis productos se actualicen de a tandas de:
      <input
        type="number"
        id="count"
        v-model.number="count"
      />
    </p>
    <hr />
    <div v-if="total != 0">
      <progress class="progress is-warning" :value="total" :max="webProduct.length">{{ total }}</progress>
      <hr />
    </div>
    <button
      @click="updateProducts(0)"
      id="boton"
      class="button is-success is-fullwidth"
      :disabled="count == 0 || count > 500 || webProduct.length == 0"
    >{{ textButton }}</button>
    <hr />
    <table class="table is-fullwidth mt-20">
      <thead>
        <th>Producto</th>
        <th></th>
        <th></th>
      </thead>
      <tbody>
        <tr v-for="response in responseWebProduct">
          <td>{{ response.title }}</td>
          <td>
            <span class="tag is-success" v-if="response.status == 'create'">NUEVO</span>
            <span v-else class="tag is-warning">ACTUALIZADO</span>
          </td>
          <td>
            <span class="tag is-success" v-if="response.status == '200'">
              <i class="material-icons">done</i>
            </span>
            <span v-else class="tag is-danger">
              <i class="material-icons">clear</i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      products: [],
      webProduct: [],
      total: 0,
      count: 0,
      responseWebProduct: [],
      textButton: "CARGANDO PRODUCTOS DESDE LA WEB..."
    };
  },
  async mounted() {
    const web = await axios.get(process.env.product + "");
    document.getElementById("boton").removeAttribute("disabled");
    this.textButton = "ACTUALIZAR PRODUCTOS HACIENDO CLICK";
    this.webProduct = web.data;
  },
  methods: {
    viewDiv: function(id) {
      var element = document.getElementById(id);
      var element = document.getElementById(id);
      element.classList.add("d-block");
    },
    updateProducts: async function(init) {
      Number(init);
      Number(this.count);
      const total = init + this.count;
      console.log(init + " | " + total);
      setTimeout(async () => {
        await this.forFinal(init, total);
        this.updateProducts(total);
      }, 1000);
    },
    forFinal: async function(inicio, fin) {
      for (var i = inicio; i < fin; i++) {
        if (Object.keys(this.webProduct[i]).length != 0) {
          this.postProduct(this.webProduct[i]).then(r => {
            if (r.data.status === 200) {
              this.total++;
            }
            this.responseWebProduct.push(r.data);
          });
          console.log(i);
        }
      }
    },
    postProduct: async function(product) {
      return axios.post(
        process.env.apiUrl + "/product/update-web",
        {
          item: product
        },
        this.$cookies.get("header-token")
      );
    }
  }
};
</script> 