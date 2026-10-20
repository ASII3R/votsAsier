
<template>
  <v-container>
    <v-row align="center" class="mb-4">
      <v-col>
        <h1>Votacions en temps real</h1>
        <p>Usuari: {{ store.loginInfo.username }}</p>
      </v-col>

      <v-col cols="auto">
        <v-btn color="secondary" @click="tancarSessio">
          Tancar sessió
        </v-btn>
      </v-col>
    </v-row>

    <v-alert
      :type="connectat ? 'success' : 'warning'"
      class="mb-4"
    >
      {{ connectat ? 'Connectat al servidor' : 'Connectant al servidor...' }}
    </v-alert>

    <v-row>
      <v-col
        v-for="(vots, index) in store.votos"
        :key="index"
        cols="12"
        sm="6"
        md="3"
      >
        <VotoVotar
        :opcio="index"
        :vots="vots"
        @votar="votar"
        />
      </v-col>
    </v-row>

    <v-card class="pa-4 mt-8">
      <v-card-title>Resultats de les votacions</v-card-title>

      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import VotoVotar from '@/components/VotoVotar.vue'
import Chart from 'chart.js/auto'

const store = useAppStore()
const router = useRouter()

const connectat = ref(false)
const chartCanvas = ref(null)

let socket = null
let chartInstance = null

function votar(opcio) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'votar',
      opcio,
    }))
  }
}

function tancarSessio() {
  store.setLoginInfo({
    loggedIn: false,
    username: '',
    image: '',
  })

  router.push('/')
}

onMounted(() => {
  if (!store.isLoggedIn) {
    router.push('/')
    return
  }

  socket = new WebSocket('ws://localhost:3000')

  socket.onopen = () => {
    connectat.value = true
  }

  socket.onmessage = event => {
    try {
      const missatge = JSON.parse(event.data)

      if (
        missatge.type === 'votos' &&
        Array.isArray(missatge.votos) &&
        missatge.votos.length === 4
      ) {
        store.setVotos(missatge.votos)
      }
    } catch (error) {
      console.error('Error llegint els vots:', error)
    }
  }

  socket.onclose = () => {
    connectat.value = false
  }

  socket.onerror = error => {
    console.error('Error WebSocket:', error)
    connectat.value = false
  }

  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels: ['Opció 1', 'Opció 2', 'Opció 3', 'Opció 4'],
        datasets: [{
          label: 'Vots',
          data: store.votos,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    })
  }
})

watch(
  () => store.votos,
  nousVots => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = [...nousVots]
      chartInstance.update()
    }
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (socket) socket.close()
  if (chartInstance) chartInstance.destroy()
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 50vh;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
}
</style>
