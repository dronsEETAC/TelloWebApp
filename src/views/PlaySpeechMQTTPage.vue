<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center" text-align: center>Play Speech Section</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div style = "width:80%; margin-left:10%">
      <ion-button  v-if = "facil" class="autopilotButton" color="danger" @click="setLevel">Palabras difíciles</ion-button>
      <ion-button  v-if = "!facil" class="autopilotButton" color="primary" @click="setLevel">Palabras fáciles</ion-button>

      <ion-button  v-if = "yourTurn == undefined" class="autopilotButton" color="tertiary" @click="play">Play</ion-button>
      <ion-button  v-if = "yourTurn != undefined && turn == yourTurn" class="autopilotButton" color="primary" @click="play">Your turn</ion-button>
      <ion-button  v-if = "yourTurn != undefined && yourTurn != -1 && turn != yourTurn" class="autopilotButton" color="warning" @click="play">Wait</ion-button>
      <ion-button  v-if = "yourTurn == -1" class="autopilotButton" color="danger" @click="play">Sorry</ion-button>

     
      <ion-button   v-if = "state2 != 'despegando' && state2 != 'volando' " class="autopilotButton" color="tertiary" @click="takeOff">Despega</ion-button> 
      <ion-button   v-if = "state2 == 'despegando'" class="autopilotButton" color="warning">Despegando...</ion-button> 

      <ion-button    v-if = "state2 == 'volando'" class="autopilotButton" color="primary">Volando</ion-button> 

<!--       
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


      </div> -->
      <img :src="faciles"/>
      
      <!-- <img v-if = "facil" :src="faciles"/>
      <img v-if = "!facil" :src="dificiles"/> -->
      <div class="voice">
        <div id= "startSpeech" class="speech-to-txt"  @click="startSpeechToTxt"></div>       
        <div style = "text-align: center; border-style: solid; font-size: 40px; color:green ; margin-bottom: 10%;margin-top: 0%;">{{texto}}</div>
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
import faciles from "./../assets/palabras_faciles.png"
import dificiles from "./../assets/palabras_dificiles.png"


export default  defineComponent({
  name: 'PlaySpeechPage',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton },

  setup() {

    const emitter = inject('emitter');

    const mqttHook = useMQTT()
  
    let altitude = ref(undefined);
    let groundSpeed = ref(undefined);
    let heading = ref(undefined);
    let battery = ref("battery");
    let direction = ref(undefined);
    let turn = ref (0);
    let yourTurn = ref (undefined)
    let state = ref (undefined)
    let state2 = ref (undefined)
    let playing = false

    let texto = ref ("")
    let facil = ref (true)




    onMounted(() => {
      mqttHook.subscribe("serverplay/yourTurn", 1)
      mqttHook.subscribe("serverplay/newTurn", 1)
      mqttHook.subscribe("serverplay/done", 1)
      mqttHook.subscribe("serverplay/battery", 1)
      mqttHook.subscribe("serverplay/onHearth", 1)
      mqttHook.subscribe("serverplay/flying", 1)
      mqttHook.subscribe("serverplay/late", 1)
      document.getElementById("startSpeech").click()



      mqttHook.registerEvent('serverplay/yourTurn', (topic, message) => {
        if (playing && yourTurn.value == undefined) {
          const data = JSON.parse(message)
          yourTurn.value = data['yourTurn']
          console.log ('mi turno ', data, yourTurn.value)
        }

      })
      
      mqttHook.registerEvent('serverplay/newTurn', (topic, message) => {
        if (yourTurn.value != -1) {
          const data = JSON.parse(message)
          turn.value = data['newTurn']
          console.log ('turno de  ', turn.value)
          console.log ('y yo soy ', yourTurn.value)
        }
      })
      mqttHook.registerEvent('serverplay/done', (topic, message) => {
        if (yourTurn.value != -1) {
          state.value = undefined
          texto.value ='di algo ...'
        }
      })
      mqttHook.registerEvent('serverplay/battery', (topic, message) => {
        if (yourTurn.value != -1) {
          const data = JSON.parse(message)
          battery.value = data['battery']
        }
      })
      mqttHook.registerEvent('serverplay/onHearth', (topic, message) => {
        if (yourTurn.value != -1) {
          playing = false
          yourTurn.value = undefined
          turn.value = 0
          state.value = undefined
          state2.value = undefined
        }
       
      })
      mqttHook.registerEvent('serverplay/flying', (topic, message) => {
        if (yourTurn.value != -1) {
          state2.value = 'volando';
        }
      })
      mqttHook.registerEvent('serverplay/late', (topic, message) => {
        if (yourTurn.value == undefined) {
          yourTurn.value = -1
        }
      })
    
    })

      
    function startSpeechToTxt() {
    // initialisation of voicereco
        console.log ('empezamos ahora')
        texto.value ='di algo ...'
        window.SpeechRecognition =
        window.SpeechRecognition || 
        window.webkitSpeechRecognition;
        const recognition = new window.SpeechRecognition();
        recognition.lang = this.lang_;
        recognition.interimResults = true;

        // event current voice reco word
        recognition.addEventListener("result", event => {      
          var text = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join("");
            console.log ('aaaaa', text)
          texto.value= text;
        });
        // end of transcription
        recognition.addEventListener("end", () => {
          console.log ('end ', texto.value)
          this.transcription_.push(this.runtimeTranscription_);
          this.runtimeTranscription_ = "";
          if (yourTurn.value == turn.value) {
            if (facil.value){
              if (texto.value == 'adelante') {
                mqttHook.publish("movement/Adelante/"+ yourTurn.value);
              } else   if (texto.value == 'atrás') {
                mqttHook.publish("movement/Atras/"+ yourTurn.value);
              } else   if (texto.value == 'izquierda') {
                mqttHook.publish("movement/Izquierda/"+ yourTurn.value);
              } else   if (texto.value == 'derecha') {
                mqttHook.publish("movement/Derecha/"+ yourTurn.value);
              } else   if (texto.value == 'arriba') {
                mqttHook.publish("movement/Arriba/"+ yourTurn.value);
              } else   if (texto.value == 'abajo') {
                mqttHook.publish("movement/Abajo/"+ yourTurn.value);
              } else   if (texto.value == 'gira') {
                mqttHook.publish("movement/GiraL/"+ yourTurn.value);
              } else   if (texto.value == 'flip') {
                mqttHook.publish("movement/Flip/"+ yourTurn.value);
              }
            } 
            else {
              if (texto.value == 'pimiento') {
                mqttHook.publish("movement/Adelante/"+ yourTurn.value);
              } else   if (texto.value == 'amigo') {
                mqttHook.publish("movement/Atras/"+ yourTurn.value);
              } else   if (texto.value == 'castillo') {
                mqttHook.publish("movement/Izquierda/"+ yourTurn.value);
              } else   if (texto.value == 'peluca') {
                mqttHook.publish("movement/Derecha/"+ yourTurn.value);
              } else   if (texto.value == 'naríz') {
                mqttHook.publish("movement/Arriba/"+ yourTurn.value);
              } else   if (texto.value == 'salsa') {
                mqttHook.publish("movement/Abajo/"+ yourTurn.value);
              } else   if (texto.value == 'gazpacho') {
                mqttHook.publish("movement/GiraL/"+ yourTurn.value);
              } else   if (texto.value == 'margarita') {
                mqttHook.publish("movement/Flip/"+ yourTurn.value);
              }

            }
          }

          recognition.stop();
          recognition.start();
        });
        recognition.start();
    }

    function go (event) {
      console.log ('entro')
      if (yourTurn.value == turn.value) {
        let dir = event.currentTarget.id;
        state.value = dir
        mqttHook.publish("movement/"+dir +'/'+ yourTurn.value);
      }
   
    }
    function play() {
      console.log ('play')
      playing = true
      mqttHook.publish("movement/play");
    }
     
    // function connect() {


    //   console.log ('connect ', yourTurn.value)
    //   mqttHook.publish("movement/connect/" + yourTurn.value);
    //   console.log ('connected')
    // }


    function takeOff() {
      if (playing) {
        state2.value = 'despegando'
        mqttHook.publish("movement/takeOff/"+ yourTurn.value);

      }
    }
    function returnToLaunch(){
      mqttHook.publish ('movement/land/'+yourTurn.value)

    }
    function setLevel(){
      facil.value = !facil.value
      texto.value = 'he cambiado'
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
      battery,
      texto,
      startSpeechToTxt,
      runtimeTranscription_: "",
      transcription_: [],
      lang_: "es-ES",
      facil,
      faciles,
      dificiles,
      setLevel

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
