<template>
  <div class="devices">
    <div class="my-devices">
      <div>
        <input type="text" />
        <button>Add</button>
      </div>
      <ul v-for="device in getDevices" :key="device">
        <li class="device" @click="selectActive(device)">
          <p>{{ device }}</p>

          <button>Delete</button>
        </li>
      </ul>
    </div>
    <div class="device-details">
      {{ activeDevice }}
      <p>
        Your pet is {{ distance.toLocaleString("en-US") }} meters away from you
      </p>
      <l-map style="height: 500px" :zoom="zoom" :center="center">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="markerLatLng"></l-marker>
        <l-marker :lat-lng="petLatLng"></l-marker>
      </l-map>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { Icon } from "leaflet";

type D = Icon.Default & {
  _getIconUrl?: string;
};

delete (Icon.Default.prototype as D)._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
})
export default class Devices extends Vue {
  @Getter getDevices!: Array<string>;
  @Action setDevices: any;

  activeDevice = "";
  pos = {
    timestamp: 0,
    latitude: 0,
    longitude: 0,
  };
  distance = 0;

  url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  attribution =
    '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  zoom = 15;
  center = [0, 0];
  markerLatLng = [0, 0];
  petLatLng = [0, 0];

  created(): void {
    //do we support geolocation
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not available.");
    }
    // get position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.pos.timestamp = pos.timestamp;
        this.pos.latitude = pos.coords.latitude;
        this.pos.longitude = pos.coords.longitude;
        this.center = [this.pos.latitude, this.pos.longitude];
        this.markerLatLng = this.center;
      },
      (err) => {
        alert(err);
      }
    );

    axios
      .get("http://localhost:3000/api/devices/", {
        withCredentials: true,
      })
      .then((res) => {
        this.setDevices(res.data.devices);
        //this.addDevice({ value: res.data.devices[0] });
      })
      .catch((err) => {
        alert(err.response.data);
      });
  }

  selectActive(device: any): void {
    this.activeDevice = device;
    axios
      .get(`http://localhost:3000/api/devices/${device}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.distance = Math.round(this.dist(this.pos, res.data));
        this.petLatLng = [res.data.latitude, res.data.longitude];
        this.center = this.petLatLng;
        //this.addDevice({ value: res.data.devices[0] });
      })
      .catch((err) => {
        alert(err.response.data);
      });
  }

  private toRadians(degree: number): number {
    const pi = 3.14159;
    return (pi / 180) * degree;
  }

  private dist(pos1: any, pos2: any): number {
    // Convert the latitudes
    // and longitudes
    // from degree to radians.
    const lat1 = this.toRadians(pos1.latitude);
    const long1 = this.toRadians(pos1.longitude);
    const lat2 = this.toRadians(pos2.latitude);
    const long2 = this.toRadians(pos2.longitude);

    // Haversine Formula
    let dlong = long2 - long1;
    let dlat = lat2 - lat1;

    let ans =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlong / 2), 2);

    ans = 2 * Math.asin(Math.sqrt(ans));

    // Radius of Earth in
    // Kilometers, R = 6371
    // Use R = 3956 for miles
    let R = 6371;

    // Calculate the result
    ans = ans * R;

    return ans * 1000;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.devices {
  display: flex;
  justify-content: center;

  & > div {
    margin: 1em;
    padding: 1em;
    color: $primary-color;
    background-color: $secondary-color;
  }

  .my-devices {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    ul {
      margin: 1em;
      border: 0.2em solid black;
    }

    .device {
      display: flex;
      justify-content: center;
      cursor: pointer;
      padding: 1em;

      &:hover {
        background-color: darken($secondary-color, 10%);
      }
    }
  }

  .device-details {
    flex-grow: 2;
  }
}
</style>
