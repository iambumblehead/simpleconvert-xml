simpleconvert-xml
=================
**(c)[Bumblehead][0], 2013,2014,2015,2016** [MIT-license](#license)

### overview

simpleconvert-xml will convert xml nodes into a javascript object or it will convert a javascript object into xml nodes.

What's good about simpleconvert-xml:

 - usable in a browser environment or with node.js (with [xmldom][2])
 - special xml-formatting will identify single-element arrays

It is not a comprehensive solution for xml conversion. See the examples below to find out what scenarious this script is best for.

There are situations where useful mapping of xml to json is not possible. Notable problems have been found when converting the [ZEND locale][3] xml files. See the [problems](problems) section for more details.

[![es5 classic][4]][4]

[0]: http://www.bumblehead.com                            "bumblehead"
[1]: https://developers.google.com/gdata/docs/json    "gdata-standard"
[2]: https://npmjs.org/package/xmldom                         "xmldom"
[3]: https://github.com/magento/magento2/tree/master/lib/Zend/Locale/Data
[4]: https://raw.githubusercontent.com/iambumblehead/es5classic/master/es5classic_120x120.png

---------------------------------------------------------
#### <a id="install"></a>install

 * **npm**

  ```bash
  $ npm install simpleconvert-xml
  ```

 * **Direct Download**
 
  ```bash
  $ git clone https://github.com/iambumblehead/simpleconvert-xml.git
  ```

---------------------------------------------------------
#### <a id="test"></a>test

 to run tests, use `npm test` from a shell.

 ```bash
 $ npm test
 ```

---------------------------------------------------------
#### <a id="problems"></a>problems

Documented problems related to the conversion of xml to json using this script. Simpeconvert-xml may be inadequate for your complex xml document.

**Arrays.** XML does not have them. Elements with multiple child nodes will produce an array, and a similar element with one node will not.
 
```xml
<currencies>
  <currency type="GNS">
    <displayName>syli guineano</displayName>
  </currency>
  <currency type="GNB">
    <displayName>syli guineano</displayName>
    <displayName>other</displayName>
  </currency>
<currencies>
```
 
```json
"currencies" : {
  "currency" : [{
    "displayName": "syli guineano",
    "type": "GNS"
  }, {
    "displayName": [
      "ekuele de Guinea Ecuatorial",
      "other"
    ],
    "type": "GNB"
  }]
}
```
 
If you control the source of the xml, you may flag the presence of an array by using a node name affixed with `Arr`, for example `displayNameArr`.


**multiple attributes on a node** will create multiple definitions in the resulting JSON file.

```xml
<types>
  <type type="big5han" key="collation">orden del chino tradicional - Big5</type>
  <type type="buddhist" key="calendar">calendario budista</type>
</types>
```

to JSON,

```json
{ 
  "types" : {
    "type": [{
      "collation": "orden del chino tradicional - Big5",
      "big5han": "orden del chino tradicional - Big5"
    },{
      "calendar": "calendario budista",
      "buddhist": "calendario budista"
    }]
  }
}
```

**nodes without a node value** will have no final json definition
 
```xml
<identity>
  <version number="$Revision: 1.128 $"/>
  <generation date="$Date: 2009/06/15 03:46:25 $"/>
  <language type="es"/>
</identity>
```

to JSON,

```json
"identity": {
  "version": {
    "$Revision: 1.128 $": ""
  },
  "generation": {
    "$Date: 2009/06/15 03:46:25 $": ""
  },
  "language": {
    "es": ""
  }
}
```


---------------------------------------------------------
#### <a id="get-started">get started

**Before starting** it may be useful to see the below example in which `xmlNode` is a result of the same xml file --both examples produce the same output.

_**node.js environment**_

```javascript
var DOMParser = require('xmldom').DOMParser,
    simpleConvertXML = require('simpleConvertXML');
  
xmlNode = new DOMParser().parseFromString(xmlFormattedStr);
obj = simpleConvertXML.getXMLAsObj(xmlNode);
```

_**browser environment**_
 
```javascript
obj = simpleConvertXML.getXMLAsObj(xmlNode);
```
   
---------------------------------------------------------
#### <a id="methods"></a>methods
      
**getXMLAsObj( _xmlNode_ )**
      
convert an xml node into an object
   
notice `fooArr`, its property-name is affixed with `Arr`. As a result `fooArr` is defined as an array on the resulting object.
   
```javascript
var SimpleConvertXML = require('simpleConvertXML'),
    DOMParser = require('xmldom').DOMParser;
   
var testXMLStr = [
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
].join('\n');
     
var xmlNode = new DOMParser().parseFromString(testXMLStr);
console.log(SimpleConvertXML.getXMLAsObj(testDoc));
// { 
//   data : { 
//     price: '$15.98',
//     happy: { 
//       say: 'I\'m happy',
//       respond: 'you\'re happy',
//       conclude: 'we\'re all happy' 
//     },
//     isFinal: 'true',
//     name : ['dave', 'chris'],
//     fooArr : ['value']
//   } 
// };
```
 
**getObjAsXMLstr( _object_ )**
 
convert an object into an xml string
   
```javascript
var SimpleConvertXML = require('simpleConvertXML');
   
var obj = {
  data : { 
    price: '$15.98',
    happy: { 
      type : 'type1',
      say: 'I\'m happy',
      respond: 'you\'re happy',
      conclude: 'we\'re all happy' 
    },
    isFinal: 'true',
    foobarArr: ['foo', 'bar']
  }
}
   
console.log(SimpleConvertXML.getObjAsXMLstr(obj));
// "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
// "<data>"
// "<price>$15.98</price>"
// "<happy>"
// "<type>type1</type>"
// "<say>I'm happy</say>"
// "<respond>you're happy</respond>"
// "<conclude>we're all happy</conclude>"
// "</happy>"
// "<isFinal>true</isFinal>"
// "<foobarArr>foo</foobarArr>"
// "<foobarArr>bar</foobarArr>"
// "</data>"
```
   
      
---------------------------------------------------------
#### <a id="license">license

(The MIT License)

Copyright (c) 2013-2016 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      
