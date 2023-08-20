//Reset All The Variables in Cache
localStorage.clear();

/* =========== Module Pattern ============== */
const FormValidator = (function () {

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
                localStorage.setItem('client-id', document.querySelector(FormFields.clientId).value);
                localStorage.setItem('client-secret', document.querySelector(FormFields.clientSecret).value);
                window.location.href = "./pages/app.html";
            }

        })
    }

    return {

        init() {
            submitFormEvent();
        }
    }

})()

//Start Form Validation
FormValidator.init();