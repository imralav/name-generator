export interface NameGeneratorOptions {
    readonly pattern?: string,
    readonly patterns?: Array<string>,
    readonly files?: {[propName: string]: any},
    [propName: string]: any
}