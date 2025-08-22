var doc = document;
var blocks = [];
var key_map = [];
var value_map = [];
var getReadyToFetchMemberNameFlag = false;

performDataExtraction();


function getValue(id, map, type) {
    var result = "";
    var b = map[id];
    if (b.relationships !== null && b.relationships.length > 0) {
        for (var y in b.relationships) {
            if (b.relationships[y].type == type) {
                if (b.relationships[y].ids !== null && b.relationships[y].ids.length > 0) {
                    for (var i in b.relationships[y].ids) {
                        var id = b.relationships[y].ids[i];
                        result += blocks[id].text + " ";
                    }
                }
            }
        }
    }
    return result;

}


function invokeUntilAvailable(renditionName) {
    var _rendition = getAISRendition();

    for (var i = 0;(_rendition == undefined || _rendition == null); i++) {
        _rendition = getAISRendition(renditionName);
        logger.info("COUNTER - " + i + " - IS RENDITION UNDEFINED ???  - " + (_rendition == undefined || _rendition == null));
        if (i == 100) {
            break;
        }
    }


    return _rendition;
}

function getAISRendition(renditionName) {
    return renditionService.getRenditionByName(doc, renditionName);
}



function performDataExtraction() {


	//var aisRendition = renditionService.getRenditionByName(doc, "cm:aiTextract");
	var aisRendition = invokeUntilAvailable("cm:aiTextract");

    if (aisRendition !== undefined && aisRendition !== null) {
        logger.info("**** RENDITION IS VERY MUCH AVAILABLE ****");

        var rdoc = search.findNode(aisRendition.nodeRef);
        if (rdoc !== null && rdoc.content !== undefined) {


            var j = JSON.parse(rdoc.content);

            // Loop all blocks and construct an array of all blocks, one with all key blocks and one with all value blocks
            if (j !== undefined && j.blocks.length > 0) {
                for (var x in j.blocks) {
                    var block = j.blocks[x];
                    blocks[block.id] = block;


                    if (block.entityTypes !== null && block.entityTypes.length > 0) {
                        if (block.entityTypes[0] == "KEY") {
                            key_map[block.id] = block;
                        }
                        if (block.entityTypes[0] == "VALUE") {
                            value_map[block.id] = block;
                        }
                    }

                    if (block.blockType == "LINE") {
                        if ((block.text.match(/Name/gi)) && (doc.properties["tx:memberName"] == "")) {
                            getReadyToFetchMemberNameFlag = true;
                            continue;
                        }

                        if (getReadyToFetchMemberNameFlag) {
                            doc.properties["tx:memberName"] = block.text;
                            getReadyToFetchMemberNameFlag = false;
                        }
                    }




                    doc.save();


                }

            }


            // Loop all key blocks, lookup the value
            for (var k in key_map) {
                var kblock = key_map[k];
                var ktext = getValue(kblock.id, key_map, "CHILD");
                var value = "";
                if (kblock.relationships !== null && kblock.relationships.length > 0) {
                    for (r in kblock.relationships) {
                        if (kblock.relationships[r].type == "VALUE") {
                            for (i in kblock.relationships[r].ids) {
                                value += getValue(kblock.relationships[r].ids[i], value_map, "CHILD") + " ";
                            }
                        }
                    }
				}

                logger.info("\nKey: " + ktext + "\nValue: " + value + "\n");

//BK 2024-08-21:  adjusted to fit id content model and patterns from textract output for Drivers License

				if ((ktext.match(/First Name/i))) {
                    doc.properties["ins:FirstName"] = value;
                }
                if ((ktext.match(/Last Name/i))) {
                    doc.properties["ins:LastName"] = value;
                }
                if ((ktext.match(/Social Secutiry Number/i))) {
                    doc.properties["ins:SSN"] = value;
                }				
				if ((ktext.match(/Start Date/i))) {
                    doc.properties["ins:StartDate"] = value;
                }				
				if ((ktext.match(/End Date/i))) {
                    doc.properties["ins:EndDate"] = value;
                }
				if ((ktext.match(/Street Address/i))) {
                    doc.properties["ins:StreetAddress"] = value;
                }
				if ((ktext.match(/City/i))) {
                    doc.properties["ins:City"] = value;
                }
                if ((ktext.match(/State/i))) {
                    doc.properties["ins:State"] = value;
                }
                if ((ktext.match(/Zip Code/i))) {
                    doc.properties["ins:ZipCode"] = value;
                }
				if ((ktext.match(/^Sex/i))) {
                    doc.properties["ins:Sex"] = value;
                }
				if ((ktext.match(/Date of Birth/i))) {
                    doc.properties["ins:DOB"] = value;
                }
				if ((ktext.match(/E-Mail/i))) {
                    doc.properties["ins:Email"] = value;
                }
				if ((ktext.match(/Phone/i))) {
                    doc.properties["ins:Phone"] = value;
                }
				if ((ktext.match(/Deductible/i))) {
                    doc.properties["ins:Deductible"] = value;
                }
				if ((ktext.match(/Coisurance/i))) {
                    doc.properties["ins:Coisurance"] = value;
                }
				if ((ktext.match(/Out-of-Pocket Limit/i))) {
                    doc.properties["ins:OOPLimit"] = value;
                }
				if ((ktext.match(/Policy Number/i))) {
                    doc.properties["ins:PolicyNumber"] = value;
                }
				
				
                }

                doc.save();


            }
		
			if ((doc.properties["ins:StreetAddress"])) {
					logger.info("ins:StreetAddress - " + doc.properties["ins:StreetAddress"]);
					var statematches = doc.properties["ins:StreetAddress"].match(/\s([A-Z][A-Z])\s/);
					if (statematches) {
						logger.info("!*!*!*!* length of returned match" + statematches.length);
						doc.properties["ins:State"] = statematches[0];
				}
			doc.save();
		
            logger.log("\n--- **** **** **** ---\n");
        }

    } else {
        logger.info("**** RENDITION IS NOT YET AVAILABLE. AIS IS WORKING ON THE DOCUMENT ****");
    }

}
