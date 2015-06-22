
/*INPUT
	{
		"Type" : "android"
	}
*/

exports.getTerms_and_Conditions = function(req,res)
{
	var input = req.body;

	var data = {
		"privacyLink" : "http://syncspot.net/",
		"termsLink" : "http://syncspot.net/"
	};

	
	if(input.Type.toLowerCase() == 'android' )
	{
		data.privacyLink = "http://syncspot.net/";
		data.termsLink = "http://syncspot.net/";
	}
	else if(input.Type.toLowerCase() == "ios")
	{
		data.privacyLink = "http://syncspot.net/";
		data.termsLink = "http://syncspot.net/";
	}
	else if (input.Type.toLowerCase() == 'web') 
	{
		data.privacyLink = "http://syncspot.net/";
		data.termsLink = "http://syncspot.net/";
	}

	res.status(200).send({"result": data, "StatusCode" : "200" ,"Message" : "OK"});             
}