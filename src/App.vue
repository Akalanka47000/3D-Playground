<template>
  <v-app>
    <v-app-bar app color="dark" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn v-b-toggle.sidebar-1 text>
        <b-icon icon="list" font-scale="3"></b-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <playground />
    </v-main>
  </v-app>
</template>

<script>
import Playground from "./components/Playground.vue";

export default {
  name: "App",

  components: {
    Playground,
  },
};
</script>
