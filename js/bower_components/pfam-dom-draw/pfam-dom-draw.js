export default class PfamDomDraw {
  constructor (settings){
    this.settings = (typeof settings === 'undefined') ? {} : settings;
    this.settings.spinnerColor = this.settings.spinnerColor ? this.settings.spinnerColor : '#000';
    this.settings.width = this.settings.width ? this.settings.width : 768;
    this.settings.scaleWidth = this.settings.width + (this.settings.width/2);

    this.bVersion = 999; // we assume a sane browser
    if (navigator.appVersion.indexOf("MSIE") != -1){
      // bah, IE again, lets downgrade version number
      this.bVersion = parseFloat(navigator.appVersion.split("MSIE")[1]);
    }
    this._document = document;
    this.domDict = {};
    this.settings.colors = this.settings.colors ? this.settings.colors : [
      '#FF0000', //Red
      '#008000', //Green
      '#00FFFF', //Cyan
      '#0000FF', //Blue
      '#FF00FF', //Magenta
      '#FFC0CB', //Pink
      '#808080', //Gray
      '#A52A2A', //Brown
      '#000000', //Black
      '#FFA500', //Orange
      '#8B0000', //Darkred
      '#F0E68C', //Khaki
      '#7FFF00', //Chartreuse
      '#008080', //Teal
      '#87CEEB', //Skyblue
      '#FF7F50', //Coral
      '#9400D3', //Darkviolet
      '#FF69B4', //Hotpink
      '#DCDCDC', //Gainsboro
      '#D2B48C', //Tan
      '#2F4F4F', //Darkslategray
      '#FA8072', //salmon
      '#FFDAB9', //Peachpuff
      '#808000', //Olive
      '#AFEEEE', //paleturquoise
      '#6495ED', //cornflowerblue
      '#4B0082', //Indigo
      '#C0C0C0', //silver
      '#CD853F', //peru
      '#FFD700', //Gold
      '#708090'  //slategray
    ];
    this.numDistinctDoms = 0;
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
      25.5,    //start position Y constant
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

      $(`#${id}text`).on('click', () => {
        document.location.href=`https://www.ebi.ac.uk/interpro/entry/pfam/${metadata.accession}/`;
      });
    }
    dom.node.setAttribute('id', id);
    $(`#${id}`).qtip({
      content: `<strong>${metadata.name}</strong>: [Pfam:${metadata.accession}]<br/>Click to view at InterPro`,
      style: {
        classes: ['qtip-bootstrap my-qtip']
      },
      position: {
        my: 'bottom center',
        at: 'top center',
        target: $(`#${id}`)
      }
    });
    $(`#${id}`).on('click', () => {
      document.location.href=`https://www.ebi.ac.uk/interpro/entry/pfam/${metadata.accession}/`;
    });
    return dom;
  }

  _create_paper(drawID, length, scale, gene, uniprot){
    //id, length, scale, up, gene
    const scaled_length = parseInt(parseInt(length)/parseInt(scale));
    const paperlength = parseInt(scaled_length) + 20;
    const paper = Raphael(drawID, paperlength, 80);
    paper.setViewBox(0,0,paperlength,80);
    
    paper.canvas.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    
    //line is constant
    const line = paper.rect(10, 34, parseInt(scaled_length), 5, 2.5).attr({
      fill:   'grey',
      stroke: 'none'
    });
    
    if(gene){
      const geneSize = (gene.length*5.5) + 45;
      const geneLabel = paper.text(20, 8, 'Gene: ').attr({
        'fill': '#000000',
        'font-size': 15,
        'cursor': 'default'
      });
      const geneText = paper.text(geneSize, 8, `${gene},`).attr({
        'fill': '#1e90ff',
        'font-size': 15,
        'cursor': 'pointer'
      });
      $(geneText.node).css('text-decoration', 'underline');
      $(geneText.node).on('click', () => {
        this._document.location.href=`https://www.genenames.org/data/gene-symbol-report/#!/symbol/${gene}`;
      });
      
      const upLabelSize = (gene.length*11)+75
      const upLabel = paper.text(upLabelSize, 8, 'UniProt: ').attr({
        'fill': '#000000',
        'font-size': 15,
        'cursor': 'default'
      });
      
      const upText = paper.text((uniprot.length*5.5) + upLabelSize + 26, 8, uniprot).attr({
        'fill': '#1e90ff',
        'font-size': 15,
        'cursor': 'pointer'
      });

      upText.node.id = `${uniprot}-text`;
      $(`#${uniprot}-text`).css('text-decoration', 'underline');
      $(`#${uniprot}-text`).on('click', () => {
        this._document.location.href=`http://www.uniprot.org/uniprot/${uniprot}`;
      });
    } else {
      const upLabelPos = 26
      const upLabel = paper.text(upLabelPos, 8, 'UniProt: ').attr({
        'fill': '#000000',
        'font-size': 15,
        'cursor': 'default'
      });
      
      const upText = paper.text((uniprot.length*5.5) + upLabelPos + 26, 8, uniprot).attr({
        'fill': '#1e90ff',
        'font-size': 15,
        'cursor': 'pointer'
      });
      upText.node.id = `${uniprot}-text`;
      $(`#${uniprot}-text`).css('text-decoration', 'underline');
      $(`#${uniprot}-text`).on('click', () => {
        this._document.location.href=`http://www.uniprot.org/uniprot/${uniprot}`;
      });
    }
    paper.text(parseInt(scaled_length) - 25, 60, `${length} amino acids`).attr({
      'fill': '#000',
      'font-size': 10
    });
    
    line.node.id = 'line';
    return paper;
  }

  _waitForFinalEvent(callback, ms, uniqueId){
    let timers = {};
    return  () => {
      if (!uniqueId) {
        uniqueId = "Don't call this twice without a uniqueId";
      }
      if (timers[uniqueId]) {
        clearTimeout (timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  }

  _draw_protein(proteinNum, container){
    this.uniprot = $(container).data('uniprot');
    this.gene = $(container).data('gene');
    const drawID = `draw${proteinNum}`;
    $('<div>').attr({id: drawID}).css({overflow: 'auto', 'max-width': `${this.settings.width}px`}).appendTo($(container));
    $('<div>').attr({id: `spinner${proteinNum}`}).css({margin: '0 auto', width: '10%'}).appendTo($(`#${drawID}`));
    $(`#spinner${proteinNum}`).spinner({dashes: 120, innerRadius: 10, outerRadius: 15, color: this.settings.spinnerColor});
    const jqxhr = $.getJSON(
      `https://www.genenames.org/cgi-bin/protein/pfam-domains?up=${this.uniprot}`,
      (function(self, uniprot, gene){
        return (data) => {
          let tot_len;
          let paper;
          $.each(data.results, (domTypeIndex, result) => {
            let domAccession = result.metadata.accession;

            if(!self.domDict[domAccession]){
              const colorIndex = self.numDistinctDoms % self.settings.colors.length;
              self.domDict[domAccession] = self.settings.colors[colorIndex];
              self.numDistinctDoms++;
            }
            $.each(result.proteins, (i, prot) => {
              let length = parseInt(prot.protein_length);
              let scale = 1;
              if(length/self.settings.scaleWidth >= 1.5) scale = 2;
              if(domTypeIndex === 0) {
                paper = self._create_paper(drawID, length, scale, gene, uniprot);
              }
              $.each(prot.entry_protein_locations, (j, dom_loc) => {
                $.each(dom_loc.fragments, (k, frag) => {
                  self._create_dom(paper, frag, `dom${proteinNum}-${domTypeIndex}-${j}`, scale, result.metadata, self.domDict[domAccession]);
                });
              });
              length = parseInt(length/scale);
              tot_len = length+20;
              $(`div#${drawID} svg`).attr('width', tot_len);
              $(`div#${drawID} svg`).attr('height', 90);
              const marg = (tot_len /2) * -1;
              if(tot_len <= jQuery(window).width() && tot_len <= self.settings.width){
                $(`div#${drawID} svg`).addClass('center-protein');
                $(`div#${drawID}`).parent().find('.scroll-notice').remove();
              } else {
                $(`div#${drawID} svg`).addClass('scroll-protein');
                if($(`div#${drawID}`).parent().find('.scroll-notice').length === 0){
                  $(`div#${drawID}`).after('<div class="scroll-notice"><img src="/img/arrow-left.svg"> scroll <img src="/img/arrow-right.svg"></div>');
                }
              }
              $(window).on('resize', self._waitForFinalEvent(() => {
                if(tot_len <= jQuery(window).width() && tot_len <= self.settings.width){
                  $(`div#${drawID} svg`).addClass('center-protein');
                  $(`div#${drawID}`).parent().find('.scroll-notice').remove();
                  
                } else {
                  $(`div#${drawID} svg`).addClass('scroll-protein');
                  if($(`div#${drawID} + .scroll-notice`).length === 0){
                    $(`div#${drawID}`).after('<div class="scroll-notice"><img src="/img/arrow-left.svg"> scroll <img src="/img/arrow-right.svg"></div>');
                  }
                }
              }, 500, "some unique string"));
              $(`#spinner${proteinNum}`).remove();
            });
          });
  
          $('.mCSB_container').css({width: `${tot_len}px`})
  
        }
      }(this, this.uniprot, this.gene))
    )
    .fail(( jqxhr, textStatus, error ) => {
      const err = `${textStatus}, ${error}`;
      console.warn( `Pfam request Failed: ${err}` );
      $(`#spinner${proteinNum}`).remove();
      $(`#${drawID}`).append('<p style="text-align:center; color: red; font-family:monospace">Error fetching Pfam data</p>');
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