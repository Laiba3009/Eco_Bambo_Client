declare module '@glidejs/glide' {
  export interface GlideOptions {
    type?: string;
    startAt?: number;
    perView?: number;
    focusAt?: number | 'center';
    gap?: number;
    autoplay?: number | boolean;
    animationDuration?: number;
    breakpoints?: Record<number, Partial<GlideOptions>>;
    [key: string]: any;
  }

  class Glide {
    settings: any;
    constructor(selector: string | HTMLElement | null, options?: GlideOptions);
    mount(): this;
    destroy(): this;
    on(event: string, handler: (args?: any) => void): this;
    go(pattern: string | number): this;
    update(options: Partial<GlideOptions>): this;
    readonly index: number;
  }

  export default Glide;
}

