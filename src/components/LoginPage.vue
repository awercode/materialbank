<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold py-6">Вход в аккаунт</h1>
        <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form class="card-body">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input type="email" placeholder="Email" class="input input-bordered" required v-model="email" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Пароль</span>
              </label>
              <input type="password" placeholder="Пароль" class="input input-bordered" required v-model="password" />
              <label class="label">
                <span class="label-text" v-if="errMsg">{{ errMsg }}</span>
              </label>
              <label class="label">
                <a href="#" class="label-text-alt link link-hover" onclick="authmodal.showModal()">Забыли пароль?</a>

                <dialog id="authmodal" class="modal">
                  <div class="modal-box">
                    <h3 class="font-bold text-lg">Данные для входа</h3>
                    <p class="py-4">Логин: user@local.host, пароль: test123</p>
                    <div class="modal-action">
                      <form method="dialog">
                        <button class="btn">Закрыть</button>
                      </form>
                    </div>
                  </div>
                </dialog>

              </label>
            </div>
            <div class="form-control mt-6">
              <button type="button" class="btn btn-primary" @click="login">Войти</button>
              <router-link to="/register" class="mt-6">Регистрация</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';
const email = ref('');
const password = ref('');
const errMsg = ref();
const router = useRouter();

const isLoggedIn = ref(false);

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      router.push('/')
    } else {
      isLoggedIn.value = false;
    }
  });
});

const login = () => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log('Successfully signed in!')
      console.log(auth.currentUser)
      console.log(auth.currentUser.uid)
      router.push('/')
    })
    .catch((error) => {
      console.log(error.code);
      switch (error.code) {
        case 'auth/invalid-email':
          errMsg.value = "Неправильная почта"
          break;
        case 'auth/user-not-found':
          errMsg.value = "Пользователь не найден"
          break;
        case 'auth/wrong-password':
          errMsg.value = "Неправильный пароль"
          break;
        default:
          errMsg.value = "Неправильная почта или пароль"
          break;
      }
    });
};
</script>

<script>
export default {
  name: 'LoginPage'
}
</script>