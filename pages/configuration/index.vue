<template>
  <div class="container">
    <h1 class="title mt-20">Agregar productos a MercadoLibre</h1>
    <h2
      class="subtitle"
    >Aplicá las configuraciones de publicaciones que te gustaría que tus productos cumplan</h2>
    <hr />
      <MessageComponent v-bind:text="this.message.text" v-bind:status="this.message.status"  class="mb-10"/>
    <div class="columns">
      <div class="column">
        Publicaciones Clásicas:
        <input
          class="input"
          type="text"
          v-model="configuration.gold_especial_percent"
        />
      </div>
      <div class="column">
        Publicaciones Premium:
        <br />
        <input class="input" type="text" v-model="configuration.gold_pro_percent" />
      </div>
      <hr />
    </div>
    <div class="columns">
      <div class="column">
        Calcular MercadoEnvios:
        <br />
        <div class="select is-fullwidth">
          <select v-model="configuration.shipping">
            <option value="true">Si</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <button @click="submit" class="button is-primary">ACUTALIZAR CONFIGURACIONES</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MessageComponent from "../../components/MessageComponent";
export default {
  data() {
    return {
      configuration: [],
      message: {
        text: "",
        status: ""
      }
    };
  },
  components: {
    MessageComponent
  },
  async mounted() {
    const config = await axios.get(
      process.env.apiUrl + "/mercadolibre/config",
      this.$cookies.get("header-token")
    );
    this.configuration = config.data[0];    
  },
  methods: {
    submit: async function() {
      this.response = await axios.put(
        process.env.apiUrl + "/mercadolibre/config",
        this.configuration,
        this.$cookies.get("header-token")
      );
      this.$data.message.text = "Excelente, configuración guardada";
      this.$data.message.status = "success";
    }
  }
};
</script> 