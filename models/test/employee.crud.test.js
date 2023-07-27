const mongoose = require('mongoose');
const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;

describe('Employee', () => {

  let salesDepartmentId;
  let hrDepartmentId;

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });

      const salesDepartment = new Department({ name: 'Sales' });
      const savedSalesDepartment = await salesDepartment.save();
      salesDepartmentId = savedSalesDepartment._id;

      const hrDepartment = new Department({ name: 'Human Resources' });
      const savedHRDepartment = await hrDepartment.save();
      hrDepartmentId = savedHRDepartment._id;

    } catch(err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {

    before(async () => {
      const testEmpOne = new Employee({ firstName: 'John', lastName: 'Doe', department: salesDepartmentId });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Jane', lastName: 'Doe', department: hrDepartmentId });
      await testEmpTwo.save();
    });
  
    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe' });
      const expectedName = 'John Doe';
      expect(employee.firstName + ' ' + employee.lastName).to.be.equal(expectedName);
    });

    after(async () => {
      await Employee.deleteMany();
    });
  
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'John', lastName: 'Doe', department: salesDepartmentId });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John', lastName: 'Doe', department: salesDepartmentId
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ 
        firstName: 'Jane', lastName: 'Doe', department: hrDepartmentId 
      });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({
        firstName: 'John', lastName: 'Doe', department: salesDepartmentId
      }, { $set: {
        firstName: '=John=', lastName: '=Doe=', department: hrDepartmentId
      }});
      const updatedEmployee = await Employee.findOne({
        firstName: '=John=', lastName: '=Doe=', department: hrDepartmentId
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ 
        firstName: 'John', lastName: 'Doe', department: salesDepartmentId
      });
      employee.firstName = '=John=';
      employee.lastName = '=Doe=';
      employee.department = hrDepartmentId;
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=John=', lastName: '=Doe=', department: hrDepartmentId
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Updated!' }});
      const employees = await Employee.find({ firstName: 'Updated!' });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John', lastName: 'Doe', department: salesDepartmentId
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ 
        firstName: 'Jane', lastName: 'Doe', department: hrDepartmentId 
      });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({
        firstName: 'John', lastName: 'Doe', department: salesDepartmentId
      });
      const removedEmployee = await Employee.findOne({
        firstName: 'John', lastName: 'Doe', department: salesDepartmentId
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({
        firstName: 'John', lastName: 'Doe', department: salesDepartmentId
      });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        firstName: 'John', lastName: 'Doe', department: salesDepartmentId
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    }); 

  });

  after(async () => {
    try {
      await Department.deleteMany();
      await mongoose.disconnect();
    } catch(err) {
      console.error(err);
    }
  });

});