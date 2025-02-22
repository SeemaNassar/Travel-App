import{handleFormSubmit} from './js/formHandler'
import './styles/style.scss'
alert("Welcome to Seema App!")

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('SW registered:', reg))
            .catch(err => console.log('SW registration failed:', err));
    });
}

export {
    handleFormSubmit
}