export interface TableColumn {
    content: string;
    align: 'left' | 'center' | 'right';
}

export interface TableData {
    type: 'table';
    id?: string;
    columns: TableColumn[];
    data: string[][];
}

export interface HeadingData {
    type: 'heading';
    id?: string;
    heading: string;
    level: number;
    content: ParsedElement[];
}

export interface ItemData {
    type: 'item';
    id?: string;
    heading: string;
    subheading: string;
    content: ParsedElement[];
}

export interface ParagraphData {
    type: 'paragraph';
    id?: string;
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


