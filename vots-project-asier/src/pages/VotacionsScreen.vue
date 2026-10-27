
<template>
  <v-container class="pagina">
    <header class="capcalera">
      <h1>Votacions en temps real</h1>
      <p>Usuari: {{ store.loginInfo.username }}</p>

      <v-btn variant="outlined" color="primary" @click="tancarSessio">
        Tancar sessió
      </v-btn>
    </header>

    <div class="estat" :class="{ connectat }">
      {{ connectat ? 'Connectat al servidor' : 'Connectant al servidor...' }}
    </div>

    <h2>Tria la teva opció</h2>

    <div class="opcions">
      <BotoVotar
        v-for="(vots, index) in store.votos"
        :key="index"
        :opcio="index"
        :vots="vots"
        :connectat="connectat"
        @votar="votar"
      />
    </div>

    <section class="grafica">
      <h2>Resultats de les votacions</h2>

      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </section>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import BotoVotar from '@/components/BotoVotar.vue'
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
      tipo: 'votar',
      opcion: opcio,
    }))
  }
}

function tancarSessio() {
  store.setLoginInfo({
    loggedIn: false,
    username: '',
    image: '',
  })

  if (socket) {
    socket.close()
    socket = null
  }

  router.push('/')
}

onMounted(() => {
  if (!store.isLoggedIn) {
    router.replace('/')
    return
  }

  // En desenvolupament local, el servidor escolta al port 3000.
  socket = new WebSocket('ws://localhost:3000')

  socket.onopen = () => {
    connectat.value = true
  }

  socket.onmessage = (event) => {
    try {
      const missatge = JSON.parse(event.data)

      if (
        missatge.tipo === 'votos' &&
        Array.isArray(missatge.votos) &&
        missatge.votos.length === 4 &&
        missatge.votos.every(
          (vot) => Number.isInteger(vot) && vot >= 0
        )
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

  socket.onerror = (error) => {
    connectat.value = false
    console.error('Error WebSocket:', error)
  }

  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels: ['Opció 1', 'Opció 2', 'Opció 3', 'Opció 4'],
        datasets: [{
          label: 'Vots',
          data: [...store.votos],
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
  (nousVots) => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = [...nousVots]
      chartInstance.update()
    }
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (socket) {
    socket.close()
    socket = null
  }

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.pagina {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 20px;
}

.capcalera {
  text-align: center;
  margin-bottom: 25px;
}

.capcalera h1 {
  font-size: 30px;
  margin-bottom: 10px;
  color: #1976d2;
}

.estat {
  padding: 12px;
  margin-bottom: 25px;
  text-align: center;
  background: #fff3cd;
  color: #795600;
}

.estat.connectat {
  background: #e4f5e9;
  color: #216b38;
}

h2 {
  font-size: 22px;
  margin-bottom: 20px;
}

.opcions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.grafica {
  margin-top: 35px;
  padding: 20px;
  border: 1px solid #ddd;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 350px;
}

@media (max-width: 750px) {
  .opcions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 450px) {
  .opcions {
    grid-template-columns: 1fr;
  }
}
</style>
