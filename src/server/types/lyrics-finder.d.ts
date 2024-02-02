declare module 'lyrics-finder' {
    function main(artist: string, song: string): Promise<string>;
    export = main;
  }