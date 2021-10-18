<template>
  <v-container grid-list-lg>
    <v-layout wrap justify-space-around align-content-center>
      <v-flex xs12 sm6 md4 v-for="planet in planets" :key="planet.name">
        <v-card>
          <v-img class="white--text align-end" height="200px" :src="planet.img">
            <v-card-title class="pb-0">{{ planet.name }}</v-card-title>
          </v-img>

          <v-card-subtitle class="pb-0">Characteristics:</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>{{ planet.mass }}</div>
            <div>{{ planet.volume }}</div>
            <div>{{ planet.distance }}</div>
            <!-- <div>{{planet.period}}</div> -->
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import img1 from "../components/the-sun.jpg";
import img2 from "../components/the-moon.jpg";
export default {
  data: () => ({
    planets: [
      {
        name: "Sun",
        img: img1,
        mass: "1.989×10^30 kg",
        volume: "4.367×10^6 km^3",
        temp: "5778 K"
      },
      {
        name: "Moon",
        img: img2,
        mass: "7.342×10^22 kg",
        volume: "2.1958×10^10 km^3",
        temp: "270 K"
      },
      {
        name: "Mars",
        img:
          "https://timedotcom.files.wordpress.com/2018/05/life-mars-launch-rover-weintraub-david-book.jpg",
        mass: "6.417x10^23 kg",
        volume: "1.632×10^11 km^3",
        temp: "210 K"
      },
      {
        name: "Jupiter",
        img:
          "https://upload.wikimedia.org/wikipedia/commons/5/50/Jupiter%2C_image_taken_by_NASA%27s_Hubble_Space_Telescope%2C_June_2019_-_Edited.jpg",
        mass: "1.898×10^27 kg",
        volume: "1.43x10^15 km^3",
        temp: "128 K"
      },
      {
        name: "Earth",
        img:
          "https://www.universetoday.com/wp-content/uploads/2010/05/Earth-Western-Hemisphere.jpg",
        mass: "5.972×10^24 kg",
        volume: "1.08321×10^12 km^3",
        temp: "288 K"
      },
      {
        name: "Mercury",
        img:
          "https://mk0astronomynow9oh6g.kinstacdn.com/wp-content/uploads/2019/04/042219_mercury_globe2.jpg",
        mass: "3.301×10^23 kg",
        volume: "6.083×10^10 km^3",
        temp: "270 K",
        period: "пасхалка для Егора"
      }
    ]
  })
};
</script>
