import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Restaurant from "../components/Restaurant/Restaurant";
import Jeu from "../components/Jeu/Jeu"


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/restaurant/details',
    name: 'Restaurant',
    component: Restaurant,
  },
  {
    path: '/easterEgg',
    name: 'Jeu',
    component: Jeu,
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
