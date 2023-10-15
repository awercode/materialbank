<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center">
      <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Меню</label>
      <div class="divider lg:hidden"></div>
      <p>Не успел сделать :(</p>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <li @click="profileRoute">
          <div class="avatar">
            <div class="w-8 rounded-full">
              <img v-if="avatar" v-bind:src="avatar" />
              <img v-else src="https://randomuser.me/api/portraits/men/35.jpg" />
            </div>
            <p v-if="fullname">{{ fullname }}</p>
            <p v-else>Alfredo Fleming</p>
          </div>
        </li>
        <li><router-link to="/chat" class="active">Чат</router-link></li>
        <li><a href="https://github.com/awercode/materialbank">Github</a></li>
        <li><button @click="handleSignOut" v-if="isLoggedIn">Выйти</button></li>
      </ul>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, collection } from 'firebase/firestore';
import { useDocument } from 'vuefire'
import router from '@/router';

const isLoggedIn = ref(false);

const db = getFirestore();

let fullname;
let avatar;

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      let user = useDocument(doc(collection(db, 'users'), auth.currentUser.uid))
      if (user.value) {
        fullname = user.value.fullname;
        avatar = user.value.avatar;
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
  name: 'ChatPage'
}
</script>