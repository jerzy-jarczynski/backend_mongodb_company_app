const mongoose = require('mongoose');
const Employee = require('../employee.model.js');
const expect = require('chai').expect;

describe('Employee', () => {

  it('should throw an error if no args', () => {
    const emp = new Employee({}); // create new Employee, but don't set any attr values
  
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if args are not strings', () => {

    const cases = [{}, []];
    for(let name of cases) {
      const emp = new Employee({ firstName: name, lastName: name, department: name });
  
      emp.validate(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
  
    }
  });

  it('should not throw an error if args are okay', () => {

    const emp = new Employee({ firstName: 'John', lastName: 'Doe', department: 'Management' });
  
    emp.validate(err => {
      expect(err).to.not.exist;
    });
  
  });

});