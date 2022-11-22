<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Health Care App </q-toolbar-title>

        <div>&copy; {{ new Date().getFullYear() }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink
          v-for="link in menuLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const menuLinks = [
  {
    title: "Dashboard",
    icon: "school",
    newPage: false,
    // link: "https://quasar.dev",
  },
];

const essentialLinks = [
  {
    title: "Github",
    caption: "github.com/Wong801",
    icon: "code",
    link: "https://github.com/Wong801",
  },
  {
    title: "Linkedin",
    caption: "in/Wong801",
    icon: "public",
    link: "https://linkedin.com/in/Wong801",
  },
];
const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
