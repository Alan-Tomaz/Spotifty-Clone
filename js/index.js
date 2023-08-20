//Reset All The Variables in Cache
localStorage.clear();

/* =========== Module Pattern ============== */
const APIController = (function () {

    //redirect url
    const redirectUri = `${window.location.href}pages/app.html`;
    //request URL
    const AUTHORIZATION_URL = "https://accounts.spotify.com/authorize";

    //request authorization
    const _requestAuthorization = (clientId) => {
        //object to take URL paramers
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", encodeURI(redirectUri));
        params.append("show_dialog", true);
        params.append("scope", "user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private user-follow-read");
        //redirect to spotify authorization screen
        window.location.href = `${AUTHORIZATION_URL}?${params.toString()}`;
    }

    return {

        redirectUri: redirectUri,

        requestAuthorization(clientId) {
            _requestAuthorization(clientId);
        }
    }

})();

const FormValidator = (function (APICtrl) {

    const FormFields = {
        clientId: '#client-id',
        clientSecret: '#client-secret',
        submit: '#submit',
        alert: '#alert',
        alertMessage: '#alert-message'
    }

    function submitFormEvent() {
        document.querySelector(FormFields.submit).addEventListener('click', (e) => {
            //Prevent the btn to submit
            e.preventDefault();
            //Check if the fields are empty
            if (document.querySelector(FormFields.clientId).value == "" || document.querySelector(FormFields.clientSecret).value == "") {
                document.querySelector(FormFields.alertMessage).style.display = "flex";
                document.querySelector(FormFields.alert).innerHTML = "Fill in all Fields!";
            } else {
                //get and save client credentials
                const clientId = document.querySelector(FormFields.clientId).value;
                const clientSecret = document.querySelector(FormFields.clientSecret).value;
                localStorage['client-id'] = clientId;
                localStorage['client-secret'] = clientSecret;
                localStorage['redirect-uri'] = APICtrl.redirectUri;
                localStorage['root-url'] = window.location.href;
                //get authorization
                APICtrl.requestAuthorization(clientId);
            }

        })
    }

    return {

        init() {
            submitFormEvent();
        }
    }

})(APIController)

//Start Form Validation
FormValidator.init();