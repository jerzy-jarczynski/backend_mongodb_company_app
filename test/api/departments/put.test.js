const chai = require('chai');
const chaiHttp = require('chai-http');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('PUT /api/departments', () => {

  let server;
  
  before(async () => {
    // Starts the server before each test
    server = require('../../../server');
    const testDepOne = new Department({ 
      _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' 
    });
    await testDepOne.save();
  });

  it('/:id should update chosen document and return success', async () => {
    const res = await request(server)
    .put('/api/departments/5d9f1140f10a81216cfd4408')
    .send({ 
      name: '=#Department #1=' 
    });
    const updatedDep = await Department.findOne({ 
      name: '=#Department #1=' 
    });
    expect(res.status).to.be.equal(200);
    expect(res.body).to.not.be.null;
    expect(updatedDep.name).to.be.equal('=#Department #1=');
  });

  after(async () => {
    // Close database connections and server after each test
    await Department.deleteMany();
    server.close();
  });

});