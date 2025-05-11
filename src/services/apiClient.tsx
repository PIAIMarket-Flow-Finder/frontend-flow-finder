import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://flow-finder-dev-core-engine.kube-ext.isc.heia-fr.ch',
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    timeout: 20000
});

export default apiClient;