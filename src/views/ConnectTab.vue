<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title class="ion-text-center">App para controlar drones</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <img  :src="presentation" style = "margin-top: 20%;"/>
        <ion-button class="connectButton"  href = "/tabs">Ver opciones</ion-button>

        <!-- <ion-button @click = 'connect' class="connectButton" href = "/tabs">Ver opciones</ion-button> -->
      </ion-content>
    </ion-page>
</template>
  
<script>
  import { defineComponent, onMounted } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
  import { useMQTT } from 'mqtt-vue-hook'
  import presentation from "./../assets/presentation.png"
  export default  defineComponent({
    name: 'ComponentTab',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton },

    setup() {
      // const mqttHook = useMQTT()
      // onMounted(() => {
      //   //mqttHook.publish("mobileApp/autopilotService/connect", "", 1)
      // })
      
      // function connect () {
      //   //mqttHook.publish("mobileApp/autopilotService/connect", "", 1)
      // }
      return {
       // connect,
        presentation

      }
    }
  })
</script>

<style>

.connectButton {
  margin-top: 40%;
  margin-left: 10%;
  height: 8%;
  width: 80%;
}

</style>
  