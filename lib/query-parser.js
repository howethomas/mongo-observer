'use strict';
const toFactory = require('tofactory'),
      utils     = require('./utils'),
      isObject  = utils.isObject,
      isArray   = utils.isArray,
      ObjKeys   = Object.keys;

module.exports = toFactory(QueryParser);

function QueryParser(queryObj) {
    let queryFunction;
    
    const operators = {
        '$eq': function (key, value) {
            return function (doc) {
                return doc[key] === value;
            };
        },
        '$gt': function (value) {
            return function (field) {
                return field > value;
            };
        },
        '$gte': function (value) {
            return function (field) {
                return field >= value;  
            };
        },
        '$lt': function (value) {
            return function (field) {
                return field < value;
            };
        },
        '$lte': function (value) {
            return function (field) {
                return field <= value;
            };
        },
        '$ne': function (value) {
            return function (field) {
                return field !== value;
            };
        },
        '$in': function (values) {
            const has = function (val) {
                return values.some(function (item) {
                    return val === item;
                });
            };
            
            return function (value) {
                if (isArray(value)) {
                    return value.some(function (val) {
                        return has(val);
                    });
                }
                return has(value);
            };
        },
        '$nin': function (values) {
            const notHas = function (val) {
                return values.every(function (item) {
                    return val !== item;
                });
            };
            
            return function (value) {
                if (isArray(value)) {
                    return value.every(function (item) {
                        return notHas(item);
                    });
                }
                return notHas(value);
            };
        },
        
        // {$and: [{a: 1}, {b: 2}]}
        '$and': function (objects) {
            return function (fields) {
                return objects.every(function (obj) {
                    return compile(obj)(fields);
                });
            };
        }
    };
    
    if (isObject(queryObj)) queryFunction = compile(queryObj);
    
    return {
        compile,
        match
    };
    
    function compile(queryObj) {
        let queryFn;
        const keys = ObjKeys(queryObj);
        
        if (keys > 1) { // build implicit $and
            
            let statements = [];
            
            keys.forEach(function (key, i) {
                statements[i] = {key: queryObj[key]};
            });
            
            queryFn = operators.$and(statements);
            
        } else {
            let key = keys[0];
        
            queryFn = getOperator(key, queryObj[key]);
        }
        
        return queryFn;
    }
    
    function match(doc) {
        return queryFunction(doc);
    }
    
    
    function getOperator(key, value) {
        const op = operators[key];
        
        if (op) return op(key, value);
        
        if (isObject(value)) {
            value = compile(value);
        }
        
        return operators.$eq(key, value);
    }
    
}