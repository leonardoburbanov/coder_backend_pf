import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = "ACb5b3217f973c420b479af2a74be56b2e"
const TWILIO_AUTH_TOKEN = "0b94d133290779f9a8ff74e6e2116603"
const TWILIO_SMS_NUMBER = "+15418593342"
const TEST_NUMBER = "+593991085783"

const client = await twilio(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN);

const sendMessage = async(message) =>{
    let result = await client.messages.create({
        body: message,
        from: TWILIO_SMS_NUMBER,
        to: TEST_NUMBER
    })
    return result
}


export { sendMessage }