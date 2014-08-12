var xml2json = require('xml-to-json');

xml2json({
    input: './lastnames.xml'
}, function(err, result) {

    if(err) {
        console.error(err);
    } else {
        var lastNames = result.root.record.map(function(r) {
        	if(r.prefix) {
        		return r.prefix + ' ' + r.naam;
        	}
        	return r.naam;
        });
        require('fs').writeFileSync('./lastnames.json', JSON.stringify(lastNames), {encoding: 'utf-8'});
    }

});