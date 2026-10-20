```vue
<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-icon">🗳️</div>

      <h1>Votacions</h1>
      <p class="subtitle">Inicia sesión para participar</p>

      <form @submit.prevent="iniciarSessio">
        <label for="username">Usuario</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Escribe tu usuario"
          autocomplete="username"
          required
        />

        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Escribe tu contraseña"
          autocomplete="current-password"
          required
        />

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit">Iniciar sesión</button>
      </form>

      <p class="credentials">
        Usuario de prueba: <strong>user</strong><br />
        Contraseña: <strong>123</strong>
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const store = useAppStore()

const username = ref('')
const password = ref('')
const error = ref('')

function iniciarSessio() {
  if (username.value.trim() === 'user' && password.value === '123') {
    store.setLoginInfo({
      loggedIn: true,
      username: username.value.trim(),
      image: 'https://placehold.co/100x100',
    })

    router.push('/votacions')
  } else {
    error.value = 'Usuario o contraseña incorrectos.'
  }
}
</script>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: #f1f5f9;
  color: #111827;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 36px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  color: #111827;
}

.login-icon {
  text-align: center;
  font-size: 42px;
  margin-bottom: 12px;
}

h1 {
  margin: 0;
  text-align: center;
  color: #111827;
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  margin: 10px 0 28px;
  text-align: center;
  color: #4b5563;
  font-size: 16px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 13px 14px;
  margin-bottom: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: #ffffff;
  color: #111827;
  font-size: 16px;
  outline: none;
}

input::placeholder {
  color: #9ca3af;
}

input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

button {
  width: 100%;
  padding: 14px;
  margin-top: 6px;
  border: none;
  border-radius: 9px;
  background: #2563eb;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

.error {
  color: #dc2626;
  font-size: 14px;
  margin: 0;
}

.credentials {
  margin: 24px 0 0;
  text-align: center;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.8;
}
</style>
```