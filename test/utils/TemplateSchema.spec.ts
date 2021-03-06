import 'mocha';
import {expect} from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {TemplateSchema} from '../../src/templates/TemplateSchema';

chai.use(chaiAsPromised);

describe('TemplateSchema', function () {
    var schema = new TemplateSchema(
        {
            "@context": "http://ixo.foundation/schema",
            "@type": "Agent",
            "so": "http://schema.org/",
            "ixo": "http://ixo.foundation/schema",
            "email": "so:email",
            "name": "so:name",
            "role": "ixo:roleType",
            "projectTx": "ixo:transactionID",
            "template": {
                "@type": "Template",
                "name": "ixo:templateName"
            }
        });
    var data = {
        email: "a@somewhere.com",
        name: "joe",
        role: "EA",
        projectTx: "4263576243795",
        template: {
            name: "template1",
        }
    };

    it('should return validate', function () {
        return expect(schema.isValidForData(data)).to.eql(true);
    });

    it('should return fail: Additional field', function () {
        var data = {...data};
        data.template = {...data.template, type: "projects"};

        return expect(schema.isValidForData(data)).to.eql(false);
    });

});