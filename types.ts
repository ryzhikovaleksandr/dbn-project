export enum TokenType {
    COMMAND = 'COMMAND',
    NUMBER = 'NUMBER',
    IDENTIFIER = 'IDENTIFIER',
    OPERATOR = 'OPERATOR',
    COMMENT = 'COMMENT',
    WHITESPACE = 'WHITESPACE',
}

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}