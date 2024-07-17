import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import VueFeather from "vue-feather";
import Draggale from "vuedraggable";

const app = createApp(App);

app.component(VueFeather.name, VueFeather);
app.component(Draggale.name, Draggale);
app.mount("#app");
