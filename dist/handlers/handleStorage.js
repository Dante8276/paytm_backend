"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToStorage = exports.readFromStorage = void 0;
exports.readFromStorage = `
async function readFromStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'retrieve', key }, (response) => {
            if (response.status === 'success') {
                resolve(response.data);
            } else {
                resolve(null);
            }
        });
    });
}
`;
exports.writeToStorage = `
/**
 * Function to write data to storage.
 * @param {string} key - The key to store the data.
 * @param {string} value - The value to store.
 */
async function writeToStorage(key, value) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'store', key, value }, (response) => {
            if (response.status === 'success') {
                resolve();
            } else {
                resolve();
            }
        });
    });
}
`;
