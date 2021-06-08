const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {

    ///// add permissions to roles 

    ac.grant("user")
        .readOwn("profile")
        .updateOwn("profile")
        .deleteOwn("profile")

    ac.grant("supervisor")
        .extend("user")
        .readAny("profile")

    ac.grant("admin")
        .extend("user")
        .extend("supervisor")
        .updateAny("profile")
        .deleteAny("profile")

    ac.grant("user")
       .readAny("post")
       .updateOwn("post")
       .deleteOwn("post")

    ac.grant("supervisor")
        .extend("user")
        .readAny("post")

    ac.grant("admin")
        .extend("user")
        .extend("supervisor")
        .updateOwn("post")
        .deleteAny("post")

    return ac;
})();