<template>
  <v-app>
    <v-app-bar clipped-left app>
      <v-btn @click="toggle" text icon>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </v-btn>
      <v-toolbar-title class="headline text-uppercase ml-5">
        <span style="color: #ff0000"> POTATO </span>
        <span style="color: #0000ff" class="font-weight-light">PLANETS</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        clearable
        hide-details
        label="Search planets by name"
        prepend-inner-icon="mdi-database-search"
      ></v-text-field>
      <v-btn class="ml-5" text icon>
        <v-icon>mdi-card-search</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer clipped class="grey lighten-4" app v-model="pressed">
      <v-list dense>
        <v-subheader>NAVIGATION</v-subheader>
        <!-- <v-list-item-group color="primary"> -->
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.link">
          <!-- <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon> -->

          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-content> </v-list-item-content>
        </v-list-item>
        <!-- </v-list-item-group> -->
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    pressed: false,
    items: [
      {
        icon: "mdi-pencil-plus-outline",
        text: "Create a planet",
        link: "/"
      },
      {
        icon: "mdi-eye-outline",
        text: "Planet view",
        link: "/planet"
      },
      {
        icon: "mdi-search-web",
        text: "Search planets",
        link: "/search"
      }
    ]
  }),
  methods: {
    toggle() {
      this.pressed = !this.pressed;
    },
    link() {
      this.pressed = true;
    }
  }
};
</script>
