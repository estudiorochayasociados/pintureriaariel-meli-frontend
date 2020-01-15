<template>
  <div>
    <nav class="navbar is-warning" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item fs-20">MeliOS</a>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu text-uppercase">
        <div class="navbar-end">
          <a class="navbar-item fs-14" href="/">Home</a>

          <a class="navbar-item fs-14" href="/products">Productos</a>

          <div class="navbar-item fs-14 has-dropdown is-hoverable">
            <a class="navbar-link">Mercadolibre</a>
            <div class="navbar-dropdown is-right">
              <a class="navbar-item fs-14" href="/meli/add">Agregar Productos</a>
              <a class="navbar-item fs-14" href="/meli/update">Modificar Productos</a>
            </div>
          </div>

          <div class="navbar-item fs-14 has-dropdown is-hoverable">
            <a class="navbar-link">ADMIN</a>
            <div class="navbar-dropdown is-right">
              <a class="navbar-item fs-14" @click="auth">AUTH</a>
              <a class="navbar-item fs-14" href="/configuration">Configuración</a>
              <a class="navbar-item fs-14" @click="logout">Salir</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="has-background-dark"></div>
    <nuxt />
  </div>
</template>
 
 <script>
export default {
  middleware: "auth",
  methods: {
    auth: async function() {
      window.open(process.env.apiUrl + "/mercadolibre/auth");
    },
    logout: function() {
      this.$cookies.set("token", "");
      this.$cookies.set("header-token", "");
      this.$router.push("index");
    }
  }
};
</script>