<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center" text-align: center>One Drone Section</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div style = "width:80%; margin-left:10%">
      <ion-button  v-if = "state == 'waiting'" class="autopilotButton" color="tertiary" @click="connect">Conecta</ion-button>
      <ion-button  v-if =  "state == 'connecting'" class="autopilotButton" color="warning">Conectando ...</ion-button>
      <ion-button  v-if = " state == 'connected'|| state == 'takingOff'|| state == 'flying'"  @click="connect" class="autopilotButton" color="primary" >Conectado</ion-button>

      <ion-button  v-if = "state != 'connected' && state != 'takingOff'&&  state != 'flying'"  class="autopilotButton" color="medium" >Depega</ion-button>
      <ion-button  v-if = "state == 'connected' " class="autopilotButton" color="tertiary" @click="takeOff">Despega</ion-button> 
      <ion-button  v-if = "state == 'takingOff' " class="autopilotButton" color="warning">Despegando...</ion-button> 
      <ion-button  v-if = "state == 'flying' "  class="autopilotButton" color="primary">Volando</ion-button> 

      
      <div class="direction">
     
      <div  v-if = "state2 != 'GiraL'"   id="GiraL" v-on:click="go($event)" class="box">Gira</div>
      <div  v-if = "state2 == 'GiraL'" id="GiraL"  class="box2">Gira</div>


      <div  v-if = "state2 != 'Adelante'" id="Adelante" v-on:click="go($event)" class="box" >Adelante</div>
      <div  v-if = "state2 == 'Adelante'" id="Adelante" class="box2" >Adelante</div>


      <div v-if = "state2 != 'GiraR'" id="GiraR" v-on:click="go($event)" class="box">Gira</div>
      <div  v-if = "state2 == 'GiraR'" id="GiraR" class="box2">Gira</div>


      <div  v-if = "state2 != 'Izquierda'" id="Izquierda" v-on:click="go($event)" class="box">Izquierda</div>
      <div  v-if = "state2 == 'Izquierda'" id="Izquierda"  class="box2">Izquierda</div>


      <div  v-if = "state2 != 'Flip'" id="Flip" v-on:click="go($event)" class="box">Flip</div>
      <div  v-if = "state2 == 'Flip'" id="Flip"  class="box2">Flip</div>


      <div v-if = "state2 != 'Derecha'" id="Derecha" v-on:click="go($event)" class="box">Derecha</div>
      <div v-if = "state2 == 'Derecha'" id="Derecha"  class="box2">Derecha</div>


      <div v-if = "state2 != 'Arriba'" id="Arriba" v-on:click="go($event)" class="box">Arriba</div>
      <div v-if = "state2 == 'Arriba'" id="Arriba"  class="box2">Arriba</div>


      <div   v-if = "state2 != 'Atras'" id="Atras" v-on:click="go($event)" class="box">Atrás</div>
      <div  v-if = "state2 == 'Atras'"  id="Atras"  class="box2">Atrás</div>


      <div  v-if = "state2 != 'Abajo'" id="Abajo" v-on:click="go($event)" class="box">Abajo</div>
      <div  v-if = "state2 == 'Abajo'" id="Abajo"  class="box2">Abajo</div>


      </div>

      <ion-button  v-if = "state != 'flying'"  class="autopilotButton" color="medium" >Aterriza</ion-button>
      <ion-button  v-if = "state == 'flying' && state2 != 'landing'"  class="autopilotButton"   @click="land" color="tertiary" >Aterriza</ion-button>
      <ion-button  v-if = "state == 'flying' && state2 == 'landing'"  class="autopilotButton"  color="warning" >Aterrizando ...</ion-button>
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
  name: 'OneDronePage',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton },

  setup() {

    const emitter = inject('emitter');
    const mqttHook = useMQTT()
  
    let altitude = ref(undefined);
    let groundSpeed = ref(undefined);
    let heading = ref(undefined);
    let battery = ref(undefined);
    let direction = ref(undefined);
    let state = ref('waiting');
    let state2 = ref('done');
    //let connection = new WebSocket(`ws://localhost:8002`);
    let connection = new WebSocket(`ws://192.168.137.1:8002`);

    connection.onmessage = function (event) {
       console.log ('recibo ',event.data)
       if (event.data.includes ('battery')) {
        let trozos = event.data.split('/')
        battery.value = trozos[1]
      } else if (event.data == 'done') {
        state2.value = 'done'
       } else if (event.data == 'onHearth') {
        state.value = 'connected'
        state2.value = undefined
       } else {
        state.value = event.data
       }
       console.log ('pppp ', state.value)
      
    }


    function go (event) {
      console.log ('entro')
      if (state.value == 'flying' && state2.value == 'done'){

        let dir = event.currentTarget.id;
        state2.value = dir
        console.log ('envio ', dir)
        connection.send (dir)
      }
    }
    
     
    function connect() {
      if (state.value == 'waiting') {
        state.value = 'connecting'
        connection.send ('connect')
        console.log ('connected')
      } else if (state.value == 'connected')  {
        connection.send ('disconnect')
      }
    }


    function takeOff() {
      
      state.value = 'takingOff'
      connection.send ('takeOff')

    }
    function land(){
      state2.value = 'landing'
      connection.send ('land')
    }

    return {
      takeOff,
      altitude,
      groundSpeed,
      land,
      emitter,
      go,
      heading,
      battery,
      connect,
      direction,
      connection,
      state,
      state2

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
