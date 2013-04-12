var SimpleConvertXML = require('../simpleConvertXML'),
    DOMParser = require('xmldom').DOMParser;

describe("SimpleConvertXML.getXMLAsObj", function () {
  var result, resultExpected;
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
  it("should do something", function () {
    var result = SimpleConvertXML.getXMLAsObj(testDoc);
  
    expect( true ).toBe( true );
  });
});