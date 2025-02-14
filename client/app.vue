<script lang="ts" setup>
import { useDevtoolsClient } from "@nuxt/devtools-kit/iframe-client";
import { rpc } from "./composables/rpc";
import { options } from "./composables/state";
import { DEVTOOLS_MODULE_TITLE } from "../src/contants";
const client = useDevtoolsClient();

async function getOptions() {
  options.value = await rpc.value?.getOptions();
}

const segment = ref("a");

console.log(segment.value);
</script>

<template>
  <div class="relative p-10 n-bg-base flex flex-col h-screen">
    <h1 class="text-3xl font-bold">{{ DEVTOOLS_MODULE_TITLE }}</h1>
    <div class="opacity-50 mb-4">Nuxt Prepr Integration</div>

    <div v-if="!client">
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
