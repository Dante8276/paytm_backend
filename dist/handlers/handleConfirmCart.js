"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmCartHandler = void 0;
const handleDom_1 = require("./handleDom");
const handlePaymentPage_1 = require("./handlePaymentPage");
const handleSignIn_1 = require("./handleSignIn");
const handleStorage_1 = require("./handleStorage");
exports.confirmCartHandler = ` async function(email) {

${handleSignIn_1.handleSignIn}
${handlePaymentPage_1.handlePaymentPage}
${handleStorage_1.readFromStorage}
${handleStorage_1.writeToStorage}
${handleDom_1.fillField}
// step1
await handleSignIn(email, 'not_navbar');

const continueButton4 = document.querySelector('div.css-hz2eh5');
if (continueButton4) {
    continueButton4.click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    const agreeToTOS2 = document.querySelector('input[name="tos"]');
    if (agreeToTOS2) {
        agreeToTOS2.click();
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const continueButton5 = document.querySelector('div.css-1le8uha');
    if (continueButton5) {
        continueButton5.click();
    }

    await new Promise(resolve => setTimeout(resolve, 7000));

    if (document.querySelector('h1').textContent === 'Payment Methods') {
        await handlePaymentPage();
    }

}

// if div with css-1le8uha is present click on it
if (document.querySelector('div.css-1le8uha')) {
    document.querySelector('div.css-1le8uha').click();
}


let data = null;
// do an api call to /api/runner/user/:email, do while true loop and check if the response is 200, if not, wait for 1 second and continue
let cnt = 0;
while (true) {

    try {
        const callString = API_ENDPOINT + '/api/runner/user/' + email
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
        // add data.name as user_name in storage
        await writeToStorage('user_name', data.name);
    }
    catch (error) {
        console.log('Error in fetch : ', callString + ' ---', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
        cnt += 1;
        //  if count >= 10, reload the page
        if (cnt >= 10) {
            window.location.reload();
        }
        continue;
    }

    // if response is 200, then break the loop
    break;
}

// step2

let deliveryPage = document.querySelectorAll('div.css-6we4gt')[1];

// get data.is_delivery, if it is true, then click on the delivery page
if (data.is_delivery) {
    deliveryPage = document.querySelectorAll('div.css-6we4gt')[0];
}


if (deliveryPage) {
    deliveryPage.click();
}
else {
    console.log('Delivery page not found');
    // return;
}



const pinCodeVerificationInput = document.querySelector('input[name="pinCode"]');
if (pinCodeVerificationInput && pinCodeVerificationInput.value === '') {
    await fillField(pinCodeVerificationInput, data.pincode);
}

// wait for 1 second
await new Promise(resolve => setTimeout(resolve, 1000));

// get div with class css-v0qw6x
const verifyButton = document.querySelector('div.css-v0qw6x');

if (verifyButton) {
    //  dispatch a click event on the verify button
    // verifyButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    verifyButton.click();
}

await new Promise(resolve => setTimeout(resolve, 3000));

// get input with name as "name"
const nameInput = document.querySelector('input[name="name"]');
if (nameInput && nameInput.value === '') {
    await fillField(nameInput, data.name);
}

await new Promise(resolve => setTimeout(resolve, 1000));

// get input with name as "addressLine1"
const addressInput1 = document.querySelector('input[name="addressLine1"]');
if (addressInput1 && addressInput1.value === '') {
    //  take first 30 characters of the address
    const address_line_1 = data.address_line_1.substring(0, 30);
    await fillField(addressInput1, address_line_1.substring(0, 30));
    // addressInput1.value = address_line_1;
}

await new Promise(resolve => setTimeout(resolve, 1000));

// get input with name as "addressLine2"
const addressInput2 = document.querySelector('input[name="addressLine2"]');
if (addressInput2 && addressInput2.value === '') {
    const address_line_2 = data.address_line_2.substring(0, 30);
    await fillField(addressInput2, address_line_2.substring(0, 30));
    // addressInput2.value = address_line_2;
}

// css-lbwbaf

await new Promise(resolve => setTimeout(resolve, 1000));

const continueButton = document.querySelector('div.css-1le8uha');
if (continueButton) {
    continueButton.click();
}

// wait 2 seconds

await new Promise(resolve => setTimeout(resolve, 2000));

const continueButton2 = document.querySelector('div.css-hz2eh5');
if (continueButton2) {
    continueButton2.click();
}
// get input with id as "billingName"
const billingNameInput = document.querySelector('input[id="billingName"]');

if (billingNameInput && billingNameInput.value === '') {
    await fillField(billingNameInput, data.name);
}

// get input with id as "billingPhoneNumber"
const billingPhoneNumberInput = document.querySelector('input[id="billingPhoneNumber"]');

if (billingPhoneNumberInput && billingPhoneNumberInput.value === '') {
    const phoneNoWithCountryCode = '+' + data.country_code + data.phone_number
    await fillField(billingPhoneNumberInput, phoneNoWithCountryCode);
}

await new Promise(resolve => setTimeout(resolve, 1000));

// get input with id "pincode"
const pincodeInput = document.querySelector('input[id="pincode"]');
if (pincodeInput && pincodeInput.value === '') {
    await fillField(pincodeInput, data.pincode);
}

await new Promise(resolve => setTimeout(resolve, 1000));

// get input with id 'state'
const stateInput = document.querySelector('input[id="state"]');
if (stateInput && stateInput.value === '') {
    await fillField(stateInput, data.state);
}

//<input name="tos" type="checkbox" id="agreeToTOS" class="css-1o6wk8a" value=""> 

await new Promise(resolve => setTimeout(resolve, 1000));

const agreeToTOS = document.querySelector('input[name="tos"]');
if (agreeToTOS && !agreeToTOS.checked) {
    agreeToTOS.click();
}

await new Promise(resolve => setTimeout(resolve, 1000));

const continueButton3 = document.querySelector('div.css-1le8uha');
if (continueButton3) {
    continueButton3.click();
}

await new Promise(resolve => setTimeout(resolve, 10000));
// debugger;

if (document.querySelector('h1').textContent === 'Payment Methods') {
    await handlePaymentPage();
}
}
`;
