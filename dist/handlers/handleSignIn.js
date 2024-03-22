"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSignIn = void 0;
exports.handleSignIn = `async function handleSignIn(email, method = 'navbar') {
    if (document.querySelector('a[href="/users/me"]')) {
        console.log('User is already logged in');
        return;
    }
    // let divElement, emailSubmitButton ;
    if (method === 'navbar') {
        //  click on login button
        const loginButton = document.querySelector('a[href="/users/login"]');
        if (loginButton) {
            loginButton.click();
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const buttons = document.querySelectorAll('button.css-1536zln');
        const desiredText = "Enter your email address";

        let targetButton = null;

        buttons.forEach(button => {
            const spanElement = button.querySelector('svg[height="24"][width="24"] + span.css-1417aqq');

            if (spanElement && spanElement.textContent.trim() === desiredText) {
                targetButton = button;
            }
        });

        if (targetButton) {
            targetButton.click();
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        const emailInputElement = document.querySelector('input[type="email"]');
        if (emailInputElement && emailInputElement.value === '') {
            // emailInputElement.value = String(email);
            // type the email into the input field
            await fillField(emailInputElement, String(email));

        }
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const emailSubmitButton = document.querySelector('button[type="submit"]');
        if (emailSubmitButton) {
            emailSubmitButton.click();
        }
    }
    else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const emailInputElement = document.querySelector('input[type="email"]');
        if (emailInputElement && emailInputElement.value === '') {
            // emailInputElement.value = String(email);
            // type the email into the input field
            await fillField(emailInputElement, String(email));
            // get div element with class css-1le8uha
            const divElement = document.querySelector('div.css-1le8uha');
            if (divElement) {
                divElement.click();
                let cnt = 0;
                const callString = API_ENDPOINT + '/api/emailData/to_mail/' + email;
                while (true) {
                    let data = null;
                    try {
                        const response = await fetch(callString);
                        data = await response.json();
                        // log response code
                        console.log('Response code: ', response.status);
                        if (response.status !== 200) {
                            console.log('Response: ', data);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            continue;
                        }
                        console.log('Data: ', data);
                    }
                    catch (error) {
                        console.log('Error in fetch : ', callString + '-- ', error);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        cnt += 1;
                        //  if count >= 10, reload the page
                        if (cnt >= 40) {
                            window.location.reload();
                        }
                        continue;
                    }

                    console.log('Here');

                    let otp = data.otp;

                    console.log('OTP: ', otp);

                    if (otp.length !== 6) {
                        console.log('OTP not received yet: ', otp);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }
                    else {
                        const putCallString = API_ENDPOINT+'/api/emailData/'+data._id;
                        // do a put request to mark the email as used, i.e set is_already_used to true, use /api/emailData/:id
                        try {
                            const updated_body = data;
                            updated_body.is_already_used = true;
                            
                            const putResponse = await fetch(putCallString, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(updated_body)
                            });
                            const putData = await putResponse.json();
                            console.log('Put data: ', putData);
                        }
                        catch (error) {
                            console.log('Error in put : ', putCallString + ' -- ', error);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            continue;

                        }
                    }

                    const elements = document.querySelectorAll('input[type="number"]');

                    for (let i = 0; i < otp.length; i++) {
                        if (elements[i].value === '') {
                            elements[i].value = otp[i];
                            elements[i].dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }

                    if (method === 'navbar') {
                        const emailSubmitButton2 = document.querySelector('button[type="submit"]');
                        if (emailSubmitButton2) {
                            emailSubmitButton2.click();
                        }

                    }
                    else {
                        // const divElement = document.querySelector('div.css-1le8uha');
                        const divElement2 = document.querySelector('div.css-1le8uha');
                        if (divElement2) {
                            divElement2.click();
                        }
                    }

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    break;
                }
            }
        }
        // wait for 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));

    }
}`;
