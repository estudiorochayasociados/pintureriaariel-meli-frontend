<template>
  <div class="container">
    <h1 class="title mt-20">Actualizar Productos ({{ webProduct.length }})</h1>
    <h2 class="subtitle">Actualizar los productos de tu desarrollo web a nuestra plataforma</h2>
    <hr />
    <button
      @click="updateProducts"
      id="boton"
      class="button is-success is-fullwidth"
      disabled
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
    updateProducts: async function() {
      document.getElementById("boton").setAttribute("disabled", "true");
      document.getElementById("boton").classList.add("is-loading");
      const postProduct = await axios.post(
        process.env.apiUrl + "/product/update-web",
        {
          item: this.webProduct[0]
        },
        this.$cookies.get("header-token")
      );
      this.responseWebProduct.push(postProduct.data);
      this.webProduct.shift();
      this.updateProducts();
      if (this.webProduct.length == 0) {
        this.textButton = "ACTUALIZAR PRODUCTOS HACIENDO CLICK";
        document.getElementById("boton").removeAttribute("disabled");
        document.getElementById("boton").classList.remove("is-loading");
      }
    }
  }
};
</script> 