
export class TemplateSchema {

  schema: Object;

  constructor(schema: Object){
    this.schema = schema;
  }

  isValidForData(data: Object) :boolean{
    return this.validateSchema(data, this.schema);
  }

  getSchema(){
    return this.schema;
  }

  validateSchema(data: any, schema: any) : boolean{
    for(var key in data) {
      if(schema[key]){
        var val = data[key];
        if(typeof val === 'object'){
          var schemaVal = schema[key];
          if(val.constructor == Array){
            // check schema is an array and has one value
            if(typeof schemaVal == 'object' && schemaVal.constructor == Array && schemaVal[0]){
              var isValid = true;
              val.forEach((eachVal: any) => {
                isValid = isValid && this.validateSchema(eachVal, schemaVal[0]);
              });
            }else{
              // data is array, but no schema
              return false;
            }
          }else{
            return this.validateSchema(val, schemaVal);
          }
        }
      }else{
        // schema does not have value
        return false
      }
    };
    return true;
  }

}