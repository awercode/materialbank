<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col p-20">
      <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Меню</label>
      <div class="divider lg:hidden"></div>
      <div class="flex">
        <div class="flex flex-col" v-if="cards">
          <div v-for="card in cards" v-bind:key="card">
            <div class="stats bg-primary text-primary-content">
              <div class="stat">
                <div class="stat-title">Карта</div>
                <div class="stat-value">** {{ card.number }}</div>
              </div>
              <div class="stat">
                <div class="stat-title">Баланс</div>
                <div class="stat-value">{{ card.balance }} ₽</div>
              </div>
            </div>
            <div class="divider"></div>
          </div>
        </div>
        <p v-else>Карты не загружены. Попробуйте заново войти в аккаунт.</p>
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <li @click="profileRoute">
          <div class="avatar active">
            <div class="w-8 rounded-full">
              <img v-if="avatar" v-bind:src="avatar" />
              <img v-else src="https://randomuser.me/api/portraits/men/35.jpg" />
            </div>
            <p v-if="fullname">{{ fullname }}</p>
            <p v-else>Alfredo Fleming</p>
          </div>
        </li>
        <li><router-link to="/chat">Чат</router-link></li>
        <li><a href="https://github.com/awercode/materialbank">Github</a></li>
        <li><button @click="handleSignOut" v-if="isLoggedIn">Выйти</button></li>
      </ul>

    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, collection } from 'firebase/firestore';
import { useDocument } from 'vuefire'
import router from '@/router';

const isLoggedIn = ref(false);

const db = getFirestore();

let cards;
let fullname;
let avatar;

let auth;
onBeforeMount(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      let user = useDocument(doc(collection(db, 'users'), auth.currentUser.uid))
      if (user.value) {
        fullname = user.value.fullname;
        avatar = user.value.avatar;
        cards = user.value.cards;
      }
    } else {
      isLoggedIn.value = false;
      router.push('/login')
    }
  });
});
const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/login')
  });
};

const profileRoute = () => {
  router.push('/')
}

</script>

<script>
export default {
  name: 'MainPage'
}
</script>