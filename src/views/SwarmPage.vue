<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center" text-align: center>Swarm Section</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div style = "width:80%; margin-left:10%">
      <!-- <ion-button  class="autopilotButton" color="tertiary" @click="connect">Conecta</ion-button>
     
      <ion-button  class="autopilotButton" color="tertiary" @click="exhibicion1">Exhibición #1</ion-button>
      <ion-button  class="autopilotButton" color="tertiary" @click="exhibicion2">Exhibición #2</ion-button>
      
      <ion-button  class="autopilotButton" color="secondary" @click="land">Aterriza</ion-button> -->
      <ion-button v-if = "state == 'disconnected'" class="autopilotButton" color="primary" @click="connect">Conecta escuadron</ion-button>
      <ion-button v-if = "state == 'connecting'" class="autopilotButton" color="warning">Conectando</ion-button>
      <ion-button v-if = "state == 'connected'" class="autopilotButton" color="tertiary" @click="connect">Conectado</ion-button>

      <ion-button  v-if = "state != 'connected' && state != 'takingOff' &&  state != 'flying'" class="autopilotButton" color="medium">Despega escuadron</ion-button>
      <ion-button  v-if = "state == 'connected'" class="autopilotButton" color="primary" @click="takeOff">Despega escuadron</ion-button>
      <ion-button  v-if = "state == 'takingOff'" class="autopilotButton" color="warning">Despegando</ion-button>
      <ion-button  v-if = "state == 'flying'" class="autopilotButton" color="tertiary" @click="takeOff">Volando</ion-button>
      

      <ion-button  v-if = "state == 'flying'"  id="forward" class="autopilotButton" color="primary" @click="go($event)">Adelante</ion-button>
      <ion-button  v-if = "state == 'forward'"  id="forward" class="autopilotButton" color="tertiary">Adelante</ion-button>
      <ion-button  v-if = "state != 'flying' && state != 'forward'"  id="forward" class="autopilotButton" color="medium">Adelante</ion-button>

      <ion-button  v-if = "state == 'flying'"  id="back" class="autopilotButton" color="primary" @click="go($event)">Atras</ion-button>
      <ion-button  v-if = "state == 'back'"  id="back" class="autopilotButton" color="tertiary">Atras</ion-button>
      <ion-button  v-if = "state != 'flying' && state != 'back'" id="back" class="autopilotButton" color="medium">Atras</ion-button>

      
      <ion-button  v-if = "state == 'flying'"  id="turnLeft" class="autopilotButton" color="primary" @click="go($event)">Gira izquierda</ion-button>
      <ion-button  v-if = "state == 'turnLeft'"  id="turnLeft" class="autopilotButton" color="tertiary">Gira izquierda</ion-button>
      <ion-button  v-if = "state != 'flying' && state != 'turnLeft'"  id="turnLeft" class="autopilotButton" color="medium">Gira izquierda</ion-button>

      
      <ion-button  v-if = "state == 'flying'"  id="turnRight" class="autopilotButton" color="primary" @click="go($event)">Gira derecha</ion-button>
      <ion-button  v-if = "state == 'turnRight'"  id="turnRight" class="autopilotButton" color="tertiary" >Gira derecha</ion-button>
      <ion-button  v-if = "state != 'flying' && state != 'turnRight'"  id="turnRight" class="autopilotButton" color="medium" >Gira derecha</ion-button>

      
      <ion-button  v-if = "state == 'flying'"  id="rotateLeft" class="autopilotButton" color="primary" @click="go($event)">Rota izquierda</ion-button>
      <ion-button  v-if = "state == 'rotateLeft'"  id="rotateLeft" class="autopilotButton" color="tertiary">Rota izquierda</ion-button>
      <ion-button  v-if = "state != 'flying' && state != 'rotateLeft'"  id="rotateLeft" class="autopilotButton" color="medium" >Rota izquierda</ion-button>

      
      <ion-button  v-if = "state == 'flying'"  id="rotateRight" class="autopilotButton" color="primary" @click="go($event)">Rota derecha</ion-button> 
      <ion-button  v-if = "state == 'rotateRight'"  id="rotateRight" class="autopilotButton" color="tertiary">Rota derecha</ion-button> 
      <ion-button  v-if = "state != 'flying' && state != 'rotateRight'"  id="rotateRight" class="autopilotButton" color="medium">Rota derecha</ion-button> 
 
      <ion-button v-if = "state == 'flying'"  id="land" class="autopilotButton" color="primary" @click="land">Aterriza</ion-button>
      <ion-button v-if = "state == 'landing'"  id="land" class="autopilotButton" color="warning">Aterriza</ion-button>

      <ion-button v-if = "state != 'flying' && state != 'landing' "  id="land" class="autopilotButton" color="medium">Aterriza</ion-button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, inject, onMounted, ref } from 'vue';
import { IonPage,alertController , IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput} from '@ionic/vue';
import { useMQTT } from 'mqtt-vue-hook' 
import axios from 'axios'

export default  defineComponent({
  name: 'SwarmPage',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton },

  setup() {

    let state = ref('disconnected');   

    //let connection = new WebSocket(`ws://localhost:8000`);
    let connection = new WebSocket(`ws://192.168.137.1:8002`); 
    connection.onmessage = function (event) {
      state.value = event.data
    }
     
    function connect() {

      console.log ('connect')
      state.value = 'connecting'
      connection.send ('connect')
      console.log ('connected')
    }
    function takeOff() {
      console.log ('takeOff')
      state.value = 'takingOff'
      connection.send ('takeOff')
    }
    function go (event) {
      console.log ('entro')

      let command = event.currentTarget.id;
      state.value = command
      connection.send (command)
   
    }
     
    function exhibicion1() {
      connection.send ('case1')

    }
    function exhibicion2(){
      connection.send ('case2')
    }
    function land(){
      state.value = 'landing'
      connection.send ('land')
    }

    return {
      exhibicion1,
      exhibicion2,
      connect,
      connection,
      takeOff,
      go,
      state,
      land

    }
  }
});
</script>

<style>

  .autopilotButton {
    display: flex;
    margin: 10%;
  }

  .direction {
    display: grid;
    grid-template-rows: 100px 100px 100px;
    grid-template-columns: 100px 100px 100px;
    text-align: center;
    width:80%;
    margin-left: 5%;

  }


  body {
    display: flex;
    justify-content: center;
  }
  .box {
    background: #444;
    border: 1px solid #555;
    display: flex;
    align-items: center;
    justify-content: center;
    color: yellowgreen;
    font-size: 18px;
    margin: 5px
  }
  .box2 {
    background: rgb(233, 226, 226);
    border: 1px solid #555;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(224, 16, 16);
    font-size: 18px;
    margin: 5px
  }
</style>
