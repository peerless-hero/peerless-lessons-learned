/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare module 'preline/plugin';

declare module 'astro-pagefind/components/Search.astro' {
  export interface Props {
    instance?: string
    className?: string
    searchboxOptions?: Record<string, unknown>
    configOptions?: Record<string, unknown>
  }
  const Search: import('astro').AstroComponentFactory
  export default Search
}
