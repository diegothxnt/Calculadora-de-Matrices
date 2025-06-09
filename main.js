
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
function generateMatrices(random = false) {
    currentSize = parseInt(sizeSelect.value);
    if(random) {
        matrixA = createRandomMatrix(currentSize);
        matrixB = createRandomMatrix(currentSize);
    } else {
        matrixA = createEmptyMatrix(currentSize);
        matrixB = createEmptyMatrix(currentSize);
    }
    renderMatrix(matrixA, matrixAElement, 'A');
    renderMatrix(matrixB, matrixBElement, 'B');
    clearResult();
}

function createEmptyMatrix(size) {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

function createRandomMatrix(size) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => Math.floor(Math.random() * 21) - 10));
}

function renderMatrix(matrix, container, prefix) {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
    matrix.forEach((row, i) => {
        row.forEach((val, j) => {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.value = val;
            input.dataset.row = i;
            input.dataset.col = j;
            input.dataset.matrix = prefix;
            input.addEventListener('change', updateMatrix);
            container.appendChild(input);
        });
    });
}
