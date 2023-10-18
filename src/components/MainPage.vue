<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col p-20">
      <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Меню</label>
      <div class="divider lg:hidden"></div>
      <article class="prose pb-6">
        <h1>Карты</h1>
      </article>
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
      <article class="prose">
        <h1>Настройки аккаунта</h1>
        <h3>Имя:</h3>
        <label class="input-group">
          <input type="text" placeholder="Введите новое имя" class="input input-bordered w-full max-w-xs"
            v-model="newName" @keyup.enter="nameUpdate" />
          <button class="btn" @click.enter="nameUpdate" @click="nameUpdate">Изменить</button>
        </label>
        <h3>Аватар:</h3>
        <label class="input-group">
          <input type="text" placeholder="Вставьте ссылку на новый аватар" class="input input-bordered w-full max-w-xs"
            v-model="newAvatar" @keyup.enter="avatarUpdate" />
          <button class="btn" @click.enter="avatarUpdate" @click="avatarUpdate">Изменить</button>
        </label>
      </article>
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
        <li><a href="https://github.com/awercode/materialbank" target="_blank" rel="noopener noreferrer">Github</a></li>
        <li><button @click="handleSignOut" v-if="isLoggedIn">Выйти</button></li>
      </ul>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, collection, setDoc } from 'firebase/firestore';
import { useDocument } from 'vuefire'
import router from '@/router';

const isLoggedIn = ref(false);

const db = getFirestore();

let cards;
let fullname;
let avatar;
let auth;
let userData;
let newName = ref();
let newAvatar = ref();

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      userData = useDocument(doc(collection(db, 'users'), auth.currentUser.uid))
      if (userData.value) {
        fullname = userData.value.fullname;
        avatar = userData.value.avatar;
        cards = userData.value.cards;
      }
      return userData, fullname, avatar, cards, auth;
    } else {
      isLoggedIn.value = false;
      router.push('/login')
    }
  });
});
const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push('/login');
  });
};

const profileRoute = () => {
  router.push('/');
}

const nameUpdate = async () => {
  await setDoc(doc(db, 'users', auth.currentUser.uid), {
    fullname: newName.value
  }, {merge: true})
}

const avatarUpdate = async () => {
  await setDoc(doc(db, 'users', auth.currentUser.uid), {
    avatar: newAvatar.value
  }, {merge: true})
}

</script>

<script>
export default {
  name: 'MainPage'
}
</script>