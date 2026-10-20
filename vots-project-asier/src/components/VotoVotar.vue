
<template>
  <v-card class="pa-4 text-center" height="100%">
    <v-card-title class="justify-center">
      Opció {{ opcio + 1 }}
    </v-card-title>

    <v-card-text>
      <div class="text-h4">{{ vots }}</div>
      <div>vots</div>
    </v-card-text>

    <v-btn
      color="primary"
      block
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
})

defineEmits(['votar'])
</script>
