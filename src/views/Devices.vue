<template>
  <div class="devices">
    <div class="my-devices">
      <form @submit="addNewDevice">
        <input
          type="text"
          pattern="^[0-9a-fA-F]{16}$"
          v-model="newDevice"
          title="16 characters hexadecimal string"
        />
        <button>Add</button>
      </form>
      <ul v-for="device in getDevices" :key="device">
        <li
          :class="['device', activeDevice === device ? 'active' : '']"
          @click="selectActive(device)"
        >
          <p>{{ device }}</p>

          <button @click="deleteDevice(device)">
            <font-awesome-icon icon="times" size="2x" />
          </button>
        </li>
      </ul>
    </div>
    <div v-if="activeDevice" class="device-details">
      <h2>{{ activeDevice }}</h2>
      <p>{{ getTime(devicePos.timestamp) }}</p>
      <p>
        Your pet is {{ distance.toLocaleString("en-US") }} meters away from you.
      </p>
      <l-map style="height: 500px" :zoom="zoom" :center="center">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="markerLatLng"></l-marker>
        <l-marker :lat-lng="petLatLng"></l-marker>
      </l-map>
    </div>
    <div v-if="!activeDevice" class="no-device-selected">
      <p>Select a device on the left to view its position</p>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action, Mutation } from "vuex-class";
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
  @Mutation addDevice: any;
  @Mutation removeDevice: any;

  devicePosTimer = 0;
  newDevice = "";
  activeDevice = "";
  myPos = {
    timestamp: 0,
    latitude: 0,
    longitude: 0,
  };
  devicePos = {
    timestamp: 0,
    latitude: 0,
    longitude: 0,
  };
  distance = 0;

  // Leaflet variables
  url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  attribution =
    '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors';
  zoom = 10;
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
        this.myPos.timestamp = pos.timestamp;
        this.myPos.latitude = pos.coords.latitude;
        this.myPos.longitude = pos.coords.longitude;
        this.center = [this.myPos.latitude, this.myPos.longitude];
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

  beforeDestroy(): void {
    clearInterval(this.devicePosTimer);
  }

  selectActive(device: any): void {
    clearInterval(this.devicePosTimer);
    this.activeDevice = device;
    this.devicePosTimer = setInterval(() => {
      this.getDevicePos(this.activeDevice);
    }, 5000);
    this.getDevicePos(device);
  }

  deleteDevice(device: any): void {
    if (confirm("Are you sure you want to delete device " + device)) {
      axios
        .delete(`http://localhost:3000/api/devices/${device}`, {
          withCredentials: true,
        })
        .then((res) => {
          clearInterval(this.devicePosTimer);
          this.activeDevice = "";
          this.removeDevice(device);
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    }
  }

  addNewDevice(e: Event): void {
    e.preventDefault();
    if (this.newDevice.length === 0) return;

    axios
      .post(`http://localhost:3000/api/devices/${this.newDevice}`, null, {
        withCredentials: true,
      })
      .then((res) => {
        this.addDevice(this.newDevice);
        this.newDevice = "";
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  }

  getDevicePos(device: string): void {
    //do we support geolocation
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not available.");
    }
    // get position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.myPos.timestamp = pos.timestamp;
        this.myPos.latitude = pos.coords.latitude;
        this.myPos.longitude = pos.coords.longitude;
        this.markerLatLng = [this.myPos.latitude, this.myPos.longitude];
      },
      (err) => {
        alert(err);
      }
    );

    axios
      .get(`http://localhost:3000/api/devices/${device}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.devicePos.timestamp = res.data.timestamp;
        this.devicePos.latitude = res.data.latitude;
        this.devicePos.longitude = res.data.longitude;

        this.distance = Math.round(this.dist(this.myPos, this.devicePos));
        this.petLatLng = [this.devicePos.latitude, this.devicePos.longitude];
      })
      .catch((err) => {
        alert(err.response.data.error);
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

  private getTime(timestamp: number): string {
    const date = new Date(timestamp);

    const cHours = this.zpad(date.getHours());
    const cMinutes = this.zpad(date.getMinutes());
    const cSeconds = this.zpad(date.getSeconds());

    return `${cHours}:${cMinutes}:${cSeconds}`;
  }

  // Zero padding
  private zpad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
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
    background-color: white;
    border-radius: 0.3em;
  }

  .my-devices {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    form {
      display: flex;
      justify-content: center;

      button {
        margin-left: 1em;
        padding: 1em 2em;
        border: none;
        border-radius: 0.2em;
        color: white;
        background-color: $accent-color;
        font-size: 1em;
        font-weight: bold;
        transition: 0.2s ease-in-out;

        &:hover {
          background-color: darken($accent-color, 5%);
        }
      }
    }

    ul {
      margin: 1em 0;
      border-bottom: 0.2em solid $primary-color;
    }

    .device {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: 1em;

      &:hover {
        background-color: darken(white, 10%);
      }

      &.active {
        background-color: darken(white, 10%);
      }

      button:hover {
        color: darken(red, 15%);
        border-color: darken(red, 15%);
      }
    }
  }

  button {
    background-color: transparent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0.2em solid $primary-color;
    border-radius: 2em;
    width: 3em;
    height: 3em;
    cursor: pointer;
    padding: 0.5em;
  }

  .device-details {
    flex-grow: 2;
  }

  .no-device-selected {
    flex-grow: 2;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
