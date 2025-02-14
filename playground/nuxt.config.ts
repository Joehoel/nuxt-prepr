export default defineNuxtConfig({
  modules: ['nuxt-prepr'],
  devtools: { enabled: true },
  compatibilityDate: '2025-02-13',
  prepr: {
    apiUrl: 'https://graphql.prepr.io/',
    adminUrl: 'https://iday-de-indruk-78nj.prepr.io/publish/content-items',
    accessToken: "ac_fed0c925c5cdbf4d85fd5f5787060f825e32369c1054252222d8688d0bb24d8b",
  },
})