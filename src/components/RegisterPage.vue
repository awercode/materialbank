<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold py-6">Создать аккаунт</h1>
        <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form class="card-body">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input type="email" placeholder="Email" class="input input-bordered" required v-model='email' />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Пароль</span>
              </label>
              <input type="password" placeholder="Пароль" class="input input-bordered" required v-model='password' />
            </div>
            <div class="form-control mt-6">
              <button type="button" class="btn btn-primary" @click="register">Зарегистрироваться</button>
              <router-link to="/login" class="mt-6">Войти</router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router';
const email = ref('');
const password = ref('');
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

const db = getFirestore()

const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      const userData = {
        fullname: 'Leo Burns',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
        cards: {
          0: {
            balance: 812,
            number: 6381
          },
          1: {
            balance: 0,
            number: 2901
          },
          2: {
            balance: 67.89,
            number: 3201
          }
        }
      }
      const docRef = setDoc(doc(db, 'users', auth.currentUser.uid), userData);

      console.log('Successfully registered!')
      router.push('/')
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};
</script>

<script>
export default {
  name: 'LoginPage'
}
</script>