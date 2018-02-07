import 'mocha';
import * as chai from 'chai';
import {expect} from 'chai';
import app from '../src/App';

const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('App Tests', () => {
    it('should disply API is running', () => {
        return chai.request(app).get('/')
            .then((res: any) => {
                return expect(res.text).to.eql('API is running');
            });
    });

});
