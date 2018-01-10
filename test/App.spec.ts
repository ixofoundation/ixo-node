import * as mocha from 'mocha';
import * as chai from 'chai';

import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('App Tests', () => {

  it('should disply API is running', () => {
    return chai.request(app).get('/')
    .then(res => {
      expect(res.text).to.eql('API is running');
    });
  });

});
