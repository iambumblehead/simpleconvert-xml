// Filename: simpleConvertXML.js  
// Timestamp: 2016.01.11-20:51:48 (last modified)
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
    getObjAsXMLstr : function (data, indent) {
      var xmlStr = '<?xml version="1.0" encoding="UTF-8"?>\n',
          nodeParentStr = '<:name>\n:v<\/:name>\n',
          nodeLeafStr = '<:name>:v<\/:name>\n';

      indent = indent || '';

      function getAsNodeLeaf(name, content) {
        return nodeLeafStr
          .replace(/:name/g, name)
          .replace(/:v/, getNodeTree(content));      
      }

      function getAsNodeParent(name, content) {
        return nodeParentStr
          .replace(/:name/g, name)
          .replace(/:v/, getNodeTree(content));            
      }

      function getNode(name, content) {
        if (Array.isArray(content)) {
          return content.map(function (p) {
            return getNode(name, p);
          }).join('');          
        } else if (typeof content === 'object') {
          return getAsNodeParent(name, content);
        } else if (typeof content === 'string') {
          return getAsNodeLeaf(name, content);            
        }
      }

      function getNodeTree(obj, i) {
        var xmlStr = "";

        if (obj && typeof obj === "object") {
          for (var name in obj) {
            xmlStr += getNode(name, obj[name]);
          } 
        } else if (typeof obj === 'string') {
          xmlStr += obj;
        }

        return xmlStr;
      }

      xmlStr += getNodeTree(data, indent);

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
    //    <happy>                              happy : {
    //      <say>happy?</say>                    say : "happy?",
    //      <respond>happy!</respond>            respond : "happy!",
    //      <conclude>HAPPY</conclude>           conclude : "HAPPY"
    //    </happy>                             },
    //    <isFinal>true</isFinal>              isFinal : "true",
    //    <name>dave</name>                    name : ["chris",
    //    <name>chris</name>                           "dave"],
    //    <fooArr>value</fooArr>               fooArr : ["value"]
    //  </data>                              }
    //
    getXMLAsObj : function (xmlObj) {
      function getNodeAsArr(nodeChild) {
        var nodeObj = getXMLAsObj(nodeChild),
            nodeName = nodeChild.nodeName, finObj;

        // property names are unknown here, 
        // and so for-loop is used
        if (Array.isArray(nodeObj)) {
          finObj = nodeObj;
        } else {
          finObj = [nodeObj];
        }

        return finObj;
      }

      // get a node's value redefined to accomodate
      // attributes
      function getWithAttributes(val, node) {
        var attrArr = node.attributes, attr, x, newObj;
        if (attrArr) {
          if (Array.isArray(val)) {
            newObj = val;
          } else if (typeof val === 'object') {
            newObj = val;
            for (x = attrArr.length; x--;) {
              val[attrArr[x].name] = attrArr[x].nodeValue;
            }                        
          } else if (typeof val === 'string') {
            if (attrArr.length) {
              newObj = {};
              for (x = attrArr.length; x--;) {
                if (val) {
                  newObj[attrArr[x].nodeValue] = val;                  
                } else {
                  newObj[attrArr[x].name] = attrArr[x].nodeValue;                  
                }
              }                                      
            }
          } else {
            newObj = val;
          }
        }
        return newObj || val;
      }

      function getXMLAsObj(node) {
        var nodeName, nodeType, 
            strObj = "", finObj = {}, isStr = true, x;

        if (node) {
          if (node.hasChildNodes()) {
            node = node.firstChild;
            do {
              nodeType = node.nodeType;
              nodeName = node.nodeName;
              if (nodeType === 1) {
                isStr = false;
                // if array trigger, make this an array
                if (nodeName.match(/Arr$/)) { 
                  finObj[nodeName] = getNodeAsArr(node);
                } else if (finObj[nodeName]) { 
                  // if array already formed, push item to array
                  // else a repeated node, redefine this as an array
                  if (Array.isArray(finObj[nodeName])) {
                    // if attribute... define on first attribute
                    finObj[nodeName].push(
                      getWithAttributes(getXMLAsObj(node), node)
                    );
                  } else {
                    finObj[nodeName] = [finObj[nodeName]];
                    finObj[nodeName].push(
                      getWithAttributes(getXMLAsObj(node), node)
                    );
                  }
                } else {
                  finObj[nodeName] = getWithAttributes(getXMLAsObj(node), node);
                }
              } else if (nodeType === 3) {
                strObj += node.nodeValue;
              }
            } while ((node = node.nextSibling));
          }
          return isStr ? strObj : finObj;
        }
      }

      return getXMLAsObj(xmlObj);
    }
  };

}());
