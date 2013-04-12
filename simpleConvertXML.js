// Filename: simpleConvertXML.js  
// Timestamp: 2013.04.11-21:40:17 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)  

var simpleConvertXML = module.exports = (function () {
// ELEMENT_NODE                :  1,
// ATTRIBUTE_NODE              :  2,
// TEXT_NODE                   :  3,
// CDATA_SECTION_NODE          :  4,
// ENTITY_REFERENCE_NODE       :  5,
// ENTITY_NODE                 :  6,
// PROCESSING_INSTRUCTION_NODE :  7,
// COMMENT_NODE                :  8,
// DOCUMENT_NODE               :  9,
// DOCUMENT_TYPE_NODE          : 10,
// DOCUMENT_FRAGMENT_NODE      : 11,
// NOTATION_NODE               : 12

  return {
    isArray : function (obj) {
      if (typeof obj === 'object' && obj) {
        if (!(obj.propertyIsEnumerable('length'))) {
          return typeof obj.length === 'number';
        }
      }
      return false;
    },

    // input:                               output:
    //  data = {                             <data>
    //    price : "$15.87",                    <price>$15.87</price>
    //    happy : {                            <happy>
    //      say      : "i'm happy",              <say>i'm happy</say>
    //      respond  : "you're happy",           <respond>you're happy</respond>
    //      conclude : "we're all happy"         <conclude>we're all happy</conclude>
    //    },                                   </happy>
    //    isfinal : "true"                     <isFinal>true</isFinal>
    //  }                                    </data>
    //
    getObjAsXMLstr : function (data) {
      var xmlStr;

      function getNodeTree(obj) {
        var xmlStr = "";
        if (obj) {
          if (typeof obj === "object") {
            for (var name in obj) {
              xmlStr += '<' + name + '>' + getNodeTree(obj[name]) + '</' + name + '>\n';
            }
          } else {
            xmlStr += obj.toString();
          }
        }
        return xmlStr;
      }

      xmlStr = "";
      xmlStr += '<?xml version="1.0" encoding="UTF-8"?>\n';
      xmlStr += '<data>\n';
      xmlStr += getNodeTree(data);
      xmlStr += '</data>';

      return xmlStr;
    },

    // note: appending `Arr` to a node name forces the value to be recognized as 
    //       an array. using the criteria of counting node name instances, creates
    //       inconsistent opportunities for data to be qualified as array or
    //       string.
    //
    // input:                              output:
    //  <data>                               data = {
    //    <price>$15.87</price>                price : "$15.87",
    //    <updateHTML>                         updateHTML : "<p><b>html</b></p>",
    //      <p>                                happy : {
    //        <b>html</b>                        say      : "happy?",
    //      </p>                                 respond  : "happy!",
    //    </updateHTML>                          conclude : "HAPPY.",
    //    <happy>                              },
    //      <say>happy?</say>                  isFinal : "true",
    //      <respond>happy!</respond>          name : ["chris", "dave"],
    //      <conclude>HAPPY</conclude>         fooArr : [value]
    //    </happy>                           }
    //    <isFinal>true</isFinal>
    //    <name>dave</name>
    //    <name>chris</name>
    //    <fooArr>value</fooArr>
    //  </data>
    //
    getXMLAsObj : function (xmlObj) {
      var isArray = this.isArray;

      function getNodeAsArr(nodeChild) {
        var nodeObj = getXMLAsObj(nodeChild),
            nodeName = nodeChild.nodeName, finObj;

        // property names are unknown here, 
        // and so for-loop is used
        for (var o in nodeObj) {
          if (nodeObj.hasOwnProperty(o)) {
            if (isArray(nodeObj[o])) {
              finObj = nodeObj[o];
            } else {
              finObj = [nodeObj[o]];
            }
          }
        }  
        return finObj;
      }

      function getXMLAsObj(node) {
        var nodeName, nodeType, strObj = "", finObj = {}, isStr = true;

        if (node && node.hasChildNodes()) {
          node = node.firstChild;
          do {
            nodeType = node.nodeType;
            nodeName = node.nodeName;
            if (nodeType === 1) {
              isStr = false;
              // if array trigger, make this an array
              if (nodeName.match(/Arr\b/)) { 
                finObj[nodeName] = getNodeAsArr(node);
              } else if (finObj[nodeName]) { 
                // if array already formed, push item to array
                // else a repeated node, redefine this as an array
                if (isArray(finObj[nodeName])) {
                  finObj[nodeName].push(getXMLAsObj(node));
                } else {
                  finObj[nodeName] = [finObj[nodeName]];
                  finObj[nodeName].push(getXMLAsObj(node));
                }
              } else {
                finObj[nodeName] = getXMLAsObj(node);
              }
            } else if (nodeType === 3) {
              strObj += node.nodeValue;
            }
          } while ((node = node.nextSibling));
        }
        return isStr ? strObj : finObj;
      }

      return getXMLAsObj(xmlObj);
    }
  };

}());