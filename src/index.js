// REACT
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// ESTILOS
import './estilos/iconos/fontawesome-all.css';
import './estilos/main.scss';
// COMPONENTES
import App from './app';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
    <BrowserRouter>
        <section>
            <App/>
            <div id="landscapeCover">
                <p>Debe de girar el dispositivo para poder utilizar la aplicación.</p>
            </div>
        </section>
    </BrowserRouter>), 
    document.getElementById('root'));

serviceWorker.register();

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});