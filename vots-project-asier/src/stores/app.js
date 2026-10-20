
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // Estat del login
  const loginInfo = ref({
    loggedIn: false,
    username: '',
    image: '',
  })

  // Vots de les quatre opcions
  const votos = ref([0, 0, 0, 0])

  // Getter
  const isLoggedIn = computed(() => loginInfo.value.loggedIn)

  // Accions
  function setLoginInfo({ loggedIn, username, image }) {
    loginInfo.value = {
      loggedIn,
      username,
      image,
    }
  }

  function setVotos(nousVots) {
    votos.value = [...nousVots]
  }

  return {
    loginInfo,
    votos,
    isLoggedIn,
    setLoginInfo,
    setVotos,
  }
})
