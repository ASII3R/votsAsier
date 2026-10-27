
<template>
  <v-card class="pa-4 text-center" variant="outlined">
    <v-card-title>Opció {{ opcio + 1 }}</v-card-title>

    <v-card-text>
      <div class="numero">{{ vots }}</div>
      <div>vots</div>
    </v-card-text>

    <v-btn
      color="primary"
      block
      :disabled="!connectat"
      @click="$emit('votar', opcio)"
    >
      Votar
    </v-btn>
  </v-card>
</template>

<script setup>
defineProps({
  opcio: {
    type: Number,
    required: true,
  },
  vots: {
    type: Number,
    required: true,
  },
  connectat: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['votar'])
</script>

<style scoped>
.numero {
  font-size: 32px;
  font-weight: bold;
  color: #1976d2;
}
</style>
