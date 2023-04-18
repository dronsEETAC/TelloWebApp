<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center" text-align: center>Play Section</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div style = "width:80%; margin-left:10%">
      <ion-button  v-if = "yourTurn == undefined" class="autopilotButton" color="tertiary" @click="play">Play</ion-button>
      <ion-button  v-if = "yourTurn != undefined && turn == yourTurn" class="autopilotButton" color="primary" @click="play">Your turn</ion-button>
      <ion-button  v-if = "yourTurn != undefined && yourTurn != -1 && turn != yourTurn" class="autopilotButton" color="warning" @click="play">Wait</ion-button>
      <ion-button  v-if = "yourTurn == -1" class="autopilotButton" color="danger" @click="play">Sorry</ion-button>

     
      <ion-button   v-if = "state2 != 'despegando' && state2 != 'volando' " class="autopilotButton" color="tertiary" @click="takeOff">Despega</ion-button> 
      <ion-button   v-if = "state2 == 'despegando'" class="autopilotButton" color="warning">Despegando...</ion-button> 

      <ion-button    v-if = "state2 == 'volando'" class="autopilotButton" color="primary">Volando</ion-button> 

      
      <div class="direction">
     
      <div  v-if = "state != 'GiraL'"   id="GiraL" v-on:click="go($event)" class="box">Gira</div>
      <div  v-if = "state == 'GiraL'" id="GiraL"  class="box2">Gira</div>


      <div  v-if = "state != 'Adelante'" id="Adelante" v-on:click="go($event)" class="box" >Adelante</div>
      <div  v-if = "state == 'Adelante'" id="Adelante" class="box2" >Adelante</div>


      <div v-if = "state != 'GiraR'" id="GiraR" v-on:click="go($event)" class="box">Gira</div>
      <div  v-if = "state == 'GiraR'" id="GiraR"  class="box2">Gira</div>


      <div  v-if = "state != 'Izquierda'" id="Izquierda" v-on:click="go($event)" class="box">Izquierda</div>
      <div  v-if = "state == 'Izquierda'" id="Izquierda" class="box2">Izquierda</div>


      <div  v-if = "state != 'Flip'" id="Flip" v-on:click="go($event)" class="box">Flip</div>
      <div  v-if = "state == 'Flip'" id="Flip"  class="box2">Flip</div>


      <div v-if = "state != 'Derecha'" id="Derecha" v-on:click="go($event)" class="box">Derecha</div>
      <div v-if = "state == 'Derecha'" id="Derecha" class="box2">Derecha</div>


      <div v-if = "state != 'Arriba'" id="Arriba" v-on:click="go($event)" class="box">Arriba</div>
      <div v-if = "state == 'Arriba'" id="Arriba"  class="box2">Arriba</div>


      <div   v-if = "state != 'Atras'" id="Atras" v-on:click="go($event)" class="box">Atrás</div>
      <div  v-if = "state == 'Atras'"  id="Atras" class="box2">Atrás</div>


      <div  v-if = "state != 'Abajo'" id="Abajo" v-on:click="go($event)" class="box">Abajo</div>
      <div  v-if = "state == 'Abajo'" id="Abajo" class="box2">Abajo</div>


      </div>

      <ion-button  class="autopilotButton" color="tertiary"  @click="returnToLaunch">Aterriza</ion-button>
      <div style = "text-align: center; font-size: 40px; color:red ; margin-top: 10%;">{{battery}}</div>

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
  name: 'PlayPage',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton },

  setup() {

    const emitter = inject('emitter');
    const mqttHook = useMQTT()
  
    let altitude = ref(undefined);
    let groundSpeed = ref(undefined);
    let heading = ref(undefined);
    let battery = ref(undefined);
    let direction = ref(undefined);
    let turn = ref (0);
    let yourTurn = ref (undefined)
    let state = ref (undefined)
    let state2 = ref (undefined)
    let playing = false
    let connection = new WebSocket(`ws://192.168.137.1:8002`);
    //let connection = new WebSocket(`ws://localhost.1:8002`);

    connection.onmessage = function (event) {
       console.log (event.data)
       let trozos = event.data.split('/')
       if (trozos[0] == 'late') {
        yourTurn.value = -1
       }
       if (trozos[0] == 'yourTurn') {
        if (playing && yourTurn.value == undefined) {
          yourTurn.value = trozos[1]
          console.log ('mi turno ', yourTurn.value)
        }
       }
       if (trozos[0] == 'newTurn') {
        turn.value = trozos[1]
        console.log ('turno de  ', turn.value)
        console.log ('y yo soy ', yourTurn.value)
      }
      if (trozos[0] == 'volando') {
        state2.value = 'volando'
      }
      if (trozos[0] == 'done') {
        state.value = undefined
      }
      if (trozos[0] == 'battery') {
        battery.value = trozos[1]
      }
      if (trozos[0] == 'onHearth') {
        playing = false
        yourTurn.value = undefined
        turn.value = 0
        state.value = undefined
        state2.value = undefined
       
      }
    }

    function go (event) {
      console.log ('entro')
      if (yourTurn.value == turn.value) {
        let dir = event.currentTarget.id;
        state.value = dir
        connection.send("movement/"+dir +'/'+ yourTurn.value);
      }

   
    }
    function play() {
      console.log ('play')
      playing = true
      connection.send("movement/play");

    }
     
    // function connect() {


    //   console.log ('connect ', yourTurn.value)
    //   mqttHook.publish("movement/connect/" + yourTurn.value);
    //   console.log ('connected')
    // }


    function takeOff() {
      if (playing) {
        state2.value = 'despegando'
        connection.send("movement/takeOff/"+ yourTurn.value);
      }
    }
    function returnToLaunch(){
      connection.send ('movement/land/'+yourTurn.value)
    }

    return {
      takeOff,
      altitude,
      groundSpeed,
      returnToLaunch,
      emitter,
      go,
      heading,
      state,
      state2,
      direction,
      play,
      turn,
      yourTurn,
      playing,
      battery

    }
  }
});
</script>

<style>

  .autopilotButton {
    display: flex;
    margin: 1%;
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
