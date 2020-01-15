<template>
  <div class="container">
    <h2>TOTAL DE PRODUCTOS A AGREGAR: {{ products.length }}</h2>
    <button @click="addEach" class="btn btn-success btn-block">Modificar productos a Mercadolibre</button>
    <br />
    <br />
    <hr />
    Resultado ({{ total }})
    <br />
    <br />
    <div class="row">
      <div class="col-md-12">
        <table class="table table-bordered table-hover">
          <thead>
            <th>Estado</th>
            <th>Producto</th>
            <th>Mensaje</th>
          </thead>
          <tbody>
            <tr v-for="response_ in response" >
              <td> 
                  {{ response_ }}
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
      total: 0
    };
  },
  async mounted() {
    const products = await axios.get(process.env.apiUrl + "/product");
    this.products = products.data;    
  },
  methods: {
    addEach: async function() {
      await this.$data.products.forEach(async product => {
        await product.mercadolibre.forEach(async meli => {
          const meliPostItem = await axios.put(
            process.env.apiUrl + "/mercadolibre/change-status/" + meli.code,
            {
              status: "paused"
            }
          );
          console.log(meliPostItem);
          if (meliPostItem.data.status === 200) {
            this.$data.total += 1;
          }
          await this.$data.response.push(meliPostItem.data);
        });
      });
    }
  }
};
</script> 