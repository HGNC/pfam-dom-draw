# pfam-dom-draw

## Introduction
Takes a HGNC approved symbol and a UniProt accession from the data-gene and data-uniprot attributes within a div tag and creates a diagram representing the UniProt protein with pfam domains mapped on to the protein.

**For a live demo visit http://hgnc.github.io/pfam-dom-draw/**

## Install
To install pfam-dom-draw the easiest way would be to install [bower](http://bower.io) as described in the bower documentation and then simply run the following in your js directory:
```sh
$ bower install git://github.com/HGNC/pfam-dom-draw.git
```
## Dependencies
Javascript dependencies:
- [jQuery ~3.6.3](https://code.jquery.com/jquery-3.6.3.min.js)
- [Raphael ~2.1.0](https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js)
- [jquery.raphael.spinner](https://github.com/HGNC/jquery.raphael.spinner)
- [qTip2 3.0.3](https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.js)

Web service:
- [InterPro REST API](https://github.com/ProteinsWebTeam/interpro7-api/tree/master/docs)
- [HGNC wrapper for pfam REST](https://www.genenames.org/cgi-bin/protein/pfam-domains?up=P60709)

## Usage
Simply add a `<div class='pfamDomDrawContainer'>` anywhere in your `<body>` and add the attributes `data-uniprot=""` and `data-gene=""`(optional) to the div tag with the UniProt accession within data-uniprot and a HGNC approved gene symbol within the data-gene. Multiple pfamDomDrawContainer divs can be added to the page:
```html
<div class="pfamDomDrawContainer" data-uniprot="Q9H0C5" data-gene="BTBD1"></div>
```
Then at the bottom of the `<body>` add your javascript dependencies:
```html
<script src="https://code.jquery.com/jquery-3.6.3.min.js"
  integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU="
  crossorigin="anonymous"
></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"
  integrity="sha512-j4t/Zu3RKgAxOcA1NyhbIcvo2N4xkhdmWGW48b4ir3fJ2FUifmgNF0qfknzYGkuQO/HQmwawwB0zBjKWizYWGw=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
<script src="js/bower_components/jquery.raphael.spinner/jquery.raphael.spinner.js"
  type="text/javascript"
></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/jquery.qtip.min.js"
  integrity="sha512-BxJRFdTKV85fhFUw+olPr0B+UEzk8FTLxRB7dAdhoQ7SXmwMECj1I4BlSmZfeoSfy0OVA8xFLTDyObu3Nv1FoQ=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
```
Finally call the `pfam_doms()` function beneth the script dependencies:
```html
<script type="module">
  import PfamDomDraw from './js/pfam-dom-draw/pfam-dom-draw.js';
  $(document).ready(function(){
    let PDD = new PfamDomDraw({
      spinnerColor: '#999'
    });
    PDD.pfam_doms();
  });
</script>
```
The constructor has one settings object that you can pass (spinnerColor, width and colors) as shown above.
<dl>
  <dt>spinnerColor</dt>
  <dd>Hexadecimal color code for the spinner. Default = #000 (i.e. Black)</dd>
  <dt>width</dt>
  <dd>The max width of the viewable image. Default is 768 for 768px</dd>
  <dt>colors</dt>
  <dd>
    An array/list of hexadecimal colors that domains could be colored. If there are more domains then colors then the colors are reused. The default colors can be seen in the table below.
    <table>
      <tr><th>Hexadecimal code</th><th>Color name (not used in the array)</th></tr>
      <tr><td>#FF0000</td><td>Red</td></tr>
      <tr><td>#008000</td><td>Green</td></tr>
      <tr><td>#00FFFF</td><td>Cyan</td></tr>
      <tr><td>#0000FF</td><td>Blue</td></tr>
      <tr><td>#FF00FF</td><td>Magenta</td></tr>
      <tr><td>#FFC0CB</td><td>Pink</td></tr>
      <tr><td>#808080</td><td>Gray</td></tr>
      <tr><td>#A52A2A</td><td>Brown</td></tr>
      <tr><td>#000000</td><td>Black</td></tr>
      <tr><td>#FFA500</td><td>Orange</td></tr>
      <tr><td>#8B0000</td><td>Darkred</td></tr>
      <tr><td>#F0E68C</td><td>Khaki</td></tr>
      <tr><td>#7FFF00</td><td>Chartreuse</td></tr>
      <tr><td>#008080</td><td>Teal</td></tr>
      <tr><td>#87CEEB</td><td>Skyblue</td></tr>
      <tr><td>#FF7F50</td><td>Coral</td></tr>
      <tr><td>#9400D3</td><td>Darkviolet</td></tr>
      <tr><td>#FF69B4</td><td>Hotpink</td></tr>
      <tr><td>#DCDCDC</td><td>Gainsboro</td></tr>
      <tr><td>#D2B48C</td><td>Tan</td></tr>
      <tr><td>#2F4F4F</td><td>Darkslategray</td></tr>
      <tr><td>#FA8072</td><td>Salmon</td></tr>
      <tr><td>#FFDAB9</td><td>Peachpuff</td></tr>
      <tr><td>#808000</td><td>Olive</td></tr>
      <tr><td>#AFEEEE</td><td>Pale turquoise</td></tr>
      <tr><td>#6495ED</td><td>Cornflower blue</td></tr>
      <tr><td>#4B0082</td><td>Indigo</td></tr>
      <tr><td>#C0C0C0</td><td>silver</td></tr>
      <tr><td>#CD853F</td><td>Peru</td></tr>
      <tr><td>#FFD700</td><td>Gold</td></tr>
      <tr><td>#708090</td><td>Slate gray</td></tr>
    </table>
  </dd>
</dl>

The resulting graphic will show a stylised diagram of a protein with the pfam domains. Hovering over a domain will create a tooltip which offers more information about the domain. Clicking on the domain will take you to a Pfam domain page within InterPro for that particular domain. You can also click on the UniProt text above the protein which will navigate you to the UniProt page for the protein. If a gene symbol was added, the gene symbol will appear before the UniProt accession and will navigate you to the HGNC symbol report for the gene if clicked.

![successful result](https://user-images.githubusercontent.com/9589542/213166573-c16ffcee-6e1f-4e36-ad4c-16ee4b497824.png)

##Acknowledgements
Many thanks to the InterPro developers for providing a very useful REST webservice which this javascript code uses.
Information about the InterPro REST API can be found at https://github.com/ProteinsWebTeam/interpro7-api/tree/master/docs.
