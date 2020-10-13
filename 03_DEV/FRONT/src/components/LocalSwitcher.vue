<template>
  <div class="LocalSwitcher">
    {{ $i18n.locale }}
    <select v-model="$i18n.locale" @change.prevent="changeLocale">
      <option :value="locale.code" v-for="locale in locales" :key="locale.code">
        {{ locale.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { getSupportedLocales } from "@/utils/i18n/supported-locales"
export default {
  name: "LocalSwitcher",
  data: () => ({ locales: getSupportedLocales() }),
  methods: {
    changeLocale(e) {
      const locale = e.target.value
      this.$router.push({ name: this.$route.name, params: { locale: locale } })
    }
  }
}
</script>