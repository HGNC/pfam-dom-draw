import inject from '@rollup/plugin-inject';
export default {
  plugins: [
      // Add it first
      inject({
          $: 'jquery',
          jQuery: 'jquery',
          Raphael: 'raphael'
      }),
      // Other plugins...
  ],
  // The rest of your configuration...
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
            return `${extType}/pfam-dom-draw-[hash][extname]`;
          } else {
            return `${extType}/pfam-dom-draw.min[extname]`;
          }
        },
        chunkFileNames: 'js/pfam-dom-draw.min.js',
        entryFileNames: 'js/pfam-dom-draw.min.js',
      },
    },
  }
};