declare module '@thebeyondgroup/shopify-rich-text-renderer' {
  /** Shopify rich text schema */
  export interface Schema {
    type: string
    children?: Schema[]
    level?: number
    listType?: 'ordered' | 'unordered'
    url?: string
    title?: string
    target?: string
    bold?: boolean
    italic?: boolean
    value?: string
  }

  /** Optional options for rendering Shopify rich text to HTML */
  export interface Options {
    /** allows for the rich text HTML to be easily styled */
    scoped?: boolean | string
    /** convert new line character to <br/> */
    newLineToBreak?: boolean
    classes?: {
      /** paragraph classes */
      p?: string
      /** heading1 classes */
      h1?: string
      /** heading2 classes */
      h2?: string
      /** heading3 classes */
      h3?: string
      /** heading4 classes */
      h4?: string
      /** heading5 classes */
      h5?: string
      /** heading6 classes */
      h6?: string
      /** order list classes */
      ol?: string
      /** unordered list classes */
      ul?: string
      /** list item classes */
      li?: string
      /** anchor/link classes */
      a?: string
      /** bold/strong classes */
      strong?: string
      /** italic/em classes */
      em?: string
    }
  }

  /** Converts Shopify rich text to HTML */
  export function convertSchemaToHtml(schema: string | Schema | Schema[], options?: Options | string | boolean): string
}
