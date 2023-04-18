<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title class="ion-text-center">App para controlar drones</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-button @click = 'connect' class="connectButton" href = "/tabs">Empezamos</ion-button>
      </ion-content>
    </ion-page>
</template>
  
<script>
  import { defineComponent, onMounted } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
  import { useMQTT } from 'mqtt-vue-hook'
  
  export default  defineComponent({
    name: 'ComponentTab',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton },

    setup() {
      const mqttHook = useMQTT()
      onMounted(() => {
        //mqttHook.publish("mobileApp/autopilotService/connect", "", 1)
      })
      
      function connect () {
        //mqttHook.publish("mobileApp/autopilotService/connect", "", 1)
      }
      return {
        connect

      }
    }
  })
</script>

<style>

.connectButton {
  margin: 10%;
  height: 80%;
  width: 80%;
}

</style>
  