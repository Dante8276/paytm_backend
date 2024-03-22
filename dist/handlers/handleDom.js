"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillField = void 0;
exports.fillField = `
async function fillField(field, value) {
    field.focus();
    for (let char of value.split('')) {
        let keydownEvent = new KeyboardEvent('keydown', { key: char, bubbles: true });
        let keypressEvent = new KeyboardEvent('keypress', { key: char, bubbles: true });
        let inputEvent = new InputEvent('input', { data: char, bubbles: true });
        field.value += char;
        let keyupEvent = new KeyboardEvent('keyup', { key: char, bubbles: true });

        field.dispatchEvent(keydownEvent);
        field.dispatchEvent(keypressEvent);
        field.dispatchEvent(inputEvent);
        field.dispatchEvent(keyupEvent);

        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
`;
