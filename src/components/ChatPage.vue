<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-1" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col p-60">
      <label for="my-drawer-1" class="btn btn-primary drawer-button lg:hidden">Меню</label>
      <div class="divider lg:hidden"></div>

      <div class="flex flex-col" v-if="messages">
        <div class="card max-h-96 overflow-auto shadow-xl">
          <div v-for="msg in messages" v-bind:key="msg">
            <div class="chat chat-end" v-if="msg[2]">
              <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                  <img v-bind:src="msg[1].avatar" />
                </div>
              </div>
              <div class="chat-header">
                {{ msg[1].fullname }}
                <time class="text-xs opacity-50">{{ msg[0].time.toDate().toString().slice(4, -40) }}</time>
              </div>
              <div class="chat-bubble">{{ msg[0].message }}</div>
            </div>
            <div class="chat chat-start" v-else>
              <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                  <img v-bind:src="msg[1].avatar" />
                </div>
              </div>
              <div class="chat-header">
                {{ msg[1].fullname }}
                <time class="text-xs opacity-50">{{ msg[0].time.toDate().toString().slice(4, -40) }}</time>
              </div>
              <div class="chat-bubble">{{ msg[0].message }}</div>
            </div>
          </div>
        </div>

        <div class="form-control pt-6">
          <div class="input-group">
            <input @keyup.enter="sendMessage(msgToSend, userId)" type="text" placeholder="Введите сообщение"
              class="input input-bordered" v-model="msgToSend" />
            <button class="btn" @click="sendMessage(msgToSend, userId)">Отправить</button>
            <button class="btn btn-neutral" @click="clearChat">Очистить чат</button>
          </div>
        </div>
      </div>
      <p v-else>Чаты не загружены. Попробуйте заново войти в аккаунт.</p>
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
        <li><a href="https://github.com/awercode/materialbank" target="_blank" rel="noopener noreferrer">Github</a></li>
        <li><button @click="handleSignOut" v-if="isLoggedIn">Выйти</button></li>
      </ul>

    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, toRaw } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, collection, Timestamp, setDoc, deleteDoc } from 'firebase/firestore';
import { useCollection, useDocument } from 'vuefire';
import router from '@/router';

const isLoggedIn = ref(false);

const db = getFirestore();

let fullname;
let avatar;
let auth;
let userData;
let senders = [];
let messages = [];
let chat;
let userId;

onBeforeMount(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      userData = useDocument(doc(collection(db, 'users'), auth.currentUser.uid))
      userId = doc(collection(db, 'users'), auth.currentUser.uid).id;
      if (userData.value) {
        fullname = userData.value.fullname;
        avatar = userData.value.avatar;
      }
      chat = useCollection(collection(db, 'chat'));
      for (let msg in chat.value) {
        let isMy;
        let senderId = chat.value[msg].user;
        senders.push(toRaw(useDocument(doc(collection(db, 'users'), senderId)).value));
        if (senderId === auth.currentUser.uid) {
          isMy = true;
        } else {
          isMy = false;
        }
        messages.push([
          toRaw(chat.value[msg]),
          toRaw(useDocument(doc(collection(db, 'users'), senderId)).value),
          isMy
        ]);
      }
      return chat, userData, senders, messages, userId;
    } else {
      isLoggedIn.value = false;
      router.push('/login');
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
};

const sendMessage = async (msg, id) => {
  let date = Timestamp.now()
  await setDoc(doc(db, 'chat', date.toMillis().toString()), {
    message: msg,
    user: id,
    time: date
  });
};

const clearChat = async () => {
  let chat;
  let msg;
  let id;
  let len;
  chat = useCollection(collection(db, 'chat'));
  len = toRaw(chat.value).length;
  while (parseInt(len) != 0) {
    for (msg in chat.value) {
      id = chat.value[msg].id;
      await deleteDoc(doc(db, 'chat', id.toString()));
    }
    chat = useCollection(collection(db, 'chat'));
    len = toRaw(chat.value).length;
  }
};
</script>

<script>
export default {
  name: 'ChatPage'
}
</script>