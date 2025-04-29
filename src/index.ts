import { Canvas } from './canvas';
import { Parser } from './parser';
import { Interpreter } from './interpreter';

window.onload = function() {
    const canvas = new Canvas('canvas', 400, 400);
    const parser = new Parser();
    const interpreter = new Interpreter(canvas);

    const codeInput = document.getElementById('code-input') as HTMLTextAreaElement;
    const runButton = document.getElementById('run-button') as HTMLButtonElement;

    runButton.addEventListener('click', () => {
        const code = codeInput.value;
        canvas.clear();
        const program = parser.parse(code);
        interpreter.execute(program);
    });
}
