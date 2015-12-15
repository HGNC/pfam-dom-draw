# pfam-dom-draw

## Introduction
Takes a HGNC approved symbol and a UniProt accession from the data-gene and data-uniprot attributes within a div tag and creates a diagram representing the UniProt protein with pfam domains mapped on to the protein.

**For a live demo visit http://hgnc.github.io/pfam-dom-draw/**

## Install
To install europe-pmcentralizer the easiest way would be to install [bower](http://bower.io) as described in the bower documentation and then simply run the following in your js directory:
```sh
$ bower install git://github.com/HGNC/pfam-dom-draw.git
```
## Dependencies
Javascript dependencies:
- [jQuery ~2.1.4](https://github.com/jquery/jquery)
- [Raphael ~2.1.4](https://github.com/DmitryBaranovskiy/raphael)
- [jquery.raphael.spinner](https://github.com/hunterae/jquery.raphael.spinner)
- [qTip 1.0.0](https://github.com/taballa/qTip)

Web service:
- [Pfam](http://pfam.xfam.org/help#tabview=tab10)
- [HGNC wrapper for pfam REST](http://www.genenames.org/cgi-bin/ajax/pfam_dom_ajax?up=P60709)

## Usage
Simply add a `<div class='pfamDomDrawContainer'>` anywhere in your `<body>` and add the attributes `data-uniprot=""` and `data-gene=""`(optional) to the div tag with the UniProt accession within data-uniprot and a HGNC approved gene symbol within the data-gene. Multiple pfamDomDrawContainer divs can be added to the page:
```html
<div class="pfamDomDrawContainer" data-uniprot="Q9H0C5" data-gene="BTBD1"></div>
```
Then at the bottom of the `<body>` add your javascript dependencies:
```html
<script type="text/javascript" src="/js/bower_components/jquery/dist/jquery.min.js"></script>
<script type="text/javascript" src="/js/bower_components/raphael/raphael-min.js"></script>
<script type="text/javascript" src="/js/bower_components/jquery.raphael.spinner/jquery.raphael.spinner.js"></script>
<script type="text/javascript" src="js/bower_components/qTip/jquery.qtip.min.js"></script>
<script type="text/javascript" src="/js/bower_components/pfam-dom-draw/pfam-dom-draw.js"></script>
```
Finally call the `pfam_doms()` function beneth the script dependencies:
```html
<script type="text/javascript">
  $(document).ready(function(){
    pfam_doms({
      spinnerColor: '#999'
    });
  });
</script>
```
The function has one settings that you can pass (spinnerColor) as shown above. The spinnerColor is the colour you want the loading spinner to be (default: #000).

The resulting graphic will show a stylised diagram of a protein with the pfam domains. Hovering over a domain will create a tooltip which offers more information about the domain. Clicking on the domain will take you to pfam.xfam.org for that particular domain. You can also click on the UniProt text above the protein which will navigate you to the UniProt page for the protein. If a gene symbol was added also the gene symbol will appear before the UniProt accession and will navigate you to the HGNC symbol report for the gene if clicked.

![successful result](https://cloud.githubusercontent.com/assets/9589542/11808629/78fd8876-a319-11e5-8e11-d9945f3409db.png)

##Acknowledgements
Many thanks to the Pfam developers for providing a very useful REST webservice which this javascript code uses.
Information about the Pfam REST API can be found at http://pfam.xfam.org/help#tabview=tab10.
