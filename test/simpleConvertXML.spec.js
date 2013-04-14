var SimpleConvertXML = require('../simpleConvertXML'),
    DOMParser = require('xmldom').DOMParser,
    CompareObj = require('compareobj');

describe("SimpleConvertXML.getXMLAsObj", function () {
  var result, resultExpected;

  it("should do something", function () {
    var testDoc, testXMLStr = "" +
          "<data>\n" +
          "  <price>$15.98</price>\n" +
          "  <happy>\n" +
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


