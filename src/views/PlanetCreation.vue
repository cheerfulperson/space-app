<template>
  <v-container grid-list-lg text-xs-center fill-height>
    <v-layout row fill-height>
      <v-flex xs6 class="planet-info">
        
        <v-simple-table fixed-header class="mb-5">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Property</th>
                <th class="text-left">Number</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in constants" :key="item.key">
                <td>{{ item.name }}</td>
                <td>{{ item.value === 0 ? 'Need to calculate' : item.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-expansion-panels :value="panel" popout focusable>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Physical properties of the planet
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row v-for="item in characteristics[0]" :key="item.label">
                <v-col cols="4">
                  <v-subheader>{{ item.label.toUpperCase() }}:</v-subheader>
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    :label="item.label"
                    v-model="item.value"
                    type="number"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              Chemical properties of the planet
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="sliders-wrap">
                <v-col
                  v-for="item in characteristics[1]" :key="item.label"
                  cols=24
                  sm=12
                  md=8
                >
                  <v-slider
                    v-model="item.value"
                    :label="item.label"
                    :thumb-color="colors[0]"
                    thumb-label="always"
                    :max="item.value + remain"
                  >
                    <template v-slot:prepend>
                      0
                    </template>
                    <template v-slot:append>
                      {{ item.value + remain }}
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
              <p>
                Remain: {{ remain }}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>

      <v-flex xs6 class="planet-wrap">
        <planet
          v-if="planetElements !== null"
          seed="0.1"
          :upper-color="[64 / 225, 1, 1]"
          :planet-characteristics="planetElements"
          :planet-radius="+planetRadius + 1"
        />
        <div class="mt-2">
          <v-btn block color="blue" dark @click="update">Calculate</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import Planet from "../components/Planet.vue";

export default {
  components: {
    Planet
  },
  data: () => ({
    uri: 'https://dd185783.ngrok.io',
    panel: [0],
    num: 0,
    arr: [],
    array: [],
    colors: ["red", "yellow"],
    readonly: false,
    panelT: true,
    percent: 100,
    planetElements: null,
    constants: [
      {
        key: 's_rad',
        name: "Solar Radius",
        value: 1
      },
      {
        key: 's_temp',
        name: "Sun temperature, K",
        value: 5772
      },
      {
        key: 's_mass',
        name: "Mass of Sun",
        value: 1.989
      },
      {
        key: 's_metal',
        name: "Sun Metalicity",
        value: 4.33
      },
      {
        key: 'temp',
        name: 'Planet temperature, K',
        value: 0
      },
      {
        key: 'nearest_planet',
        name: 'Nearest planet',
        value: 0
      }
    ],
    characteristics: [
      [
        {
          key: 'radius',
          label: "Radius, J (Jupiter's)",
          value: 0.2
        },
        {
          key: 'mass',
          label: "Mass",
          value: 0
        },
        {
          key: 's_dist',
          label: "Distance from sun",
          value: 0
        },
        {
          key: 'volume',
          label: "Volume",
          value: 0
        }
      ],
      [
        {
          key: 'o2',
          label: "O2",
          value: 69,
        },
        {
          key: 'n2',
          label: "N2",
          value: 28,
        },
        {
          key: 'co2',
          label: "CO2",
          value: 0,
        },
        {
          key: 'h2',
          label: "H2",
          value: 3,
        },
        {
          key: 'he',
          label: "He",
          value: 0,
        }
      ]
    ],
    planetsArray: []
  }),
  mounted() {
    this.planetElements = this.getPlanetElements();
    this.planetRadius = this.characteristics[0][0].value // :c
  },
  computed: {
    remain() {
      const totalValue = this.characteristics[1].reduce((acc, val) => acc + val.value, 0)
      return 100 - totalValue;
    },
  },
  methods: {
    getPlanetElements() {
      const result = {};
      this.characteristics[1].forEach((characteristic) => {
        const {
          key,
          value,
        } = characteristic;
        result[key] = value / 100;
      })
      return {...result};
    },
    update: async function() {
      const spaceProps = {};
      this.characteristics.forEach((characteristicGroup, i) => {
        characteristicGroup.forEach((characteristic) => {
          const {
            key,
            value,
          } = characteristic;
          spaceProps[key] = (i === 2) ? +value / 100 : +value;
        })
      })
      this.constants.forEach((characteristic) => {
        const {
          key,
          value,
        } = characteristic;
        spaceProps[key] = +value;
      })
      this.planetElements = this.getPlanetElements();
      this.planetRadius = this.characteristics[0][0].value // :c

      const { data: planetTemp } = await axios({
        method: 'post',
        url: `${this.uri}/get_temp`,
        params: spaceProps
      })
      spaceProps['temp'] = +planetTemp;
      this.constants[4].value = +planetTemp;


      const { data: nearest } = await axios({
        method: 'post',
        url: `${this.uri}/get_nearest`,
        params: spaceProps
      })
      this.constants[5].value = nearest;
    },
  }
};
</script>

<style>
.planet-wrap {
  max-height: calc(100vh - 150px);
}
.sliders-wrap {
  margin-top: 30px;
}
</style>
