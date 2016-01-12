// Filename: simpleConvertXML.spec.js  
// Timestamp: 2016.01.11-21:14:16 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

var simpleconvertxml = require('../simpleConvertXML'),
    DOMParser = require('xmldom').DOMParser,
    CompareObj = require('compareobj');


describe("simpleconvertxml.getXMLAsObj", function () {
  var result, resultExpected;

  it("should convert an xml node into an object", function () {
    var testDoc, testXMLStr = "" +
          "<data>\n" +
          "  <price>$15.98</price>\n" +
          "  <happy>\n" +
          "    <say>I'm happy</say>\n" +
          "    <respond>you're happy</respond>\n" +
          "    <conclude>we're all happy</conclude>\n" +
          "  </happy>\n" +
          "  <isFinal>true</isFinal>\n" +
          "  <name>dave</name>\n" +
          "  <name>chris</name>\n" +
          "  <fooArr>value</fooArr>\n" +
          "</data>";
    
    resultExpected = { 
      data : { 
        price: '$15.98',
        happy: { 
          say: 'I\'m happy',
          respond: 'you\'re happy',
          conclude: 'we\'re all happy' 
        },
        isFinal: 'true',
        name : ['dave', 'chris'],
        fooArr : ['value']
      } 
    };


    testDoc = new DOMParser().parseFromString(testXMLStr);
    result = simpleconvertxml.getXMLAsObj(testDoc);
    
    
    expect( 
      CompareObj.isSameMembersDefinedSame(
        resultExpected,
        result
      ) 
    ).toBe( true );
  });


  it("should add attributes as defined properties to the resulting object", function () {
    var testDoc, testXMLStr = "" +
          "<data>\n" +
          "  <price>$15.98</price>\n" +
          "  <happy type=\"type1\">\n" +
          "    <say>I'm happy</say>\n" +
          "    <respond>you're happy</respond>\n" +
          "    <conclude>we're all happy</conclude>\n" +
          "  </happy>\n" +
          "  <isFinal>true</isFinal>\n" +
          "</data>";
    
    resultExpected = { 
      data : { 
        price: '$15.98',
        happy: { 
          type : 'type1',
          say: 'I\'m happy',
          respond: 'you\'re happy',
          conclude: 'we\'re all happy' 
        },
        isFinal: 'true' 
      } 
    };


    testDoc = new DOMParser().parseFromString(testXMLStr);
    result = simpleconvertxml.getXMLAsObj(testDoc);

    expect( 
      CompareObj.isSameMembersDefinedSame(
        resultExpected,
        result
      ) 
    ).toBe( true );  
  });
});

describe("simpleconvertxml.getObjAsXMLstr", function () {
  var result, resultExpected;

  it("should convert an object into an xml-like str", function () {
    var testObj = { 
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
    };

    result = simpleconvertxml.getObjAsXMLstr(testObj);    

    resultExpected = "" +
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
      "<data>\n" +
      "<price>$15.98</price>\n" +
      "<happy>\n" +
      "<type>type1</type>\n" +
      "<say>I'm happy</say>\n" +
      "<respond>you're happy</respond>\n" +
      "<conclude>we're all happy</conclude>\n" +
      "</happy>\n" +
      "<isFinal>true</isFinal>\n" +
      "<foobarArr>foo</foobarArr>\n" +
      "<foobarArr>bar</foobarArr>\n" +
      "</data>\n";

    expect( result ).toBe( resultExpected );
  });

});


describe("convertxml", function () {

  it("should pass the readme example", function () {
    
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


    var xmlnode_types = new DOMParser().parseFromString([
      '<types>',
      '  <type type="big5han" key="collation">orden del chino tradicional - Big5</type>',
      '  <type type="buddhist" key="calendar">calendario budista</type>',
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


    var xmlnode_empty = new DOMParser().parseFromString([
      '<identity>',
      '  <version number="$Revision: 1.128 $"/>',
      '  <generation date="$Date: 2009/06/15 03:46:25 $"/>',
      '  <language type="es"/>',
      '</identity>'
    ].join('\n'), 'text/xml');    

    simpleconvertxml.getXMLAsObj(xmlnode_empty);
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
    
  });

});
