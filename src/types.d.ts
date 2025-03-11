export interface TableColumn {
    content: string;
    align: 'left' | 'center' | 'right';
}

export interface TableData {
    type: 'table';
    columns: TableColumn[];
    data: string[][];
}

export interface HeadingData {
    type: 'heading';
    heading: string;
    level: number;
    content: ParsedElement[];
}

export interface ItemData {
    type: 'item';
    heading: string;
    subheading: string;
    content: ParsedElement[];
}

export interface ParagraphData {
    type: 'paragraph';
    content: string;
}

export interface ListData {
    type: 'list';
    content: string[];
}

export interface HorizontalRule {
    type: 'hr';
}

export interface TraitsData {
    type: 'traits';
    content: string[];
}

export type ParsedElement = HeadingData | ItemData | TableData | ParagraphData | ListData | HorizontalRule | TraitsData;


