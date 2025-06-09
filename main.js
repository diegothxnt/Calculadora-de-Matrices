
let currentSize = 2;
let matrixA = [];
let matrixB = [];


const sizeSelect = document.getElementById('matrix-size');
const matrixAElement = document.getElementById('matrixA');
const matrixBElement = document.getElementById('matrixB');
const resultOutput = document.getElementById('result-output');


document.addEventListener('DOMContentLoaded', () => {
    generateMatrices();
    document.getElementById('generate-matrices').addEventListener('click', () => generateMatrices(false));
    document.getElementById('random-matrices').addEventListener('click', () => generateMatrices(true));
    document.getElementById('load-example').addEventListener('click', loadExample);
    document.getElementById('clear-matrices').addEventListener('click', () => generateMatrices(false));
});