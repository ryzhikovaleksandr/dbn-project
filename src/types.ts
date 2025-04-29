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

export enum CommandType {
    PEN = 'PEN',
    PAPER = 'PAPER',
    COLOR = 'COLOR',
    LINE = 'LINE',
    RECT = 'RECT',
    CIRCLE = 'CIRCLE',
    FILL_RECT = 'FILL_RECT',
    FILL_CIRCLE = 'FILL_CIRCLE',
    VARIABLE = 'VARIABLE',
    REPEAT = 'REPEAT',
    COMMENT = 'COMMENT',
}

export interface Command {
    type: CommandType;
    args: number[];
    variables?: { [key: string]: number };
    body?: Command[];
}

export type Program = Command[];