export const handlePaymentPage= `async function handlePaymentPage(email) {
    //  get div with class css-1lissxk
    const amountDiv = document.querySelector('div.css-1lissxk');
    // get contents of span inside paymentMethod
    let amountText = amountDiv.querySelector('span').textContent;
    // amountText looks like "₹1000", remove the first character and convert it to number
    let amount = parseInt(amountText.slice(1));

    // get payment info
    const paymentInfo = await getPaymentInfo('UPI', amount);

    //  get div with class css-1o6rzih
    const paymentDivs = document.querySelectorAll('div.css-1o6rzih');

    //  get the div with textContent as "UPI"
    let upiDiv = null;
    for (let i = 0; i < paymentDivs.length; i++) {
        if (paymentDivs[i].textContent === 'UPI') {
            upiDiv = paymentDivs[i];
            break;
        }
    }

    if (upiDiv) {
        upiDiv.click();
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // get div with id as "checkout-button"
    const checkoutButton = document.querySelector('div[id="checkout-button"]');

    //  get input with name as "ptm-upi-input"
    const upiInput = document.querySelector('input[id="ptm-upi-input"]');
    if (upiInput && upiInput.value === '') {
        await fillField(upiInput, paymentInfo.method_info_column_1);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // get button with classes ptm-custom-btn ptm-hvr-pop ptm-nav-selectable
    const payButton = document.querySelector('button.ptm-custom-btn.ptm-hvr-pop.ptm-nav-selectable');

    if (payButton) {
        // dispact click event on the pay button
        payButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }

    // wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO : do a get request on /api/transaction/:email/:user_data_name/:payment_method_name/:amount, use while loop and check if the response is 200, if not, wait for 1 second and continue, add cnt also

    // read from storage and get user_name
    const user_name = await readFromStorage('user_name');

    let transactionData = null;
    let cnt = 0;
    const callString = API_ENDPOINT + '/api/transaction/' + email + '/' + user_name + '/UPI/' + amount;
    while (true) {
        try {
            const response = await fetch(callString);
            transactionData = await response.json();
            // log response code
            console.log('Response code: ', response.status);
            if (response.status !== 200) {
                console.log('Response: ', transactionData);
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            console.log('Data: ', transactionData);
        }
        catch (error) {
            console.log('Error in fetch : ', callString + ' -- ', error);
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

}`;