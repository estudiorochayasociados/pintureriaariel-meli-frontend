<template>
  <div class="container">
    <MessageComponent v-bind:text="messageText" v-bind:status="messageStatus" />
    <h4 class="mt-20">Total de Productos: {{ products.length }}</h4>
    <table class="table is-fullwidth mt-20">
      <thead>
        <th>Producto</th>
      </thead>
      <tbody>
        <tr v-for="product in products">
          <td>{{ product.title }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import MessageComponent from "../components/MessageComponent";
export default {
  data() {
    return {
      products: [],
      messageText: '',
      messageStatus: ''
    };
  },
  components: {
      MessageComponent
  },
  async mounted() {
    const products = await axios.get(process.env.apiUrl + "/product", this.$cookies.get("header-token"));
    this.products = products.data;
  },
  methods: {
    viewDiv: function(id) {
      var element = document.getElementById(id);
      var element = document.getElementById(id);
      element.classList.add("d-block");
    }
  }
};
</script> 