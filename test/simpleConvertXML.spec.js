var SimpleConvertXML = require('../simpleConvertXML'),
    DOMParser = require('xmldom').DOMParser,
    CompareObj = require('compareobj');

describe("SimpleConvertXML.getXMLAsObj", function () {
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
    result = SimpleConvertXML.getXMLAsObj(testDoc);
    
    
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
    result = SimpleConvertXML.getXMLAsObj(testDoc);

    expect( 
      CompareObj.isSameMembersDefinedSame(
        resultExpected,
        result
      ) 
    ).toBe( true );  
  });
});

describe("SimpleConvertXML.getObjAsXMLstr", function () {
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

    result = SimpleConvertXML.getObjAsXMLstr(testObj);    

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
