<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">Show Color</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
        <div v-if = "color == '#4cf9e6'" style ="background-color: #4cf9e6; height: 100%;"></div>
        <div v-if = "color == 'yellow'" style ="background-color: yellow; height: 100%;"></div>
        <div v-if = "color == '#eb6bcb'" style ="background-color: #eb6bcb; height: 100%;"></div>
        <div v-if = "color == 'green'" style ="background-color: green; height: 100%;"></div>
        <div v-if = "color == 'purple'" style ="background-color: purple; height: 100%;"></div>
        <div v-if = "color == '#23426c'" style ="background-color: #23426c; height: 100%;"></div>


    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref,onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton ,IonTitle } from '@ionic/vue';
import { useMQTT } from 'mqtt-vue-hook'

export default  defineComponent({
  name: 'ShowColor',
  components: { 
    IonHeader, IonToolbar, IonContent, IonPage, IonTitle 
  },

  setup() {
    let connected = ref(true);
    let color = ref ("yellow")
    const mqttHook = useMQTT()
    
    onMounted(() => {
      mqttHook.subscribe("showColor", 1)
      //mqttHook.subscribe("serverplay/newTurn", 1)

      mqttHook.registerEvent('showColor', (topic, message) => {
          const data = JSON.parse(message)
          color.value = data['color']
      })
    })
      
    
    
    // let connection = new WebSocket(`ws://192.168.137.1:8002`);
    // connection.onmessage = function (event) {
    //    console.log (event.data)
    //    color.value = event.data
    // }

 
    return {
        connected,
        color,
        //connection
    };
  },
});
</script>

<style>


</style>
