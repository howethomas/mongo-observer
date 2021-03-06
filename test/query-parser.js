'use strict';

const chai = require('chai'),
      expect = chai.expect,
      QueryParser = require('../lib/query-parser');

describe('Query Parser', function () {
    
    describe('query without operators', function () {
        let query = QueryParser({name: 'John Doe'});
    
        it('should return true when doc has equal field', function () {
            let result = query.match({name: 'John Doe'});
    
            expect(result).to.be.true;
        });
        
        it('should return false when doc has no equal field', function () {
            let result = query.match({name: 'john doe'});
    
            expect(result).to.be.false;
        });
    });
    
    describe('query without operators with implicit "$and"', function () {
        let query = QueryParser({name: 'John Doe', age: 20, id: 321});
        
        it('should return true when all fields is equal', function () {
           let result = query.match({name: 'John Doe', age: 20, id: 321});
           
           expect(result).to.be.true;
        });
        
        it('should return false when least one field is not equal', function () {
           let result = query.match({name: 'John Doe', age: 19, id: 321});
           
           expect(result).to.be.false;
        });
    });
    
    describe('query with "$eq" operator', function () {
        let query = QueryParser({age: {$eq: 18}});
        
        it('should return true when doc has equal field', function () {
            let result = query.match({name: 'John Doe', age: 18});
    
            expect(result).to.be.true;
        });
        
        it('should return false when doc has no equal field', function () {
            let result = query.match({name: 'John Doe', age: 22});
    
            expect(result).to.be.false;
        });
    });
    
    describe('query with "$ne" operator', function () {
        let query = QueryParser({age: {$ne: 18}});
        
        it('should return true when doc has no equal value', function () {
            let result = query.match({name: 'John Doe', age: 8});
    
            expect(result).to.be.true;
        });
        
        it('should return false when doc has equal value', function () {
            let result = query.match({name: 'John Doe', age: 18});
    
            expect(result).to.be.false;
        });
    });
    
    describe('query with "$gt" operator', function () {
        let query = QueryParser({age: {$gt: 18}});
        
        it('should return true when doc has a higher value', function () {
            let result = query.match({name: 'John Doe', age: 28});
    
            expect(result).to.be.true;
        });
        
        it('should return false when doc has a lower value', function () {
            let result = query.match({name: 'John Doe', age: 12});
    
            expect(result).to.be.false;
        });
    });
    
    describe('query with "$lt" operator', function () {
        let query = QueryParser({age: {$lt: 18}});
        
        it('should return true when doc has a lower value', function () {
            let result = query.match({name: 'John Doe', age: 8});
    
            expect(result).to.be.true;
        });
        
        it('should return false when doc has a higher value', function () {
            let result = query.match({name: 'John Doe', age: 21});
    
            expect(result).to.be.false;
        });
    });
    
    describe('query with "$gte" operator', function () {
        let query = QueryParser({age: {$gte: 18}});
        
        it('should return true when doc has a higher value', function () {
            let result = query.match({name: 'John Doe', age: 28});
    
            expect(result).to.be.true;
        });
        
        it('should return false when doc has a lower value', function () {
            let result = query.match({name: 'John Doe', age: 12});
    
            expect(result).to.be.false;
        });
        
        it('should return true when doc has a equal value', function () {
            let result = query.match({name: 'John Doe', age: 18});
    
            expect(result).to.be.true;
        });
    });
    
    describe('query with "$lte" operator', function () {
        let query = QueryParser({age: {$lte: 18}});
        
        it('should return true when doc has a lower value', function () {
            let result = query.match({name: 'John Doe', age: 8});
    
            expect(result).to.be.true;
        });
        
        it('should return false when doc has a higher value', function () {
            let result = query.match({name: 'John Doe', age: 21});
    
            expect(result).to.be.false;
        });
        
        it('should return true when doc has a equal value', function () {
            let result = query.match({name: 'John Doe', age: 18});
    
            expect(result).to.be.true;
        });
    });
    
    describe('query with "$in" operator', function () {
        let query = QueryParser({age: {$in: [18, 20, 30]}}),
            docs = [
                { id: 0, name: 'John Doe', age: 22 },
                { id: 1, name: 'John Doe', age: 20 },
                { id: 2, name: 'John Doe', age: 12 },
                { id: 3, name: 'John Doe', age: 30 },
                { id: 4, name: 'John Doe', age: 18 },
                { id: 5, name: 'John Doe', age: 12 },
                { id: 6, name: 'John Doe', age: 18 },
                { id: 7, name: 'John Doe', age: 30 },
                { id: 8, name: 'John Doe', age: 33 },
                { id: 9, name: 'John Doe', age: 22 }
            ];
        
        it('should return true when doc has one of the values', function () {
            let result = query.match(docs[3]);
    
            expect(result).to.be.true;
        });
        
        it('should return false when doc not have any of the values', function () {
            let result = query.match(docs[0]);
    
            expect(result).to.be.false;
        });
        
        it('should return only the docs which does have one of the values', function () {
            const results = [];
            
            docs.forEach(function (doc) {
                if (query.match(doc)) results.push(doc);
            });
            
            expect(results).to.have.length(5);
        });
    });

    describe('query with "$nin" operator', function () {
        let query = QueryParser({age: {$nin: [18, 20, 30]}}),
            docs = [
                { id: 0, name: 'John Doe', age: 22 },
                { id: 1, name: 'John Doe', age: 20 },
                { id: 2, name: 'John Doe', age: 12 },
                { id: 3, name: 'John Doe', age: 30 },
                { id: 4, name: 'John Doe', age: 18 },
                { id: 5, name: 'John Doe', age: 12 },
                { id: 6, name: 'John Doe', age: 18 },
                { id: 7, name: 'John Doe', age: 30 },
                { id: 8, name: 'John Doe', age: 33 },
                { id: 9, name: 'John Doe', age: 22 }
            ];
        
        it('should return false when doc has one of the values', function () {
            let result = query.match(docs[3]);
    
            expect(result).to.be.false;
        });
        
        it('should return true when doc not have any of the values', function () {
            let result = query.match(docs[0]);
    
            expect(result).to.be.true;
        });
        
        it('should return only the docs which does not have none of the values', function () {
            const results = [];
            
            docs.forEach(function (doc) {
                if (query.match(doc)) results.push(doc);
            });
            
            expect(results).to.have.length(5);
        });
    });

});