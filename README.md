simpleconvert-xml
=================
**(c)[Bumblehead][0], 2013,2014,2015,2016** [MIT-license](#license)

Performs javascript and xml conversions in a browser or node.js environment (with [xmldom][2]). xml to json conversions can be messy. See below for details.

```javascript
var xmlnode = new DOMParser().parseFromString([
  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
  "<data>",
  "  <price>$15.98</price>",
  "  <happy>",
  "    <say>I'm happy</say>",
  "    <respond>you're happy</respond>",
  "    <conclude>we're all happy</conclude>",
  "  </happy>",
  "  <isFinal>true</isFinal>",
  "  <name>dave</name>",
  "  <name>chris</name>",
  "  <fooArr>value</fooArr>",
  "</data>"
].join('\n'), 'text/xml');

simpleconvertxml.getXMLAsObj(xmlnode);
//{
//  "data": {
//    "price": "$15.98",
//    "happy": {
//      "say": "I'm happy",
//      "respond": "you're happy",
//      "conclude": "we're all happy"
//    },
//    "isFinal": "true",
//    "name": [
//      "dave",
//      "chris"
//    ],
//    "fooArr": [
//      "value"
//    ]
//  }
//}

simpleconvertxml.getObjAsXMLstr(
  simpleconvertxml.getXMLAsObj(xmlnode)
);
//<?xml version="1.0" encoding="UTF-8"?>
//<data>
//<price>$15.98</price>
//<happy>
//<say>I'm happy</say>
//<respond>you're happy</respond>
//<conclude>we're all happy</conclude>
//</happy>
//<isFinal>true</isFinal>
//<name>dave</name>
//<name>chris</name>
//<fooArr>value</fooArr>
//</data>
```

[0]: http://www.bumblehead.com                            "bumblehead"
[1]: https://developers.google.com/gdata/docs/json    "gdata-standard"
[2]: https://npmjs.org/package/xmldom                         "xmldom"
[3]: https://github.com/magento/magento2/tree/master/lib/Zend/Locale/Data
[4]: https://raw.githubusercontent.com/iambumblehead/es5classic/master/es5classic_120x120.png

---------------------------------------------------------
#### <a id="good-to-know"></a>conversion issues

 * **XML has no array**. Any xml element can have multiple childs or a single one. A simple parser maps single nodes as an object value and multiple nodes as an array.

   If you control the source of the xml, you may flag the presence of an array by using node names affixed with `Arr`, for example `fooArr` (see above).

   ```javascript
   var xmlnode_currencies = new DOMParser().parseFromString([
     '<currencies>',
     '  <currency type="GNS">',
     '    <displayName>syli guineano</displayName>',
     '  </currency>',
     '  <currency type="GNB">',
     '    <displayName>ekuele de Guinea Ecuatorial</displayName>',
     '    <displayName>other</displayName>',
     '  </currency>',
     '</currencies>'
   ].join('\n'), 'text/xml');
    
   simpleconvertxml.getXMLAsObj(xmlnode_currencies);
   //{
   //  "currencies": {
   //    "currency": [
   //      {
   //        "displayName": "syli guineano",
   //        "type": "GNS"
   //      },
   //      {
   //        "displayName": [
   //          "ekuele de Guinea Ecuatorial",
   //          "other"
   //        ],
   //        "type": "GNB"
   //      }
   //    ]
   //  }
   //}
   ```

 * **multiple node attributes** result in multiple property definitions.

   ```javascript
   var xmlnode_types = new DOMParser().parseFromString([
     '<types>',
     '  <type type="big5han" key="collation">',
     '    orden del chino tradicional - Big5',
     '  </type>',
     '  <type type="buddhist" key="calendar">',
     '    calendario budista',
     '  </type>',
     '</types>'
   ].join('\n'), 'text/xml');
       
   simpleconvertxml.getXMLAsObj(xmlnode_types);
   //{
   //  "types": {
   //    "type": [
   //      {
   //        "collation": "orden del chino tradicional - Big5",
   //        "big5han": "orden del chino tradicional - Big5"
   //      },
   //      {
   //        "calendar": "calendario budista",
   //        "buddhist": "calendario budista"
   //      }
   //    ]
   //  }
   //}
   ```

 * **Some xml nodes have no node value**.

   ```javascript
   var xmlnode_identity = new DOMParser().parseFromString([
     '<identity>',
     '  <version number="$Revision: 1.128 $"/>',
     '  <generation date="$Date: 2009/06/15 03:46:25 $"/>',
     '  <language type="es"/>',
     '</identity>'
   ].join('\n'), 'text/xml');
   
   simpleconvertxml.getXMLAsObj(xmlnode_identity);
   //{
   //  "identity": {
   //    "version": {
   //      "number": "$Revision: 1.128 $"
   //    },
   //    "generation": {
   //      "date": "$Date: 2009/06/15 03:46:25 $"
   //    },
   //    "language": {
   //      "type": "es"
   //    }
   //  }
   //}
   ```


![scrounge](https://github.com/iambumblehead/scroungejs/raw/master/img/hand.png)[![es5 classic][4]][4]

(The MIT License)

Copyright (c) 2013-2016 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      
