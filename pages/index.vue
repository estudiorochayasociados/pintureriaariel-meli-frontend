<template>
  <div>
    <section class="hero is-warning is-fullheight">
      <div class="hero-body">
        <div class="container has-text-centered">
          <div class="column is-4 is-offset-4">
            <div class="box">
              <h3 class="title has-text-black">Acceder a MeliOS</h3>
              <hr class="login-hr" />
              <MessageComponent v-bind:text="messageText" v-bind:status="messageStatus" />
              <p class="subtitle has-text-black">Ingresá tus datos para acceder</p>
              <div>
                <div class="field">
                  <div class="control">
                    <input
                      class="input is-large"
                      v-model="data.email"
                      type="email"
                      placeholder="Email"
                      autofocus
                    />
                  </div>
                </div>

                <div class="field">
                  <div class="control">
                    <input
                      class="input is-large"
                      v-model="data.password"
                      type="password"
                      placeholder="Contraseña"
                    />
                  </div>
                </div>
                <button @click="login" class="button is-block is-info is-large is-fullwidth">
                  Ingresar
                  <i class="fa fa-sign-in" aria-hidden="true"></i>
                </button>
              </div>
              <p class="has-text-grey mt-20">
                <a
                  href="https://www.estudiorochayasoc.com.ar"
                  target="_blank"
                >Estudio Rocha & Asociados</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import MessageComponent from "../components/MessageComponent";
export default {
  layout: "login",
  data() {
    return {
      data: {
        email: "",
        password: ""
      },
      messageText: "",
      messageStatus: ""
    };
  },
  components: {
    MessageComponent
  },
  async mounted() {
    if (this.$cookies.get("token")) {
      const checkToken = await axios.get(
        process.env.apiUrl + "/user/check-token",
        this.$cookies.get("header-token")
      );
      if (checkToken.data.status) {
        this.$router.push("home");
      }
    }
  },
  methods: {
    login: async function() {
      const login = await axios.post(
        process.env.apiUrl + "/user/auth",
        this.data
      );
      if (login.data.token) {
        this.message = "";
        this.$cookies.set("token", login.data.token);
        this.$cookies.set("header-token", {
          headers: { "access-token": this.$cookies.get("token") }
        });
        this.$router.push("home");
      } else {
        this.messageText = "Ups! Ese usuario no existe.";
        this.messageStatus = "danger";
      }
    }
  }
};
</script>