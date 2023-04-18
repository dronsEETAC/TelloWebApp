<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center">Set Color</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div id = '#4cf9e6' class = "column" style="background-color:#4cf9e6;" v-on:click="setColor($event)"></div>
      <div id = 'yellow'  class = "column" style="background-color:yellow;"  v-on:click="setColor($event)"></div>
      <div id = '#eb6bcb' class = "column" style="background-color:#eb6bcb; " v-on:click="setColor($event)"></div>
      <div id = 'green'  class = "column" style="background-color:green; " v-on:click="setColor($event)"></div>
      <div id = 'purple' class = "column" style="background-color:purple;" v-on:click="setColor($event)"></div>
      <div id = '#23426c'  class = "column" style="background-color:#23426c; " v-on:click="setColor($event)"></div>
      
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle } from '@ionic/vue';
import { useMQTT } from 'mqtt-vue-hook' 

export default  defineComponent({
  name: 'SetColor',
  components: { 
    IonHeader, IonToolbar, IonContent, IonPage,  IonTitle 
  },

  setup() {
    //let connection = new WebSocket(`ws://192.168.137.1:8002`);
    const mqttHook = useMQTT()
  
    function setColor (event) {
      const payload = {
                color:event.currentTarget.id
      }
      mqttHook.publish("showColor",JSON.stringify (payload));
      //connection.send(color)
    }


    return {
        setColor,
        //connection
    };
  },
});
</script>


<style>

.container {
 
 display: flex;

 flex-direction: row;

}

.column {
  width:45%;
  height: 30%;
  float:left;
  margin: 2%;
}
 
</style>
