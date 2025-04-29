import { Token, TokenType } from './types';

export class Lexer {
    private input: string;
    private position: number = 0;
    private line: number = 1;
    private column: number = 0;

    construtor(input: string) {
        this.input = input;
    }

    tokenize(): Token[] {
        const tokens: Token[] = [];

        while (this.position < this.input.length) {
            const char = this.input[this.position];

            // Processing comments
            if (char === '/' && this.input[this.position + 1] === '/') {
                const commentToken = this.readComment();
                tokens.push(commentToken);
                continue;
            }

            // Skip spaces and tabs
            if (/\s/.test(char)) {
                this.skipWhitespace();
                continue;
            }

            // Read digits
            if (/[0-9]/.test(char)) {
                const numberToken = this.readNumber();
                tokens.push(numberToken);
                continue;
            }

            // Reading identifiers and commands
            if (/[a-zA-Z_]/.test(char)) {
                const identifierToken = this.readIdentifier();
                tokens.push(identifierToken);
                continue;
            }

            // Operators processing
            if (['+', '-', '*', '/', '=', '(', ')', '{', '}'].includes(char)) {
                tokens.push({
                    type: TokenType.OPERATOR,
                    value: char,
                    line: this.line,
                    column: this.column
                });
                this.advance()
                continue;
            }

            // If the symbol is not recognized, skip it
            this.advance();
        }

        return tokens;
    }

    private readComment(): Token {
        const startColumn = this.column;
        let comment = '';

        // Skip //
        this.advance();
        this.advance();

        // Read the comment to the end of the line
        while (this.position < this.input.length && this.input[this.position] !== '\n') {
            comment += this.input[this.position];
            this.advance();
        }

        return {
            type: TokenType.COMMENT,
            value: comment.trim(),
            line: this.line,
            column: startColumn
        };
    }

    private readNumber(): Token {
        const startColumn = this.column;
        let number = '';

        while (this.position < this.input.length && /[0-9.]/.test(this.input[this.position])) {
            number += this.input[this.position];
            this.advance();
        }

        return {
            type: TokenType.NUMBER,
            value: number,
            line: this.line,
            column: startColumn
        };
    }

    private readIdentifier(): Token {
        const startColumn = this.column;
        let identifier = '';

        while (this.position < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.position])) {
            identifier += this.input[this.position];
            this.advance();
        }

        // Check if the identifier is a command
        const commands = ['pen', 'paper', 'color', 'line', 'rect', 'circle', 'repeat', 'set'];

        return {
            type: commands.includes(identifier.toLocaleLowerCase()) ? TokenType.COMMAND : TokenType.IDENTIFIER,
            value: identifier,
            line: this.line,
            column: startColumn
        };
    }

    private skipWhitespace(): void {
        while (this.position < this.input.length && /\s/.test(this.input[this.position])) {
            // If line break, increment line counter
            if (this.input[this.position] === '\n') {
                this.line++;
                this.column = 0;
            }
            this.advance();
        }
    }

    private advance(): void {
        this.position++;
        this.column++;
    }
}