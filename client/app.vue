<script lang="ts" setup>
import { useDevtoolsClient } from "@nuxt/devtools-kit/iframe-client";
import { DEVTOOLS_MODULE_TITLE } from "../src/contants";
import { NButton } from "#components";

const client = useDevtoolsClient();

const router = computed(
  () => client.value?.host?.nuxt.vueApp.config.globalProperties?.$router
);
</script>

<template>
  <div class="relative p-10 n-bg-base flex flex-col h-screen">
    <h1 class="text-3xl font-bold">{{ DEVTOOLS_MODULE_TITLE }}</h1>
    <div class="opacity-50 mb-4">Nuxt Prepr Integration</div>
    <NButton @click="router.push('/hallo')" />
    <div v-if="client" class="flex flex-col gap-2">
      <NTip n="green" icon="carbon-checkmark">
        Nuxt DevTools is connected
      </NTip>
      <div>
        The current app is using
        <code class="text-green"
          >vue@{{ client.host.nuxt.vueApp.version }}</code
        >
      </div>
    </div>

    <div v-else>
      <NTip n="yellow">
        Failed to connect to the client. Did you open this page inside Nuxt
        DevTools?
      </NTip>
    </div>

    <NCard class="p4">
      <div class="n-header-upper">Radios</div>
      <form class="flex items-center gap-3">
        <NRadio v-model="segment" n="red6 dark:red5" name="name" value="a">
          Apple
        </NRadio>
        <NRadio
          v-model="segment"
          n="yellow6 dark:yellow5"
          name="name"
          value="b"
        >
          Banana
        </NRadio>
        <NRadio
          v-model="segment"
          n="orange6 dark:orange5"
          name="name"
          value="c"
        >
          Orange
        </NRadio>
      </form>
    </NCard>

    <div class="flex-auto" />
    <ModuleAuthorNote class="mt-5" />
  </div>
</template>
