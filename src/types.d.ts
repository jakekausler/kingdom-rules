export interface TableColumn {
    content: string;
    lowercaseContent?: string;
    align: 'left' | 'center' | 'right';
}

export interface TableData {
    type: 'table';
    id?: string;
    columns: TableColumn[];
    data: string[][];
    lowercaseData?: string[][];
}

export interface HeadingData {
    type: 'heading';
    id?: string;
    heading: string;
    lowercaseHeading?: string;
    level: number;
    content: ParsedElement[];
}

export interface ItemData {
    type: 'item';
    id?: string;
    heading: string;
    lowercaseHeading?: string;
    subheading: string;
    lowercaseSubheading?: string;
    content: ParsedElement[];
}

export interface ParagraphData {
    type: 'paragraph';
    id?: string;
    content: string;
    lowercaseContent?: string;
}

export interface ListData {
    type: 'list';
    content: string[];
    lowercaseContent?: string[];
}

export interface HorizontalRule {
    type: 'hr';
}

export interface TraitsData {
    type: 'traits';
    content: string[];
    lowercaseContent?: string[];
}

export type ParsedElement = HeadingData | ItemData | TableData | ParagraphData | ListData | HorizontalRule | TraitsData;

export type SearchResult = {
    page: string;
    id: string;
    type: string,
    element: ParsedElement;
    lastElementWithId: ParsedElement | undefined;
};