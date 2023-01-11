import * as $ from '../jquery/dist/jquery.min.js';

(function () {
  $.browser.msie = false;
  $.browser.version = 0;
  if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
    $.browser.msie = true;
    $.browser.version = RegExp.$1;
  }
})();

function getRGBComponents(color) {
    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);
    return {
       R: parseInt(r, 16),
       G: parseInt(g, 16),
       B: parseInt(b, 16)
    };
}

import * as Raphael from '../raphael/raphael.min.js'
import '../malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js';
import '../jquery.raphael.spinner/jquery.raphael.spinner.js';
import '../qTip/jquery.qtip.min.js';

export default class PfamDomDraw {
  constructor (gene, uniprot, settings){
    this.gene = gene;
    this.uniprot = uniprot;
    this.settings = (typeof settings === 'undefined') ? {} : settings;
    this.settings.spinnerColor = this.settings.spinnerColor ? this.settings.spinnerColor : '#000';

    this.bVersion = 999; // we assume a sane browser
    if (navigator.appVersion.indexOf("MSIE") != -1){
      // bah, IE again, lets downgrade version number
      this.bVersion = parseFloat(navigator.appVersion.split("MSIE")[1]);
    }
    this._document = document;
  }

  _getRGBComponents(color) {
    const r = color.substring(1, 3);
    const g = color.substring(3, 5);
    const b = color.substring(5, 7);
    return {
       R: parseInt(r, 16),
       G: parseInt(g, 16),
       B: parseInt(b, 16)
    };
  }

  _idealTextColor(bgColor){
    const nThreshold = 146; // 105 was the original
    const components = this._getRGBComponents(bgColor);
    const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
  }

  _create_dom(paper, region, id, scale, metadata, domColor){
    const start  = parseInt((parseInt(region.start)/parseInt(scale)) + 9);
    const end    = parseInt((parseInt(region.end)/parseInt(scale)) + 9);
    const length = end - start;
    const dom = paper.rect(
      start,  //start position X
      10.5,    //start position Y constant
      length, //length
      20,     //width constant
      10      //radius of curve constant
    ).attr({
      fill:   `90-#ffffff-${domColor}:50-#ffffff`,
      stroke: domColor,//'none',
      cursor: 'pointer'
    });
    const text_len = metadata.name.length * 9;
    if(length > text_len + 2){
      const textstart = parseInt((length/2) + start);
      const textcol = this._idealTextColor(domColor);
      const text = paper.text(textstart, 20, metadata.name).attr({
        'fill': textcol,
        'font-size': 10,
        'cursor': 'pointer'
      });
      text.node.id = `${id}text`;
      $(`#${id}text`).qtip({
        content: `<strong>${metadata.name}</strong>: [Pfam:${metadata.accession}]`,
        style: {
          width: 200,
          padding: 5,
          background: '#F1F5F8',
          color: '#003366',
          textAlign: 'center',
          border: {
              width: 1,
              radius: 3,
              color: '#003366'
          },
          tip: 'bottomMiddle',
        },
        position: {
            target: 'mouse',
              corner: {
                tooltip: 'bottomMiddle'
              }
        }
      });
      $(`#${id}text`).click(() => {
        document.location.href=`https://www.ebi.ac.uk/interpro/entry/pfam/${metadata.accession}/`;
      });
    }
    dom.node.setAttribute('id', id);
    $(`#${id}`).qtip({
      content: `<strong>${metadata.name}</strong>: [Pfam:${metadata.accession}]`,
      style: {
        width: 200,
        padding: 5,
        background: '#F1F5F8',
        color: '#003366',
        textAlign: 'center',
        border: {
            width: 1,
            radius: 3,
            color: '#003366'
        },
        tip: 'bottomMiddle',
      },
      position: {
        target: 'mouse',
          corner: {
            tooltip: 'bottomMiddle'
          }
      }
    });
    $(`#${id}`).click(function(){
      document.location.href=`https://www.ebi.ac.uk/interpro/entry/pfam/${metadata.accession}/`;
    });
    return dom;
  }

  _create_paper(drawID, length, scale){
    //id, length, scale, up, gene
    const scaled_length = parseInt(parseInt(length)/parseInt(scale));
    const paperlength = parseInt(scaled_length) + 20;
    const paper = Raphael(drawID, paperlength, 43);
    paper.setViewBox(0,0,paperlength,43);
    paper.canvas.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    
    //line is constant
    const line = paper.rect(10, 18, parseInt(scaled_length), 5, 2.5).attr({
      fill:   'grey',
      stroke: 'none'
    });
    if(this.gene){
      const geneSize = (this.gene.length + 8) * 3;
      const geneText = paper.text(geneSize, 2, `Gene: ${this.gene},`).attr({
        'fill': '#000',
        'font-size': 10,
        'cursor': 'pointer'
      });
      
      geneText.node.setAttribute("class",`${this.gene}-text`);
      $(`.${this.gene}-text`).click(() => {
        this._document.location.href= `https://www.genenames.org/data/gene-symbol-report/#!/symbol/${this.gene}`;
      });

      const upSize = (this.uniprot.length + 5) * 3;
      const upText = paper.text(upSize + (geneSize *2), 2, `UniProt: ${this.uniprot}`).attr({
        'fill': '#000',
        'font-size': 10,
        'cursor': 'pointer'
      });
      upText.node.id = `${this.uniprot}-text`;
      $(`#${this.uniprot}-text`).click(() => {
        this._document.location.href=`http://www.uniprot.org/uniprot/${this.uniprot}`;
      });
    } else {
      const upSize = (this.uniprot.length + 8) * 3;
      const upText = paper.text(upSize, 2, `UniProt: ${this.uniprot}`).attr({
        'fill': '#000',
        'font-size': 10,
        'cursor': 'pointer'
      });
      upText.node.id = `${this.uniprot}-text`;
      $(`#${this.uniprot}-text`).click(() => {
        this._document.location.href=`http://www.uniprot.org/uniprot/${this.uniprot}`;
      });
    }
    paper.text(parseInt(scaled_length) - 25, 36, `${length} amino acids`).attr({
      'fill': '#000',
      'font-size': 10
    });
    line.node.id = 'line';
    return paper;
  }

  _draw_protein(index, container){
    //settings, container, i, up, gene
    const drawID = `draw${index}`;
    $('<div>').attr({id: drawID}).css({overflow: 'auto', 'max-width': '1108px'}).appendTo($(container));
    $('<div>').attr({id: `spinner${index}`}).css({margin: '0 auto', width: '10%'}).appendTo($(`#${drawID}`));
    $(`#spinner${index}`).spinner({dashes: 120, innerRadius: 10, outerRadius: 15, color: this.settings.spinnerColor});
    const jqxhr = $.getJSON(`/cgi-bin/protein/pfam-domains?up=${this.uniprot}`, (data) => {
      let tot_len;
      let paper;
      const color = [
        '#C0392B',
        '#9B59B6',
        '#2980B9',
        '#1ABC9C',
        '#27AE60',
        '#F1C40F',
        '#E67E22',
        '#95A5A6',
        '#34495E',
        '#E74C3C',
        '#8E44AD',
        '#3498DB',
        '#16A085',
        '#2ECC71',
        '#F39C12',
        '#D35400',
        '#BDC3C7',
        '#7F8C8D',
        '#707B7C',
        '#273746'
      ];
      $.each(data.results, (index, result) => {
        $.each(result.proteins, (i, prot) => {
          let length = parseInt(prot.protein_length);
          let scale = 1;
          if(length > 896){
            if(length/896 >= 1.5) scale = 2;
          }
          if(index === 0) {
            paper = this._create_paper(drawID, length, scale);
          }
          $.each(prot.entry_protein_locations, (j, dom_loc) => {
            $.each(dom_loc.fragments, (k, frag) => {
              this._create_dom(paper, frag, `dom${index}-${j}`, scale, result.metadata, color[index]);
            });
          });
          length = parseInt(length/scale);
          tot_len = length+20;
          $(`div#${drawID} svg`).attr('width', tot_len);
          $(`div#${drawID} svg`).attr('height', 48);
          const marg = (tot_len /2) * -1;
          $(`div#${drawID} svg`).css({left: '50%', 'margin-left': marg});
          $(`#spinner${index}`).remove();
        });
      });

      $(`#${drawID}`).mCustomScrollbar({
        axis:'x',
        theme:'3d-thick-dark',
        scrollInertia: 0
      });

      $('.mCSB_container').css({width: `${tot_len}px`})

    }).fail(( jqxhr, textStatus, error ) => {
      const err = `${textStatus}, ${error}`;
      console.warn( `Pfam request Failed: ${err}` );
      $(`#spinner${index}`).remove();
      $(`#${drawID}`).append('<p style="text-align:center; color: red; font-family:monospace">Error fetching Pfam data</p>');
    });

    $(`#${drawID}`).css({
      height: '70px'
    });
  }

  pfam_doms(){
    if (this.bVersion > 7) {
      $('.pfamDomDrawContainer').each((index, container) => {
        this._draw_protein(index, container);
      });
    }
  }
}
// $.browser = {};
// (function () {
//   $.browser.msie = false;
//   $.browser.version = 0;
//   if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
//     $.browser.msie = true;
//     $.browser.version = RegExp.$1;
//   }
// })();

// function getRGBComponents(color) {
//     var r = color.substring(1, 3);
//     var g = color.substring(3, 5);
//     var b = color.substring(5, 7);
//     return {
//        R: parseInt(r, 16),
//        G: parseInt(g, 16),
//        B: parseInt(b, 16)
//     };
// }

// function idealTextColor(bgColor) {
//    var nThreshold = 146; // 105 was the original
//    var components = getRGBComponents(bgColor);
//    var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
//    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
// }

// function create_paper(id, length, scale, up, gene){
//   var scaled_length = parseInt(parseInt(length)/parseInt(scale));
//   paperlength = parseInt(scaled_length) + 20;
//   var paper = Raphael(id, paperlength, 43);
//   paper.setViewBox(0,0,paperlength,43);
//   paper.canvas.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  
//   //line is constant
//   var line = paper.rect(10, 18, parseInt(scaled_length), 5, 2.5).attr({
//     fill:   'grey',
//     stroke: 'none'
//   });
//   if(gene){
//     var geneSize = (gene.length + 8) * 3;
//     var geneText = paper.text(geneSize, 2, 'Gene: '+gene+',').attr({
//       'fill': '#000',
//       'font-size': 10,
//       'cursor': 'pointer'
//     });
    
//     geneText.node.setAttribute("class",gene+"-text");
//     $('.'+gene+"-text").click(function(){
//       document.location.href='https://www.genenames.org/data/gene-symbol-report/#!/symbol/'+gene;
//     });

//     var upSize = (up.length + 5) * 3;
//     var upText = paper.text(upSize + (geneSize *2), 2, 'UniProt: '+up).attr({
//       'fill': '#000',
//       'font-size': 10,
//       'cursor': 'pointer'
//     });
//     upText.node.id = up+"-text";
//     $('#'+up+"-text").click(function(){
//       document.location.href='http://www.uniprot.org/uniprot/'+up;
//     });
//   } else {
//     var upSize = (up.length + 8) * 3;
//     var upText = paper.text(upSize, 2, 'UniProt: '+up).attr({
//       'fill': '#000',
//       'font-size': 10,
//       'cursor': 'pointer'
//     });
//     upText.node.id = up+"-text";
//     $('#'+up+"-text").click(function(){
//       document.location.href='http://www.uniprot.org/uniprot/'+up;
//     });
//   }
//   paper.text(parseInt(scaled_length) - 25, 36, length + ' amino acids').attr({
//     'fill': '#000',
//     'font-size': 10
//   });
//   line.node.id = 'line';
//   return paper;
// }

// function create_dom(paper, region, id, scale){
//   var start  = parseInt((parseInt(region.start)/parseInt(scale)) + 9);
//   var end    = parseInt((parseInt(region.end)/parseInt(scale)) + 9);
//   var length = end - start;
//   var dom = paper.rect(
//     start,  //start position X
//     10.5,    //start position Y constant
//     length, //length
//     20,     //width constant
//     10      //radius of curve constant
//   ).attr({
//     fill:   '90-#ffffff-'+region.colour+':50-#ffffff',
//     stroke: region.colour,//'none',
//     cursor: 'pointer'
//   });
//   var text_len = region.text.length * 9;
//   if(length > text_len + 2){
//     var textstart = parseInt((length/2) + start);
//     var textcol = idealTextColor(region.colour);
//     var text = paper.text(textstart, 20, region.text).attr({
//       'fill': textcol,
//       'font-size': 10,
//       'cursor': 'pointer'
//     });
//     text.node.id = id+'text';
//     $('#'+id+'text' ).qtip({
//        content: '<strong>'+region.text + '</strong>: ' + region.metadata.description + ' [Pfam:' + region.metadata.accession + ']',
//        style: {
//          width: 200,
//          padding: 5,
//          background: '#F1F5F8',
//          color: '#003366',
//          textAlign: 'center',
//          border: {
//             width: 1,
//             radius: 3,
//             color: '#003366'
//          },
//          tip: 'bottomMiddle',
//        },
//        position: {
//           target: 'mouse',
//             corner: {
//                tooltip: 'bottomMiddle'
//             }
//        }
//     });
//     $('#'+id+'text').click(function(){
//       document.location.href='https://www.ebi.ac.uk/interpro/entry/pfam/'+region.href;
//     });
//   }
//   dom.node.setAttribute('id',id);
//   $('#'+id).qtip({
//      content: '<strong>'+region.text + '</strong>: ' + region.metadata.description + ' [Pfam:' + region.metadata.accession + ']',
//      style: {
//        width: 200,
//        padding: 5,
//        background: '#F1F5F8',
//        color: '#003366',
//        textAlign: 'center',
//        border: {
//           width: 1,
//           radius: 3,
//           color: '#003366'
//        },
//        tip: 'bottomMiddle',
//      },
//      position: {
//        target: 'mouse',
//         corner: {
//            tooltip: 'bottomMiddle'
//         }
//      }
//   });
//   $('#'+id).click(function(){
//     document.location.href='https://www.ebi.ac.uk/interpro/entry/pfam/'+region.href;
//   });
//   return dom;
// }



// function draw_protein(settings, container, i, up, gene){
//   var drawID = 'draw'+i;
//   $('<div>').attr({id: drawID}).css({overflow: 'auto'}).appendTo($(container));
//   $('<div>').attr({id: 'spinner'+i}).css({margin: '0 auto', width: '10%'}).appendTo($('#'+drawID));
//   $("#spinner"+i).spinner({dashes: 120, innerRadius: 10, outerRadius: 15, color: settings.spinnerColor});
//   var jqxhr = $.getJSON('https://www.genenames.org/cgi-bin/protein/pfam-domains?up='+up, function(data) {
//     var tot_len;
//     $.each(data, function(index, prot) {
//       var length = parseInt(prot.length);
//       var scale = 1;
//       if(length > 896){
//         if(length/896 >= 1.5) scale = 2;
//       }

//       var paper = create_paper(drawID, length, scale, up, gene);
//       var regions = prot.regions;
//       for (var domI in regions) {
//         create_dom(paper, regions[domI], 'dom'+i+'-'+domI, scale);
//       }
//       length = parseInt(length/scale);
//       tot_len = length+20;
//       $('div#'+drawID+' svg').attr('width', tot_len);
//       $('div#'+drawID+' svg').attr('height', 48);

//       if(tot_len < 930){
//         $('#'+drawID).css({width: tot_len, height: 58});
//       }
//       $("#spinner"+i).remove();
//     });

//     if(tot_len < 930){
//       $('#'+drawID).css('overflow', 'hidden');
//     }

//   }).fail(function( jqxhr, textStatus, error ) {
//     var err = textStatus + ", " + error;
//     console.warn( "Pfam request Failed: " + err );
//     $("#spinner"+i).remove();
//     $('#'+drawID).append('<p style="text-align:center; color: red; font-family:monospace">Error fetching Pfam data</p>');
//   });

//   $('#'+drawID).css({
//     height: '60px'
//   });
// }

// function checkSettings(settings){
//   var settings = (typeof settings === 'undefined') ? {} : settings;
//   settings.spinnerColor = settings.spinnerColor ? settings.spinnerColor : '#000';
//   return settings;
// }

// function pfam_doms(settings){
//   settings = checkSettings(settings);
//   var IE = {
//     Version: function() {
//       var version = 999; // we assume a sane browser
//       if (navigator.appVersion.indexOf("MSIE") != -1){
//         // bah, IE again, lets downgrade version number
//         version = parseFloat(navigator.appVersion.split("MSIE")[1]);
//       }
//       return version;
//     }
//   };
//   if (IE.Version() > 7) {
//     $('.pfamDomDrawContainer').each(function(index, container) {
//       var uniprot = $(container).attr('data-uniprot');
//       var gene = $(container).attr('data-gene');
//       $(container).toggleClass('nodia dia');
//       draw_protein(settings, container, index, uniprot, gene);
//     });
//   }
//   else{
//     $('#drawContainer').remove();
//     console.warn("Code does not support IE < 8");
//   }
// }