import { Lexer } from './lexer';
import { Command, CommandType, Program, Token, TokenType } from './types';

export class Parser {
    private tokens: Token[] = [];
    private position: number = 0;

    parse(input: string): Program {
        const lexer = new Lexer(input);
        this.tokens = lexer.tokenize().filter(token => 
            token.type !== TokenType.WHITESPACE && token.type !== TokenType.COMMENT
        );
        this.position = 0;

        return this.parseProgram();
    }

    private parseProgram(): Program {
        const program: Program = [];

        while (this.position < this.tokens.length) {
            const command = this.parseCommand();
            if (command) {
                program.push(command);
            }
        }

        return program;
    }

    private parseCommand(): Command | null {
        const token = this.tokens[this.position];
        
        if (!token) return null;
        
        if (token.type === TokenType.COMMAND) {
            const commandName = token.value.toLocaleLowerCase();
            this.position++; // Move to the command arguments

            switch (commandName) {
                case 'pen':
                    return {
                        type: CommandType.PEN,
                        args: [this.parseNumber()]
                    };
                
                case 'paper':
                    return {
                        type: CommandType.PAPER,
                        args: [this.parseNumber()]
                    };
                
                case 'color':
                    return {
                        type: CommandType.COLOR,
                        args: [this.parseNumber()]
                    };
                
                case 'line':
                    return {
                        type: CommandType.LINE,
                        args: [
                            this.parseNumber(), 
                            this.parseNumber(), 
                            this.parseNumber(), 
                            this.parseNumber()
                        ]
                    };
                
                case 'rect':
                    return {
                        type: CommandType.RECT,
                        args: [
                            this.parseNumber(), 
                            this.parseNumber(), 
                            this.parseNumber(), 
                            this.parseNumber()
                        ]
                    };
                
                case 'circle':
                    return {
                        type: CommandType.CIRCLE,
                        args: [
                            this.parseNumber(), 
                            this.parseNumber(), 
                            this.parseNumber()
                        ]
                    };
                
                case 'set':
                    const variableName = this.parseIdentifier();
                    const value = this.parseNumber();
                    return {
                        type: CommandType.VARIABLE,
                        args: [value],
                        variables: { [variableName]: value }
                    };
                
                case 'repeat':
                    const count = this.parseNumber();
                    const body = this.parseRepeatBody();
                    return {
                        type: CommandType.REPEAT,
                        args: [count],
                        body
                    };
                
                default:
                    throw new Error(`Unknown command: ${commandName} on line ${token.line}, column ${token.column}`);
            }
        }

        this.position++; // Move to the next token
        return null;
    }

    private parseNumber(): number {
        const token = this.tokens[this.position];

        if (!token || token.type !== TokenType.NUMBER) {
            throw new Error(`Expected a number, but found ${token?.value} on line ${token?.line}, column ${token?.column}`);
        }
        
        this.position++;
        return parseFloat(token.value);
    }

    private parseIdentifier(): string {
        const token = this.tokens[this.position];

        if (!token || token.type !== TokenType.IDENTIFIER) {
            throw new Error(`Expected an identifier, but found ${token?.value} on line ${token?.line}, column ${token?.column}`);
        }
        
        this.position++;
        return token.value;
    }

    private parseRepeatBody(): Command[] {
        const body: Command[] = [];
        
        // Check for opening parenthesis
        if (this.tokens[this.position]?.type === TokenType.OPERATOR && 
            this.tokens[this.position]?.value === '{') {
          this.position++;
          
          while (
            this.position < this.tokens.length && 
            !(this.tokens[this.position].type === TokenType.OPERATOR && 
              this.tokens[this.position].value === '}')
          ) {
            const command = this.parseCommand();
            if (command) {
              body.push(command);
            }
          }
          
          // Check for closing bracket
          if (this.tokens[this.position]?.type === TokenType.OPERATOR && 
              this.tokens[this.position]?.value === '}') {
            this.position++;
          } else {
            throw new Error('Ожидалась закрывающая скобка }');
          }
        } else {
          // If there are no brackets, we assume that the body consists of one command
          const command = this.parseCommand();
          if (command) {
            body.push(command);
          }
        }
        
        return body;
      }
}