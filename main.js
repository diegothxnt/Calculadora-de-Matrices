
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
function loadExample() {
    currentSize = 3;
    sizeSelect.value = '3';
    matrixA = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    matrixB = [[9, 8, 7], [6, 5, 4], [3, 2, 1]];
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
function updateMatrix(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const value = parseFloat(e.target.value) || 0;
    const matrix = e.target.dataset.matrix === 'A' ? matrixA : matrixB;
    matrix[row][col] = value;
}

function getMatrixFromInputs(prefix) {
    const size = currentSize;
    const matrix = createEmptyMatrix(size);
    const inputs = document.querySelectorAll(`#matrix${prefix} .matrix-cell`);
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        matrix[row][col] = parseFloat(input.value) || 0;
    });
    return matrix;
}
function displayResult(result) {
    if (typeof result === 'number') {
        resultOutput.innerHTML = `<p>Resultado: <strong>${result.toFixed(4)}</strong></p>`;
        return;
    }
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix-grid';
    matrixDiv.style.gridTemplateColumns = `repeat(${result.length}, 1fr)`;
    result.forEach(row => {
        row.forEach(val => {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = val.toFixed(4);
            matrixDiv.appendChild(cell);
        });
    });
    resultOutput.innerHTML = '';
    resultOutput.appendChild(matrixDiv);
}

function displayMultipleMatrices(matrices, labels) {
    resultOutput.innerHTML = '';
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '30px';
    container.style.flexWrap = 'wrap';
    matrices.forEach((matrix, index) => {
        const matrixWrapper = document.createElement('div');
        const label = document.createElement('h4');
        label.textContent = labels[index];
        const grid = document.createElement('div');
        grid.className = 'matrix-grid';
        grid.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
        matrix.forEach(row => {
            row.forEach(val => {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = val.toFixed(4);
                grid.appendChild(cell);
            });
        });
        matrixWrapper.appendChild(label);
        matrixWrapper.appendChild(grid);
        container.appendChild(matrixWrapper);
    });
    resultOutput.appendChild(container);
}

function clearResult() {
    resultOutput.innerHTML = '';
}
function showError(message) {
    resultOutput.innerHTML = `<p class="error">${message}</p>`;
}
function performOperation(operation) {
    matrixA = getMatrixFromInputs('A');
    matrixB = getMatrixFromInputs('B');
    try {
        let result;
        switch (operation) {
            case 'sumar':
                result = addMatrices(matrixA, matrixB);
                displayResult(result);
                break;
            case 'restar':
                result = subtractMatrices(matrixA, matrixB);
                displayResult(result);
                break;
            case 'restarInversa':
                result = subtractMatrices(matrixB, matrixA);
                displayResult(result);
                break;
            case 'multiplicar':
                result = multiplyMatrices(matrixA, matrixB);
                displayResult(result);
                break;
            case 'escalar':
                showScalarInput();
                break;
            case 'transpuesta':
                const original = matrixA;
                const transpuesta = transposeMatrix(matrixA);
                displayMultipleMatrices([original, transpuesta], ['A', 'Aᵗ']);
                break;
            case 'determinante':
                const det = calculateDeterminant(matrixA);
                displayResult(det);
                break;
            case 'inversa':
                const inv = calculateInverse(matrixA);
                const identity = multiplyMatrices(matrixA, inv);
                displayMultipleMatrices([inv, identity], ['A⁻¹', 'A × A⁻¹']);
                break;
            case 'identidad':
                result = createIdentityMatrix(currentSize);
                displayResult(result);
                break;
            default:
                showError('Operación no reconocida');
        }
    } catch (error) {
        showError(error.message);
    }
}

function addMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Las matrices deben tener las mismas dimensiones');
    }
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function subtractMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Las matrices deben tener las mismas dimensiones');
    }
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function multiplyMatrices(a, b) {
    if (a[0].length !== b.length) {
        throw new Error('El número de columnas de A debe coincidir con filas de B');
    }
    const result = createEmptyMatrix(a.length);
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b[0].length; j++) {
            for (let k = 0; k < a[0].length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}
function scalarMultiply(matrix, scalar) {
    return matrix.map(row => row.map(val => val * scalar));
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function calculateDeterminant(matrix) {
    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
        const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
        det += matrix[0][i] * (i % 2 === 0 ? 1 : -1) * calculateDeterminant(minor);
    }
    return det;
}
function calculateInverse(matrix) {
    const det = calculateDeterminant(matrix);
    if (det === 0) throw new Error('La matriz no tiene inversa (determinante = 0)');
    const size = matrix.length;
    const adjugate = createEmptyMatrix(size);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const minor = matrix.filter((_, k) => k !== i).map(row => row.filter((_, k) => k !== j));
            const cofactor = ((i + j) % 2 === 0 ? 1 : -1) * calculateDeterminant(minor);
            adjugate[j][i] = cofactor;
        }
    }
    return scalarMultiply(adjugate, 1 / det);
}
function createIdentityMatrix(size) {
    return Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => i === j ? 1 : 0));
}

function showScalarInput() {
    resultOutput.innerHTML = `
        <div class="scalar-input">
            <input type="number" id="scalar-value" placeholder="Ingrese el escalar">
            <button onclick="applyScalar()">Aplicar</button>
            <button onclick="clearResult()">Cancelar</button>
        </div>
    `;
}

function applyScalar() {
    const scalar = parseFloat(document.getElementById('scalar-value').value);
    if (isNaN(scalar)) {
        showError('Por favor ingrese un valor numérico válido');
        return;
    }
    try {
        const result = scalarMultiply(matrixA, scalar);
        displayResult(result);
    } catch (error) {
        showError(error.message);
    }
}

