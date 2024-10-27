Blockly.Java.parseJBridgeVariableBlocks = function (variableBlock) {

	//There is bug a in this code. There is no local initialization block and IsIndiviudalBlock is a global variable and doesn't work on nested blocks AS/MS 10/19/2024
  var code = "";
  var componentType = variableBlock.type;
  if (componentType == "lexical_variable_set") {
    code = Blockly.Java.parseJBridgeVariableSetBlock(variableBlock);
    jBridgeIsIndividualBlock = true;
  } else if (componentType == "lexical_variable_get") {
    code = Blockly.Java.parseJBridgeVariableGetBlock(variableBlock);
// newly added after finding bug that local declaration is not taken care of
  } else if (componentType == "local_declaration_statement") {
  //Local initialization doesn't work
    //code = Blockly.Java.parseJBridgeGlobalInitializationBlock(variableBlock);
    //jBridgeIsIndividualBlock = true;
    //code = Blockly.Java.parseJBridgeLocalInitializationBlock(variableBlock);
   // jBridgeIsIndividualBlock = false;
  } else if (componentType = "global_declaration") {
    code = Blockly.Java.parseJBridgeGlobalInitializationBlock(variableBlock);
    jBridgeIsIndividualBlock = true;
  }
  return code;
};

Blockly.Java.parseJBridgeVariableSetBlock = function (variableSetBlock) {
  var code = "";
  var leftValue = variableSetBlock.getFieldValue("VAR");
  var paramsMap = new Object();
  //Check if the variable is global or fuction param
  paramsMap = Blockly.Java.getJBridgeParentBlockFieldMap(variableSetBlock.parentBlock_, "component_event", "PARAMETERS");
  leftValue = Blockly.Java.getJBridgeRelativeParamName(paramsMap, leftValue);

  var rightValue = "";
  var type = jBridgeGlobalVarTypes[leftValue];
  for (var x = 0, childBlock; childBlock = variableSetBlock.childBlocks_[x]; x++) {
    var data = Blockly.Java.parseBlock(childBlock);
    type = Blockly.Java.findObjectCastType(type);
    rightValue = "(" + type + ") " + data;
    if (jBridgeIsIndividualBlock) {
      code = code + "\n" + data;
    } else {
      if (childBlock.type == "component_method") {
        var method = childBlock.instanceName + "." + childBlock.methodName;
        if (childBlock.childBlocks_.length > 0) {
          var param1 = Blockly.Java.parseBlock(childBlock.childBlocks_[0]);
          if (param1.slice(0, 1) == "\"" && param1.slice(-1) == "\"") {
            param1 = param1.slice(1, -1);
          }
          method = method + "," + param1;
        }
        if (Blockly.Java.hasTypeCastKey(method, returnTypeCastMap)) {
          rightValue = Blockly.Java.TypeCastOneValue(method, rightValue, returnTypeCastMap);
        }
      } else if (Blockly.Java.hasTypeCastKey(leftValue, returnTypeCastMap)) {
        rightValue = Blockly.Java.TypeCastOneValue(leftValue, rightValue, returnTypeCastMap);
      }
      code = code + Blockly.Java.genJBridgeVariableInitializationBlock(leftValue, rightValue);
    }
  }
  return code;
};

Blockly.Java.parseJBridgeVariableGetBlock = function (variableGetBlock) {
  var paramName = variableGetBlock.getFieldValue('VAR');
  var paramsMap = new Object();
  //Check if the variable is global or fuction param
  paramsMap = Blockly.Java.getJBridgeParentBlockFieldMap(variableGetBlock.parentBlock_, "component_event", "PARAMETERS");
  paramName = Blockly.Java.getJBridgeRelativeParamName(paramsMap, paramName);
  return Blockly.Java.genJBridgeVariableGetBlock(paramName);
};

/* new code for local init starts here AS/MS 10/19/2024 */
Blockly.Java.parseJBridgeLocalInitializationBlock = function (localBlock) {
  var leftValue;
  var rightValue;

  leftValue = globalBlock.getFieldValue('NAME').replace("local", "");
  rightValue = "";
  for (var x = 0, childBlock; childBlock = localBlock.childBlocks_[x]; x++) {
    rightValue = rightValue
      + Blockly.Java.parseBlock(childBlock);
  }
  var childType = localBlock.childBlocks_[0].category;
  //TODO change get value type to pass the block. List blocks dont always return lists (select item block)
  var variableType = Blockly.Java.getValueType(childType, rightValue, localBlock.childBlocks_[0]);

  jBridgeGlobalVarTypes[leftValue] = variableType;
  jBridgeVariableDefinitionMap[leftValue] = variableType;


  jBridgeInitializationList.push(Blockly.Java.genJBridgeVariableInitializationBlock(leftValue, rightValue));

  var nextBlock = Blockly.Java.parseBlock(controlBlock.childBlocks_[1]);
  code += nextBlock;

  return code;
};



Blockly.Java.parseJBridgeGlobalInitializationBlock = function (globalBlock) {
  var leftValue;
  var rightValue;

  leftValue = globalBlock.getFieldValue('NAME').replace("global ", "");
  rightValue = "";
  for (var x = 0, childBlock; childBlock = globalBlock.childBlocks_[x]; x++) {
    rightValue = rightValue
      + Blockly.Java.parseBlock(childBlock);
  }



  var childType = globalBlock.childBlocks_[0].category;
  //TODO change get value type to pass the block. List blocks dont always return lists (select item block)
  var variableType = Blockly.Java.getValueType(childType, rightValue, globalBlock.childBlocks_[0]);

  jBridgeGlobalVarTypes[leftValue] = variableType;
  jBridgeVariableDefinitionMap[leftValue] = variableType;


  jBridgeInitializationList.push(Blockly.Java.genJBridgeVariableInitializationBlock(leftValue, rightValue));

  return "";
};

Blockly.Java.genJBridgeVariableInitializationBlock = function (leftValue, rightValue) {
  var code = "";
  code = leftValue
    + " = "
    + rightValue
    + ";";
  return code
};

Blockly.Java.genJBridgeVariableGetBlock = function (paramName) {
  var code = paramName;
  return code;
};
