// PayPalButton.js
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PayPalButton = () => {
    const initiateTransfer = async (orderId, payerId) => {
        // Simulate transfer response (replace with actual API call)
        return new Promise((resolve, reject) => {
            // Simulate successful transfer
            setTimeout(() => {
                resolve({ success: true, message: 'Transfer successful' });
            }, 1000); // Simulate 1 second delay
        });
    };


    const createOrder = (data, actions) => {
        return actions.order.create({
        purchase_units: [{
            amount: {
            value: '2', // Replace with the price for the premium upgrade
            currency_code: 'USD'
            }
        }]
        });
    };
    
    const onApprove = async (data, actions) => {
        try {
            // Extract relevant information from the data object
            const orderId = data.orderID;
            const payerId = data.payerID;
            
            // Capture the payment and initiate the money transfer
            const captureResponse = await actions.order.capture();
            
            // Check if the capture was successful
            if (captureResponse.status === 'COMPLETED') {
                const transferResponse = await initiateTransfer(orderId, payerId);
                

                axios.post('http://127.0.0.1:8080/paypal/payment/capture', captureResponse, {withCredentials: true})
                .then(response => {
                    window.location.href = '/personal/profile'
                })
                .catch(error => {
                    console.error('Error capturing payment:', error);
                    toast.error("Something goes wrong, please try again")
                });
                
                // Update user's status or trigger workflows in your application
            } else {
                // Payment capture failed or status is not 'COMPLETED'
                console.error('Payment capture failed:', captureResponse);
                toast.error("Something goes wrong, please try again")
            }
        } catch (error) {
            // Handle errors during payment capture or money transfer
            console.error('Error during payment capture:', error);
            toast.error("Something goes wrong, please try again")
        }
    };

    const onError = (err) => {
        // Handle errors during payment process
        console.error('Payment error:', err);
        toast.error("Something goes wrong, please try again")
    };

    const onCancel = (data) => {
        // Handle cancellation of the payment process
        console.log('Payment cancelled:', data);
        toast.error("Something goes wrong, please try again")
    };
    
    return (
        <PayPalScriptProvider options={{ "client-id": "AfARXGhy5pQVvIf9tewEiRXNDZXQW8KhqC1BVL43euxM8XZkvY2fwP1JEu4Py1pJAOKdoKaDF38-JcRM", "locale": "en_US" }}>
            <PayPalButtons 
                style={{ layout: 'vertical' }} 
                createOrder={createOrder} 
                onApprove={onApprove} 
            />
        </PayPalScriptProvider>
    );
    };
export default PayPalButton;