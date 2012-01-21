(camplight = {}).recieveMemberRequest = function(memberInfo, next){
    
    if(typeof camplight.recieveMemberRequest.cache[memberInfo["email"]] != "undefined") {
        next(camplight.recieveMemberRequest.cache[memberInfo["email"]].response);
        return;
    }
    camplight.recieveMemberRequest.cache[memberInfo["email"]] = memberInfo;
    var asQuery = function(memberInfo){
        var r = "";
        for(var key in memberInfo)
            r += key+"="+encodeURIComponent(memberInfo[key])+"&";
        return r;
    }
    var url = "recieveMemberRequest.php?"+asQuery(memberInfo);
    $.getJSON(url, function(response){
        memberInfo.response = response;
        next(response);
    });
    return this;
}
// static runtime cache
camplight.recieveMemberRequest.cache = [];