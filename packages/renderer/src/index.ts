import {createApp} from 'vue';
import App from '/@/App.vue';

import {create} from 'ipfs-http-client';
export const ipfs = create({host: 'localhost', port: 5001, protocol: 'http'});

createApp(App).mount('#app');
