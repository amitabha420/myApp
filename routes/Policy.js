
exports.getTerms_and_Conditions = function(req,res)
{
	var input = req.body;

	var url = 'http://syncspot.net/';
	if(input.Type.toLowerCase() == 'android' )
	{
		url = "https://play.google.com/store/apps?hl=en";
	}
	else if(input.Type.toLowerCase() == "ios")
	{
		url = "http://www.google.com/mobile/ios/";
	}
	else if (input.Type.toLowerCase() == 'web') 
	{
		url = "http://www.google.com";
	}

	res.status(200).send({"result": url, "StatusCode" : "200" ,"Message" : "OK"});             
}