import { Canvas } from './canvas';
import { Command, CommandType, Program } from './types';

export class Interpreter {
    private canvas: Canvas;
    private variables: { [key: string]: number } = {};

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    execute(program: Program): void {
        for (const command of program) {
            this.executeCommand(command);
        }
    }

    private executeCommand(command: Command): void {
        switch (command.type) {
            case CommandType.PEN:
                this.canvas.setPenSize(command.args[0]);
                break;
            
            case CommandType.PAPER:
                this.canvas.setPaper(command.args[0]);
                break;

            case CommandType.COLOR:
                this.canvas.setColor(command.args[0]);
                break;
            
            case CommandType.LINE:
                this.canvas.drawLine(
                    command.args[0], 
                    command.args[1], 
                    command.args[2], 
                    command.args[3]
                );
                break;
            
            case CommandType.RECT:
                this.canvas.drawRect(
                    command.args[0], 
                    command.args[1], 
                    command.args[2], 
                    command.args[3]
                );
                break;

            case CommandType.CIRCLE:
                this.canvas.drawCircle(
                    command.args[0], 
                    command.args[1], 
                    command.args[2]
                );
                break;
            
            case CommandType.FILL_RECT:
                this.canvas.fillRect(
                    command.args[0], 
                    command.args[1], 
                    command.args[2], 
                    command.args[3]
                );
                break;
            
            case CommandType.FILL_CIRCLE:
                this.canvas.fillCircle(
                    command.args[0], 
                    command.args[1], 
                    command.args[2]
                );
                break;
            
            case CommandType.VARIABLE:
                if (command.variables) {
                    Object.assign(this.variables, command.variables);
                }
                break;
            
            case CommandType.REPEAT:
                if (command.body) {
                    const count = Math.floor(command.args[0]);
                    for (let i = 0; i < count; i++) {
                        for (const cmd of command.body) {
                            this.executeCommand(cmd);
                        }
                    }
                }
                break;
            
            case CommandType.COMMENT:
                // Ignore comments
                break;

            default:
                console.warn(`Unknown command type: ${command.type}`);
                break;
        }
    }
}